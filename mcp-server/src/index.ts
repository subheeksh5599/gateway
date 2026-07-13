#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// ── GitHub API helpers ──────────────────────────────────────────────

const GITHUB_API = "https://api.github.com";

interface GitHubTool {
  name: string;
  description: string;
  inputSchema: Tool["inputSchema"];
  handler: (args: Record<string, unknown>) => Promise<string>;
}

async function githubFetch(path: string): Promise<unknown> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "gateway-mcp-server/1.0",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// ── Tool definitions ─────────────────────────────────────────────────

const tools: GitHubTool[] = [
  {
    name: "search_issues",
    description:
      "Search GitHub issues and pull requests across repositories. Use this to find bugs, feature requests, or any tracked work.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (e.g., 'login bug', 'is:issue is:open label:bug')",
        },
        repo: {
          type: "string",
          description: "Optional: restrict to a specific repo (format: owner/repo)",
        },
        limit: {
          type: "number",
          description: "Maximum results to return (default: 5, max: 10)",
          default: 5,
        },
      },
      required: ["query"],
    },
    async handler(args) {
      const query = args.query as string;
      const repo = args.repo as string | undefined;
      const limit = Math.min((args.limit as number) || 5, 10);

      let q = query;
      if (repo) q = `${query} repo:${repo}`;

      const data = (await githubFetch(
        `/search/issues?q=${encodeURIComponent(q)}&per_page=${limit}&sort=updated&order=desc`
      )) as { items?: Array<{ title: string; html_url: string; state: string; repository_url: string; user: { login: string }; created_at: string }> };

      if (!data.items?.length) return "No issues found matching that query.";

      return data.items
        .map(
          (item) =>
            `**${item.title}** (${item.state})\n` +
            `  Repo: ${item.repository_url.split("/repos/")[1]}\n` +
            `  By: @${item.user.login} · ${item.created_at.slice(0, 10)}\n` +
            `  ${item.html_url}`
        )
        .join("\n\n");
    },
  },

  {
    name: "list_pull_requests",
    description: "List open pull requests for a repository. Shows PR title, author, branch, and status.",
    inputSchema: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "Repository in owner/repo format (e.g., 'facebook/react')",
        },
        state: {
          type: "string",
          description: "PR state: open, closed, or all (default: open)",
          enum: ["open", "closed", "all"],
        },
        limit: {
          type: "number",
          description: "Max results (default: 5)",
          default: 5,
        },
      },
      required: ["repo"],
    },
    async handler(args) {
      const repo = args.repo as string;
      const state = (args.state as string) || "open";
      const limit = Math.min((args.limit as number) || 5, 10);

      const data = (await githubFetch(
        `/repos/${repo}/pulls?state=${state}&per_page=${limit}&sort=updated&direction=desc`
      )) as Array<{ title: string; html_url: string; user: { login: string }; head: { ref: string }; base: { ref: string }; created_at: string; draft: boolean }>;

      if (!data.length) return `No ${state} pull requests found in ${repo}.`;

      return data
        .map(
          (pr) =>
            `**#${pr.html_url.split("/pull/")[1]} ${pr.title}** ${pr.draft ? "[DRAFT] " : ""}\n` +
            `  By: @${pr.user.login} · ${pr.created_at.slice(0, 10)}\n` +
            `  ${pr.head.ref} → ${pr.base.ref}\n` +
            `  ${pr.html_url}`
        )
        .join("\n\n");
    },
  },

  {
    name: "get_repo_info",
    description: "Get information about a GitHub repository: stars, forks, open issues, description, language.",
    inputSchema: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "Repository in owner/repo format",
        },
      },
      required: ["repo"],
    },
    async handler(args) {
      const repo = args.repo as string;
      const data = (await githubFetch(`/repos/${repo}`)) as {
        full_name: string;
        description: string;
        stargazers_count: number;
        forks_count: number;
        open_issues_count: number;
        language: string;
        html_url: string;
        updated_at: string;
      };

      return (
        `**${data.full_name}**\n` +
        `  ${data.description || "No description"}\n` +
        `  ⭐ ${data.stargazers_count} · 🍴 ${data.forks_count} · ⚠️ ${data.open_issues_count} open issues\n` +
        `  Language: ${data.language || "N/A"} · Updated: ${data.updated_at.slice(0, 10)}\n` +
        `  ${data.html_url}`
      );
    },
  },

  {
    name: "search_code",
    description: "Search code across GitHub repositories. Find function definitions, configurations, or patterns.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Code search query (e.g., 'useContractRead language:typescript')",
        },
        repo: {
          type: "string",
          description: "Optional: restrict to a specific repo (format: owner/repo)",
        },
        limit: {
          type: "number",
          description: "Max results (default: 3, max: 5)",
          default: 3,
        },
      },
      required: ["query"],
    },
    async handler(args) {
      const query = args.query as string;
      const repo = args.repo as string | undefined;
      const limit = Math.min((args.limit as number) || 3, 5);

      let q = query;
      if (repo) q = `${query} repo:${repo}`;

      const data = (await githubFetch(
        `/search/code?q=${encodeURIComponent(q)}&per_page=${limit}`
      )) as { items?: Array<{ name: string; path: string; html_url: string; repository: { full_name: string } }> };

      if (!data.items?.length) return "No code matches found.";

      return data.items
        .map(
          (item) =>
            `**${item.path}** in ${item.repository.full_name}\n  ${item.html_url}`
        )
        .join("\n\n");
    },
  },

  {
    name: "get_file_content",
    description: "Fetch the content of a file from a GitHub repository. Returns the raw file content.",
    inputSchema: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "Repository in owner/repo format",
        },
        path: {
          type: "string",
          description: "Path to the file in the repo (e.g., 'README.md', 'src/app.ts')",
        },
        ref: {
          type: "string",
          description: "Branch or commit SHA (default: main)",
        },
      },
      required: ["repo", "path"],
    },
    async handler(args) {
      const repo = args.repo as string;
      const path = args.path as string;
      const ref = (args.ref as string) || "main";

      const data = (await githubFetch(
        `/repos/${repo}/contents/${path}?ref=${ref}`
      )) as { content?: string; encoding?: string; size: number; name: string };

      if (!data.content) return `File not found: ${path} in ${repo}`;

      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const preview = content.slice(0, 2000);
      const truncated = content.length > 2000 ? `\n\n... (${content.length - 2000} more characters)` : "";

      return `**${data.name}** (${data.size} bytes)\n\`\`\`\n${preview}${truncated}\n\`\`\``;
    },
  },
];

// ── Server ──────────────────────────────────────────────────────────

const server = new Server(
  {
    name: "gateway-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
  })),
}));

// Call tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find((t) => t.name === request.params.name);
  if (!tool) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
      isError: true,
    };
  }

  try {
    const result = await tool.handler(request.params.arguments ?? {});
    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// Start
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Gateway MCP Server running on stdio");
  console.error("Tools: search_issues, list_pull_requests, get_repo_info, search_code, get_file_content");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
