# Gateway MCP Server — Claude Desktop Setup

## Install

```bash
cd mcp-server
npm install
npm run build
```

## Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "gateway": {
      "command": "node",
      "args": ["/absolute/path/to/gateway/mcp-server/build/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_..." 
      }
    }
  }
}
```

## Tools Available

| Tool | Description |
|------|-------------|
| `search_issues` | Search GitHub issues across repos |
| `list_pull_requests` | List open PRs for any repo |
| `get_repo_info` | Get stars, forks, language, description |
| `search_code` | Search code across GitHub |
| `get_file_content` | Read file contents from any repo |

## Test with MCP Inspector

```bash
cd mcp-server
npx @modelcontextprotocol/inspector node build/index.js
```

## Test via CLI

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_repo_info","arguments":{"repo":"modelcontextprotocol/servers"}}}' | node mcp-server/build/index.js
```
