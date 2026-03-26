# @aiready/skills

> AI-friendly coding practices packaged as agent skills for the [skills.sh](https://skills.sh/) ecosystem.

[![npm version](https://img.shields.io/npm/v/@aiready/skills.svg)](https://npmjs.com/package/@aiready/skills)

## Overview

This package provides procedural knowledge for AI coding agents to help them write and maintain code optimally.

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
  SKL = @aiready/skills ★  (support package — provides AI assistant skill files, not a scorer)
  ★   = YOU ARE HERE
```

## Available Skills

### aiready-best-practices

Guidelines for writing AI-friendly code. Use when:

- Writing new features or refactoring
- Reviewing pull requests
- Preparing codebases for AI adoption

## Installation

### For [skills.sh](https://skills.sh/)

```bash
npx skills add caopengau/aiready-skills
```

### For [Playbooks.com (Paks)](https://playbooks.com/)

```bash
paks install aiready-best-practices
```

## License

MIT
