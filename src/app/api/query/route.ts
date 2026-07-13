import { NextRequest, NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

async function githubFetch(path: string) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "gateway/1.0",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const { query } = (await request.json()) as { query: string };

    // Parse natural language query → decide which GitHub endpoints to call
    const results: { tool: string; data: string }[] = [];

    const q = query.toLowerCase();

    // Detect "pull request" / "PR" queries
    if (q.includes("pull request") || q.includes("pr") || q.includes("review")) {
      const repos = ["facebook/react", "vercel/next.js", "modelcontextprotocol/servers"];
      for (const repo of repos) {
        try {
          const prs = (await githubFetch(
            `/repos/${repo}/pulls?state=open&per_page=2&sort=updated&direction=desc`
          )) as Array<{
            title: string;
            html_url: string;
            user: { login: string };
            created_at: string;
            head: { ref: string };
            base: { ref: string };
          }>;

          if (prs.length) {
            results.push({
              tool: `GitHub (${repo})`,
              data: prs
                .map(
                  (pr) =>
                    `**${pr.title}**\n@${pr.user.login} · ${pr.created_at.slice(0, 10)}\n${pr.head.ref} → ${pr.base.ref}\n${pr.html_url}`
                )
                .join("\n\n"),
            });
          }
        } catch {
          // Skip rate-limited repos
        }
      }
    }

    // Detect "status" / "bug" / "fix" queries → search issues
    if (q.includes("status") || q.includes("bug") || q.includes("fix") || q.includes("issue")) {
      // Search React repo for relevant issues
      try {
        const issues = (await githubFetch(
          `/search/issues?q=${encodeURIComponent(query)}+repo:facebook/react&per_page=3&sort=updated`
        )) as {
          items?: Array<{
            title: string;
            html_url: string;
            state: string;
            user: { login: string };
            created_at: string;
          }>;
        };

        if (issues.items?.length) {
          results.push({
            tool: "GitHub Issues",
            data: issues.items
              .map(
                (i) =>
                  `**${i.title}** (${i.state})\n@${i.user.login} · ${i.created_at.slice(0, 10)}\n${i.html_url}`
              )
              .join("\n\n"),
          });
        }
      } catch {
        // Skip
      }
    }

    // Always try to get repo info for a relevant repo
    if (q.includes("repo") || q.includes("github") || results.length === 0) {
      try {
        const repoInfo = (await githubFetch("/repos/modelcontextprotocol/servers")) as {
          full_name: string;
          description: string;
          stargazers_count: number;
          open_issues_count: number;
          language: string;
          html_url: string;
        };

        results.push({
          tool: "GitHub Repo Info",
          data: `**${repoInfo.full_name}**\n${repoInfo.description}\n⭐ ${repoInfo.stargazers_count.toLocaleString()} · ${repoInfo.open_issues_count} open issues\nLanguage: ${repoInfo.language}\n${repoInfo.html_url}`,
        });
      } catch {
        // Skip
      }
    }

    if (results.length === 0) {
      return NextResponse.json({
        response: `I searched across GitHub but couldn't find results for "${query}". Try asking about pull requests, issues, or repository info.`,
        toolCalls: [],
      });
    }

    const response = results.map((r) => `**${r.tool}**\n${r.data}`).join("\n\n---\n\n");

    return NextResponse.json({
      response,
      toolCalls: results.map((r) => r.tool),
    });
  } catch (error) {
    return NextResponse.json(
      {
        response: `Error querying tools: ${error instanceof Error ? error.message : "Unknown error"}`,
        toolCalls: [],
      },
      { status: 500 }
    );
  }
}
