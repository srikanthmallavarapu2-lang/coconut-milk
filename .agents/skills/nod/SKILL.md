---
name: nod
description: >-
  Use Nod (by n8n Labs) — the open-source personal AI agent running locally on your machine
  with its own virtual computer/browser environment to execute tasks across apps, websites,
  workflows, and local automation.
---

# Nod (n8n Personal AI Agent) Integration Guide

Nod is an open-source personal AI agent created by n8n Labs, running locally on your computer at:
`C:\Users\MY PC\Projects\nod`

## Quick Overview
- **Repository**: [https://github.com/n8n-io/nod](https://github.com/n8n-io/nod)
- **Local Path**: `C:\Users\MY PC\Projects\nod`
- **Default Port**: `http://127.0.0.1:4310`
- **Engine**: Node.js with TypeScript, Fastify, and native Chrome `agent-browser`.

## Starting Nod

### 1. Development API Server
To start Nod's local server and API:
```powershell
cd "c:\Users\MY PC\Projects\nod"
pnpm dev:server
```
Runs on `http://127.0.0.1:4310`.

### 2. Desktop Application Mode
To launch the desktop interface:
```powershell
cd "c:\Users\MY PC\Projects\nod"
pnpm desktop:dev
```

### 3. Production Start
```powershell
cd "c:\Users\MY PC\Projects\nod"
pnpm start
```

## Configuration & Environment (`.env`)
Configuration is stored in `c:\Users\MY PC\Projects\nod\.env`.
Supported LLM providers include:
- **Gemini**: `LLM_PROVIDER=gemini`, `GEMINI_API_KEY=<your-key>`
- **OpenAI**: `LLM_PROVIDER=openai`, `OPENAI_API_KEY=<your-key>`
- **Anthropic**: `LLM_PROVIDER=anthropic`, `ANTHROPIC_API_KEY=<your-key>`
- **Local / Ollama**: `LLM_PROVIDER=openai-compatible`, `OPENAI_COMPATIBLE_BASE_URL=http://localhost:11434/v1`

## Key Capabilities
- **Web Automation**: Uses native `agent-browser` with Chrome to execute tasks on real web pages.
- **Workflow Automation**: Connects with n8n triggers, webhooks, and local scripts.
- **App Integrations**: Supports Gmail, Slack, Calendar, Notion, Linear, etc.
- **Safety**: Requests user confirmation before executing external actions.
