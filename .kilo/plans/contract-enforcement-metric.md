# Contract Enforcement Metric — Implementation Plan

## Context

The codebase has strong type definitions in `packages/core` but inconsistent enforcement at system boundaries. This creates a defensive coding cascade: when a source doesn't enforce contracts, every downstream consumer must add `?.`/`??` fallbacks, `as any` casts, and guard clauses. This metric measures the gap between structural contract definitions and the defensive patterns needed to compensate.

**Current state:** ~80 `?.` instances, ~50 `as any` casts, ~15 error-swallowing try/catch blocks in production code. Root causes: `any` at boundaries (60%), inconsistent tool output shapes, untyped DynamoDB results, no env var schema.

**Goal:** A new spoke metric `contract-enforcement` that detects defensive coding anti-patterns and scores how well the codebase enforces structural contracts, so downstream consumers don't need excessive fallback logic.

---

## Architecture

New spoke package `@aiready/contract-enforcement` following the established `createProvider` pattern. Uses ESTree AST via `@typescript-eslint/typescript-estree` (already a dependency of `@aiready/core`) to detect 6 defensive coding patterns.

---

## Implementation Steps

### Step 1: Core Enum & Scoring Registration

**File: `packages/core/src/types/enums.ts`**

- Add `ContractEnforcement = 'contract-enforcement'` to `ToolName` enum (line 33)
- Add `[ToolName.ContractEnforcement]: 'Contract Enforcement'` to `FRIENDLY_TOOL_NAMES` (line 55)
- Add `ContractGap = 'contract-gap'` to `IssueType` enum (line 86)

**File: `packages/core/src/scoring.ts`**

- Add `[ToolName.ContractEnforcement]: 10` to `DEFAULT_TOOL_WEIGHTS` (after line 39)
- Add `'contract-enforcement': ToolName.ContractEnforcement` to `TOOL_NAME_MAP` (after line 63)
- Add `'contract': ToolName.ContractEnforcement` alias
- Add `ContractEnforcement` to `ScoringProfile.Agentic` with weight 15 (it directly relates to AI safety)
- Add `ContractEnforcement` to `ScoringProfile.Security` with weight 10

### Step 2: Create Spoke Package

**Directory: `packages/contract-enforcement/`**

#### `package.json`

```json
{
  "name": "@aiready/contract-enforcement",
  "version": "0.1.0",
  "description": "Measures structural contract enforcement to reduce defensive coding cascades",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.cjs",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest run",
    "lint": "eslint src"
  },
  "dependencies": {
    "@aiready/core": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "tsup": "^8.3.5",
    "typescript": "^5.0.0",
    "vitest": "^4.0.0"
  }
}
```

#### `tsconfig.json`

```json
{
  "extends": "../core/tsconfig.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### `src/types.ts`

```typescript
import type { Issue, IssueType, Severity } from '@aiready/core';

// Defensive pattern categories
export type DefensivePattern =
  | 'as-any' // `as any` type assertions
  | 'as-unknown' // `as unknown as X` double casts
  | 'deep-optional-chain' // `?.` chained > 2 levels
  | 'nullish-literal-default' // `?? 'literal'` or `?? 0`
  | 'swallowed-error' // empty catch / console.log catch
  | 'env-fallback' // `process.env.X || 'default'`
  | 'unnecessary-guard' // `if (!x) return` where x should be non-nullable
  | 'any-parameter' // function param typed as `any`
  | 'any-return'; // function return typed as `any`;

export interface ContractEnforcementIssue extends Issue {
  type: IssueType.ContractGap;
  pattern: DefensivePattern;
  context: string; // the source code snippet
}

export interface PatternCounts {
  'as-any': number;
  'as-unknown': number;
  'deep-optional-chain': number;
  'nullish-literal-default': number;
  'swallowed-error': number;
  'env-fallback': number;
  'unnecessary-guard': number;
  'any-parameter': number;
  'any-return': number;
}

export interface ContractEnforcementOptions {
  rootDir: string;
  include?: string[];
  exclude?: string[];
  onProgress?: (processed: number, total: number, message: string) => void;
  /** Minimum chain depth to flag (default: 3) */
  minChainDepth?: number;
}

export interface ContractEnforcementReport {
  summary: {
    sourceFiles: number;
    totalDefensivePatterns: number;
    defensiveDensity: number; // patterns per 1000 LOC
    score: number; // 0-100
    rating: string;
    dimensions: {
      typeEscapeHatchScore: number; // as-any, as-unknown, any-param, any-return
      fallbackCascadeScore: number; // deep optional chains, nullish literal defaults
      errorTransparencyScore: number; // swallowed errors
      boundaryValidationScore: number; // env fallbacks, unnecessary guards
    };
  };
  issues: ContractEnforcementIssue[];
  rawData: PatternCounts & { sourceFiles: number; totalLines: number };
  recommendations: string[];
}
```

#### `src/detector.ts` — AST-based pattern detection

Uses `parse` from `@typescript-eslint/typescript-estree` to get ESTree AST, then walks the tree to detect:

| Pattern                      | AST Node                                                                              | Detection Logic                    |
| ---------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------- | ----------------------------- |
| `as any`                     | `TSAsExpression` where `typeAnnotation` is `TSAnyKeyword`                             | Direct match                       |
| `as unknown as`              | `TSAsExpression` where `typeAnnotation` is `TSUnknownKeyword`                         | Check for parent `TSAsExpression`  |
| Deep `?.` (>2)               | `ChainExpression` with nested `MemberExpression.optional`                             | Count consecutive optional members |
| `?? 'literal'`               | `LogicalExpression.operator === '??'` where `right` is `Literal` or `TemplateLiteral` | Right operand type check           |
| Swallowed error              | `TryStatement` where `handler.body.body` is empty or only `console.*`                 | Body analysis                      |
| `process.env.X \|\| default` | `LogicalExpression.operator === '                                                     |                                    | '`where`left`is`process.env` access | Pattern match on left operand |
| `if (!x) return` guard       | `IfStatement` with `UnaryExpression('!')` test and `ReturnStatement` consequent       | Check position in function body    |
| `any` parameter              | `FunctionDeclaration`/`ArrowFunctionExpression` with `TSAnyKeyword` param type        | Param type annotation check        |
| `any` return                 | `FunctionDeclaration`/`ArrowFunctionExpression` with `TSAnyKeyword` return type       | Return type annotation check       |

Key implementation: a single recursive `visit(node, parent)` function that handles all 6 patterns per node visit. File is read once, parsed once, walked once.

```typescript
import { parse, TSESTree } from '@typescript-eslint/typescript-estree';

export interface DetectionResult {
  issues: ContractEnforcementIssue[];
  counts: PatternCounts;
  totalLines: number;
}

export function detectDefensivePatterns(
  filePath: string,
  code: string,
  minChainDepth: number = 3
): DetectionResult { ... }
```

#### `src/analyzer.ts`

```typescript
import { scanFiles, runBatchAnalysis } from '@aiready/core';
import { detectDefensivePatterns } from './detector';
import { calculateContractEnforcementScore } from './scoring';

export async function analyzeContractEnforcement(
  options: ContractEnforcementOptions
): Promise<ContractEnforcementReport> {
  const files = await scanFiles({
    ...options,
    include: options.include || ['**/*.{ts,tsx,js,jsx}'],
  });

  const allIssues: ContractEnforcementIssue[] = [];
  const aggregate: PatternCounts = {
    /* all zeros */
  };
  let totalLines = 0;

  await runBatchAnalysis(
    files,
    'scanning for defensive patterns',
    'contract-enforcement',
    options.onProgress,
    async (f: string) => {
      const code = readFileSync(f, 'utf-8');
      return detectDefensivePatterns(f, code, options.minChainDepth);
    },
    (result: DetectionResult) => {
      allIssues.push(...result.issues);
      totalLines += result.totalLines;
      for (const key of Object.keys(aggregate) as DefensivePattern[]) {
        aggregate[key] += result.counts[key];
      }
    }
  );

  const totalPatterns = Object.values(aggregate).reduce((a, b) => a + b, 0);
  const density = totalLines > 0 ? (totalPatterns / totalLines) * 1000 : 0;

  // Score calculation
  const scoreResult = calculateContractEnforcementScore(
    aggregate,
    totalLines,
    files.length
  );

  return {
    summary: {
      sourceFiles: files.length,
      totalDefensivePatterns: totalPatterns,
      defensiveDensity: Math.round(density * 10) / 10,
      score: scoreResult.score,
      rating: scoreResult.rating,
      dimensions: scoreResult.dimensions,
    },
    issues: allIssues,
    rawData: { ...aggregate, sourceFiles: files.length, totalLines },
    recommendations: scoreResult.recommendations,
  };
}
```

#### `src/scoring.ts`

Scoring dimensions and weights:

| Dimension                 | What it measures                               | Calculation                              |
| ------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `typeEscapeHatchScore`    | `as any` + `as unknown` + `any` params/returns | 100 - (count / LOC _ 1000 _ 15), floor 0 |
| `fallbackCascadeScore`    | Deep `?.` chains + `??` literal defaults       | 100 - (count / LOC _ 1000 _ 12), floor 0 |
| `errorTransparencyScore`  | Swallowed errors                               | 100 - (count / LOC _ 1000 _ 25), floor 0 |
| `boundaryValidationScore` | Env fallbacks + unnecessary guards             | 100 - (count / LOC _ 1000 _ 10), floor 0 |

Overall score: weighted average of dimensions (type: 35%, fallback: 25%, error: 20%, boundary: 20%).

Uses `buildStandardToolScore` from core.

```typescript
export function calculateContractEnforcementScore(
  counts: PatternCounts,
  totalLines: number,
  fileCount: number
): {
  score: number;
  rating: string;
  dimensions: Record<string, number>;
  recommendations: string[];
};
```

#### `src/provider.ts`

```typescript
import {
  createProvider,
  ToolName,
  type ScanOptions,
  type AnalysisResult,
} from '@aiready/core';

export const ContractEnforcementProvider = createProvider({
  id: ToolName.ContractEnforcement,
  alias: ['contract', 'ce', 'enforcement'],
  version: '0.1.0',
  defaultWeight: 10,
  async analyzeReport(options: ScanOptions) {
    return analyzeContractEnforcement(options as ContractEnforcementOptions);
  },
  getResults(report): AnalysisResult[] {
    // Group issues by file
  },
  getSummary(report) {
    return report.summary;
  },
  getMetadata(report) {
    return { rawData: report.rawData };
  },
  score(output) {
    // Reconstruct report from output and call calculateContractEnforcementScore
  },
});
```

#### `src/index.ts`

```typescript
import { ToolRegistry } from '@aiready/core';
import { ContractEnforcementProvider } from './provider';

ToolRegistry.register(ContractEnforcementProvider);

export { analyzeContractEnforcement } from './analyzer';
export { calculateContractEnforcementScore } from './scoring';
export { ContractEnforcementProvider };
export type {
  ContractEnforcementOptions,
  ContractEnforcementReport,
  ContractEnforcementIssue,
} from './types';
```

### Step 3: CLI Orchestrator Wiring

**File: `packages/cli/src/orchestrator.ts`**

- Add to `TOOL_PACKAGE_MAP`:
  ```typescript
  [ToolName.ContractEnforcement]: '@aiready/contract-enforcement',
  'contract-enforcement': '@aiready/contract-enforcement',
  'contract': '@aiready/contract-enforcement',
  ```

### Step 4: Build spoke package

```
pnpm --filter @aiready/contract-enforcement build
```

### Step 5: Tests

**File: `packages/contract-enforcement/src/__tests__/detector.test.ts`**

- Test each pattern detection against known code snippets
- Create temp files with known patterns and verify detection count

**File: `packages/contract-enforcement/src/__tests__/scoring.test.ts`**

- Test score calculation with various pattern counts
- Verify floor/ceiling behavior

**File: `packages/contract-enforcement/src/__tests__/provider.test.ts`**

- Test provider integration with `createProvider` contract
- Verify `SpokeOutputSchema` validation passes

### Step 6: Verify

1. `pnpm --filter @aiready/contract-enforcement build` — builds successfully
2. `pnpm --filter @aiready/contract-enforcement test` — tests pass
3. `aiready scan . --tools contract-enforcement` — runs against the codebase
4. Verify the report shows the expected defensive patterns found in the analysis

---

## Files Modified

| File                               | Change                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `packages/core/src/types/enums.ts` | Add `ToolName.ContractEnforcement`, `IssueType.ContractGap`, friendly name |
| `packages/core/src/scoring.ts`     | Add weight, aliases, scoring profile entries                               |
| `packages/cli/src/orchestrator.ts` | Add `TOOL_PACKAGE_MAP` entries                                             |
| `packages/contract-enforcement/*`  | New spoke package (7 files)                                                |

## Files Created

| File                                                           | Purpose                         |
| -------------------------------------------------------------- | ------------------------------- |
| `packages/contract-enforcement/package.json`                   | Package config                  |
| `packages/contract-enforcement/tsconfig.json`                  | TS config                       |
| `packages/contract-enforcement/src/types.ts`                   | Types & interfaces              |
| `packages/contract-enforcement/src/detector.ts`                | AST pattern detection           |
| `packages/contract-enforcement/src/analyzer.ts`                | File scanning + aggregation     |
| `packages/contract-enforcement/src/scoring.ts`                 | Score calculation               |
| `packages/contract-enforcement/src/provider.ts`                | ToolProvider via createProvider |
| `packages/contract-enforcement/src/index.ts`                   | Registration + exports          |
| `packages/contract-enforcement/src/__tests__/detector.test.ts` | Detection tests                 |
| `packages/contract-enforcement/src/__tests__/scoring.test.ts`  | Scoring tests                   |
| `packages/contract-enforcement/src/__tests__/provider.test.ts` | Provider tests                  |

## Verification

1. `pnpm build` — all packages build including new spoke
2. `pnpm --filter @aiready/contract-enforcement test` — unit tests pass
3. `aiready scan packages/core --tools contract-enforcement` — runs on core package
4. Report should show detected patterns matching the analysis (as-any, deep optional chains, swallowed errors)
5. Overall scan score incorporates the new metric
