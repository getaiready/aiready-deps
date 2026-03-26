# @aiready/contract-enforcement

> AIReady Spoke: Measures structural type safety and contract enforcement to reduce downstream fallback cascades for AI agents.

[![npm version](https://img.shields.io/npm/v/@aiready/contract-enforcement.svg)](https://npmjs.com/package/@aiready/contract-enforcement)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

AI agents rely on strong structural contracts to navigate codebases safely. When type safety is bypassed or errors are swallowed, agents lose context and may hallucinate or fail silently. The **Contract Enforcement** analyzer detects defensive coding anti-patterns and scores how well the codebase enforces structural contracts.

## 🏛️ Architecture

```
                    🎯 USER
                      │
                      ▼
         🎛️  @aiready/cli (orchestrator)
          │     │     │     │     │     │     │     │     │     │
          ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼
        [PAT] [CTX] [CON] [AMP] [DEP] [DOC] [SIG] [AGT] [TST] [CTR]
          │     │     │     │     │     │     │     │     │     │
          └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
                               │
                               ▼
                      🏢 @aiready/core

Legend:
  PAT = pattern-detect        CTX = context-analyzer
  CON = consistency           AMP = change-amplification
  DEP = deps-health           DOC = doc-drift
  SIG = ai-signal-clarity     AGT = agent-grounding
  TST = testability           CTR = contract-enforcement ★
  ★   = YOU ARE HERE
```

## Features

- **Type Escape Hatches**: Detects `as any`, `as unknown`, and `any` parameter/return types that bypass type safety.
- **Fallback Cascades**: Identifies deep optional chaining (`?.?.?`) and nullish coalescing with literal defaults that suggest missing upstream guarantees.
- **Error Transparency**: Flags swallowed catch blocks where errors are silenced, hiding failures from agents.
- **Boundary Validation**: Detects unvalidated environment variable access and unnecessary guard clauses that could be handled via stronger types at the source.

## Scoring Dimensions

- **Type Escape Hatches (35%)**: Measures the density of `any` and `unknown` bypasses.
- **Fallback Cascades (25%)**: Evaluates reliance on inline defaults vs. structural guarantees.
- **Error Transparency (20%)**: penalizes silent failures and swallowed exceptions.
- **Boundary Validation (20%)**: Assesses the use of validated schemas vs. ad-hoc guards.

## Installation

```bash
pnpm add @aiready/contract-enforcement
```

## Usage

This tool is designed to be run through the unified AIReady CLI.

```bash
# Scan for contract enforcement quality
aiready scan . --tools contract-enforcement
```

## License

MIT
