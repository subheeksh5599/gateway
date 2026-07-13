import pkg from "@slack/bolt";
const { App } = pkg;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const GITHUB_API = "https://api.github.com";

async function githubFetch(path) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "gateway-slack/1.0",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

async function handleQuery(query) {
  const q = query.toLowerCase();
  const results = [];

  if (q.includes("pull request") || q.includes("pr")) {
    const repos = ["facebook/react", "vercel/next.js"];
    for (const repo of repos) {
      try {
        const prs = await githubFetch(
          `/repos/${repo}/pulls?state=open&per_page=2&sort=updated`
        );
        if (prs.length) {
          results.push(
            `*GitHub (${repo})*\n${prs
              .map(
                (pr) =>
                  `• <${pr.html_url}|${pr.title}>\n  _@${pr.user.login} · ${pr.created_at.slice(0, 10)}_`
              )
              .join("\n")}`
          );
        }
      } catch {}
    }
  }

  if (q.includes("issue") || q.includes("bug")) {
    try {
      const issues = await githubFetch(
        `/search/issues?q=${encodeURIComponent(query)}+repo:facebook/react&per_page=3&sort=updated`
      );
      if (issues.items?.length) {
        results.push(
          `*GitHub Issues*\n${issues.items
            .map((i) => `• <${i.html_url}|${i.title}> (${i.state}) — @${i.user.login}`)
            .join("\n")}`
        );
      }
    } catch {}
  }

  if (results.length === 0) {
    try {
      const repo = await githubFetch("/repos/modelcontextprotocol/servers");
      results.push(
        `*GitHub: ${repo.full_name}*\n${repo.description}\n⭐ ${repo.stargazers_count.toLocaleString()} · ${repo.open_issues_count} open issues`
      );
    } catch {
      return `Sorry, I couldn't find results for "${query}". Try asking about pull requests, issues, or repositories.`;
    }
  }

  return results.join("\n\n");
}

// Listen for @gateway mentions
app.event("app_mention", async ({ event, say }) => {
  const query = event.text.replace(/<@[^>]+>/, "").trim();
  if (!query) {
    await say("Ask me anything! Try: `@gateway show open PRs in React`");
    return;
  }

  await say(`🔍 Searching: _${query}_...`);

  try {
    const response = await handleQuery(query);
    await say(response);
  } catch (error) {
    await say(`❌ Error: ${error.message}`);
  }
});

// Slash command: /gateway
app.command("/gateway", async ({ command, ack, say }) => {
  await ack();
  const query = command.text.trim();
  if (!query) {
    await say("Usage: `/gateway <your question>`\nExample: `/gateway show open PRs in React`");
    return;
  }

  await say(`🔍 *${command.user_name}* asked: _${query}_`);

  try {
    const response = await handleQuery(query);
    await say(response);
  } catch (error) {
    await say(`❌ Error: ${error.message}`);
  }
});

// Start
async function main() {
  await app.start();
  console.log("⚡ Gateway Slack Agent is running!");
  console.log("   @gateway in any channel, or use /gateway command");
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
