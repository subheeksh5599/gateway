<p align="center">
  <h1 style="font-size: 52px; font-weight: 800; letter-spacing: -0.05em;">
    <span style="color: #CCFF00;">Gateway</span> — MCP for Slack
  </h1>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Slack-Agent%20Builder-4A154B?style=for-the-badge&logo=slack">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript">
  <img src="https://img.shields.io/badge/MCP-Protocol-CCFF00?style=for-the-badge">
  <img src="https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel">
</p>

<h1 align="center">Gateway</h1>
<h3 align="center"><em>One Slack agent. Every MCP server.<br>Connect your entire toolchain through a single integration.</em></h3>

<p align="center">
  <strong>Gateway replaces a dozen Slack integrations with one MCP-powered agent. Ask questions in Slack — Gateway queries all your connected tools (GitHub, Jira, Notion, databases) via MCP and returns a synthesized answer in seconds.</strong>
</p>

<p align="center">
  <a href="#the-problem">Problem</a> &bull;
  <a href="#the-solution">Solution</a> &bull;
  <a href="#demo">Demo</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#faq">FAQ</a>
</p>

---

## The Problem

Teams use dozens of tools — GitHub for code, Jira for tickets, Notion for docs, databases for data. Slack sits in the middle but has no unified way to query across them. The result:

| Problem | Impact |
|---------|--------|
| Integration sprawl | Each tool needs its own Slack app, OAuth flow, and maintenance |
| Context switching | Engineers spend 40% of their day switching between tools to find answers |
| Siloed information | "What's the status of X?" requires checking 5 different places |
| Permission chaos | Individual integrations don't respect channel-level Slack permissions |
| MCP ecosystem unreachable | 1,000+ MCP servers exist — none are accessible from Slack natively |

## The Solution

Gateway is an MCP-powered Slack agent that connects your entire toolchain through a single integration. One agent. Any MCP server. Ask questions in Slack, get answers from everywhere.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Slack     │────▶│   Gateway    │────▶│  MCP Servers    │
│  Channels   │     │   Agent      │     │  ┌───────────┐  │
│  @mentions  │     │              │     │  │ GitHub    │  │
│  DMs        │     │  • Route Qs  │     │  │ Jira      │  │
└─────────────┘     │  • Call MCP  │     │  │ Notion    │  │
                    │  • Synthesize│     │  │ Postgres  │  │
                    │  • Enforce   │     │  │ Stripe    │  │
                    │    perms     │     │  │ +1000 more│  │
                    └──────────────┘     │  └───────────┘  │
                                         └─────────────────┘
```

### What you get

- **One-click MCP connect** — Paste any MCP server endpoint, Gateway auto-discovers available tools
- **Natural language queries** — "What's the status of the login bug fix?" queries GitHub, Jira, and Notion in parallel
- **Permission-aware routing** — Every tool call respects Slack channel permissions
- **1000+ MCP servers** — Compatible with the entire MCP ecosystem out of the box
- **Scheduled queries** — Daily standup summaries, weekly sprint reports, hourly pipeline checks
- **Enterprise Grid ready** — Share tool configs across workspaces, zero added latency

## Demo

🔗 **Live:** [gateway-mcp.vercel.app](https://gateway-mcp.vercel.app)

The landing page includes an interactive chat dashboard. Type one of the sample queries to see Gateway route your question across multiple MCP servers and synthesize a response — just like it works in Slack.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | Server components, static generation, optimal perf |
| Styling | Tailwind CSS 4 | Utility-first, zero runtime, design tokens via @theme |
| Language | TypeScript (strict) | Type safety across the full stack |
| Animations | GSAP + Lenis | ScrollTrigger for section reveals, Lenis smooth scroll |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Deployment | Vercel | Edge network, instant deploys, Next.js native |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install and run

```bash
git clone https://github.com/subheeksh5599/gateway.git
cd gateway
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Slack Workspace                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ #eng     │  │ #design  │  │ #general │  ...              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
│       │              │              │                        │
│       └──────────────┼──────────────┘                        │
│                      │ @gateway "what's the status of..."    │
└──────────────────────┼──────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Gateway Agent  │
              │                 │
              │  ┌────────────┐ │
              │  │ Query      │ │  "What's the status of the
              │  │ Parser     │ │   login bug fix?"
              │  └─────┬──────┘ │
              │        │        │
              │  ┌─────▼──────┐ │
              │  │ Tool       │ │  → GitHub: search PRs
              │  │ Router     │ │  → Jira: find tickets
              │  └─────┬──────┘ │  → Notion: check docs
              │        │        │
              │  ┌─────▼──────┐ │
              │  │ MCP Client │ │  Parallel tool calls via
              │  │ (parallel) │ │  Model Context Protocol
              │  └─────┬──────┘ │
              │        │        │
              │  ┌─────▼──────┐ │
              │  │ Response   │ │  Synthesize results into
              │  │ Synthesizer│ │  a single Slack message
              │  └────────────┘ │
              └─────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
    ┌─────▼─────┐ ┌───▼────┐ ┌────▼─────┐
    │ GitHub    │ │ Jira   │ │ Notion   │ ...
    │ MCP Srv   │ │ MCP    │ │ MCP      │
    └───────────┘ └────────┘ └──────────┘
```

### Query Flow

1. **User asks** in Slack: `@gateway what's the status of the login bug fix?`
2. **Query Parser** extracts intent and keywords: "status", "login", "bug", "fix"
3. **Tool Router** determines relevant MCP servers: GitHub (code), Jira (tickets), Notion (docs)
4. **MCP Client** calls all three servers in parallel via the Model Context Protocol
5. **Response Synthesizer** merges results, deduplicates, and formats a single answer
6. **Gateway posts** the answer back to the Slack channel, with links to source data

## FAQ

<details>
<summary><strong>What is MCP (Model Context Protocol)?</strong></summary>

MCP is an open standard that lets AI agents connect to tools and data sources. An MCP server exposes a tool's capabilities — like querying a database, searching docs, or creating tickets — through a standardized JSON-RPC interface. Gateway uses MCP to connect your Slack workspace to all your tools without building custom integrations for each one.
</details>

<details>
<summary><strong>How is Gateway different from individual Slack integrations?</strong></summary>

Individual integrations require separate OAuth flows, configuration, and maintenance for each tool. Gateway replaces all of them with a single agent. Connect any MCP server once, and it's available across your entire Slack workspace. New tools? Just paste the endpoint — no integration work needed.
</details>

<details>
<summary><strong>Can I build my own MCP server?</strong></summary>

Yes. The MCP protocol is open-source. Build an MCP server for your internal API, database, or service, and Gateway will discover it automatically. Here's a minimal example:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "my-internal-tool",
  version: "1.0.0",
}, {
  capabilities: { tools: {} }
});

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_order_status",
    description: "Get the status of an order by ID",
    inputSchema: {
      type: "object",
      properties: { orderId: { type: "string" } }
    }
  }]
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```
</details>

<details>
<summary><strong>Is my data secure?</strong></summary>

Gateway enforces Slack's channel-level permissions — private channel data never leaks to public channels. MCP server connections are encrypted in transit (TLS 1.3). Enterprise plans include SSO, audit logging, and the option to host Gateway on your own infrastructure.
</details>

<details>
<summary><strong>Does it work with Slack Enterprise Grid?</strong></summary>

Yes. Gateway is built for Enterprise Grid from day one. Tool configurations can be shared across workspaces, and permissions are enforced per-channel. Contact sales for Enterprise Grid pricing.
</details>

<details>
<summary><strong>What inspired this project?</strong></summary>

Gateway is based on winning patterns from **Strata (YC P25)** — "One MCP server for AI to handle thousands of tools" — and **MCPay (Colosseum Cypherpunk, Stablecoin 1st)** — which won by connecting the MCP protocol to a new platform. Both proved that infrastructure layers connecting ecosystems win over individual integrations.
</details>

## Powered by

| | |
|---|---|
| **Slack API** | Agent framework for building conversational Slack apps |
| **MCP Protocol** | Open standard for AI agent ↔ tool communication |
| **Next.js 16** | React framework with App Router and server components |
| **Vercel** | Global edge deployment platform |

## License

MIT
