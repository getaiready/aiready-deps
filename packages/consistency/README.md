# @aiready/consistency

> AIReady Spoke: Scans for naming violations, architectural drift, and pattern mismatches that confuse AI agents.

[![npm version](https://img.shields.io/npm/v/@aiready/consistency.svg)](https://npmjs.com/package/@aiready/consistency)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Consistent naming and projectAI models reason better when your code follows consistent naming and structural patterns. **Consistency** analyzer identifies drift and enforces conventions to clarify intent.

### Language Support

- **Full Support:** TypeScript, JavaScript, Python, Java, Go, C#
- **Capabilities:** Naming conventions, pattern consistency, auto-fix suggestions.

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
  CON = consistency ★         AMP = change-amplification
  DEP = deps-health           DOC = doc-drift
  SIG = ai-signal-clarity     AGT = agent-grounding
  TST = testability           CTR = contract-enforcement
  ★   = YOU ARE HERE
```

## Features

- **Naming Conventions**: Enforces consistent naming for files, classes, and variables.
- **Architectural Guardrails**: Ensures components stay within their defined layer (e.g., spokes don't import from other spokes).
- **Pattern Matcher**: Detects if new code follows established project patterns.

## Installation

```bash
pnpm add @aiready/consistency
```

## Usage

```bash
aiready scan . --tools consistency
```

## License

MIT
