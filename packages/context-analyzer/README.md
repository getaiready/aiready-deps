# @aiready/context-analyzer

> AIReady Spoke: Analyzes import chains, fragmented code, and context window costs for AI tools.

[![npm version](https://img.shields.io/npm/v/@aiready/context-analyzer.svg)](https://npmjs.com/package/@aiready/context-analyzer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

AI tokens are expensive and context windows are finite. **Context Analyzer** helps you map dependencies and identify fragmentation that wastes AI resources.

### Language Support

- **Full Support:** TypeScript, JavaScript, Python, Java, Go, C#
- **Capabilities:** Import depth, context budget, dependency mapping.

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
  PAT = pattern-detect        CTX = context-analyzer ★
  CON = consistency           AMP = change-amplification
  DEP = deps-health           DOC = doc-drift
  SIG = ai-signal-clarity     AGT = agent-grounding
  TST = testability           CTR = contract-enforcement
  ★   = YOU ARE HERE
```

## Features

- **Import Chain Analysis**: Detects deep dependency trees that force unnecessary files into AI context.
- **Fragmentation detection**: Identifies modules that are split across too many small, non-semantic files.
- **Context Budgeting**: Projects the dollar cost of loading specific modules into frontier models (GPT-4, Claude 3.5).

## Installation

```bash
pnpm add @aiready/context-analyzer
```

## Usage

```bash
aiready scan . --tools context-analyzer
```

## License

MIT
