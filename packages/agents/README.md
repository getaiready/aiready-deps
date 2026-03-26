# @aiready/agents

> AIReady Spoke: Agent orchestration, task execution, and multi-step workflow management for AI-native development.

[![npm version](https://img.shields.io/npm/v/@aiready/agents.svg)](https://npmjs.com/package/@aiready/agents)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The **Agents** package provides the orchestration layer for running AI-powered tasks against a codebase. It manages multi-step agent workflows, coordinates tool execution, and handles the feedback loops that enable autonomous analysis and remediation.

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
  TST = testability           CTR = contract-enforcement

  agents = orchestration layer (this package)
```

## Features

- **Workflow Orchestration**: Manages multi-step agentic workflows coordinating multiple AIReady spokes
- **Task Execution**: Runs analysis tasks and remediation actions with proper error handling and retries
- **Feedback Loops**: Implements verify→fix→verify cycles for autonomous code improvement
- **Tool Integration**: Bridges AIReady analysis tools with AI model APIs

## Installation

```bash
pnpm add @aiready/agents
```

## Usage

This package is primarily used as an internal orchestration layer by `@aiready/cli`.

```bash
# Run via the unified CLI
aiready scan . --tools agents
```

## License

MIT
