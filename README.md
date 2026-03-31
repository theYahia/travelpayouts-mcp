# @theyahia/travelpayouts-mcp

MCP server for **Travelpayouts** API. 3 tools for flight search, popular routes, and price calendar.

[![npm](https://img.shields.io/npm/v/@theyahia/travelpayouts-mcp)](https://www.npmjs.com/package/@theyahia/travelpayouts-mcp)
[![license](https://img.shields.io/npm/l/@theyahia/travelpayouts-mcp)](./LICENSE)

## Quick Start

### Claude Desktop

```json
{
  "mcpServers": {
    "travelpayouts": {
      "command": "npx",
      "args": ["-y", "@theyahia/travelpayouts-mcp"],
      "env": {
        "TRAVELPAYOUTS_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add travelpayouts -- npx -y @theyahia/travelpayouts-mcp
```

Set env: `TRAVELPAYOUTS_TOKEN`.

### Cursor / Windsurf

```json
{
  "travelpayouts": {
    "command": "npx",
    "args": ["-y", "@theyahia/travelpayouts-mcp"],
    "env": {
      "TRAVELPAYOUTS_TOKEN": "your-api-token"
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `search_flights` | Search cheap flights by origin/destination/date |
| `get_popular_routes` | Popular routes from a city |
| `get_prices_calendar` | Price calendar for a route |

## Auth

| Variable | Required | Description |
|----------|----------|-------------|
| `TRAVELPAYOUTS_TOKEN` | Yes | API token from travelpayouts.com |

## HTTP Transport

```bash
HTTP_PORT=3000 npx @theyahia/travelpayouts-mcp
# or
npx @theyahia/travelpayouts-mcp --http 3000
```

Endpoints: `POST /mcp` (JSON-RPC), `GET /health` (status).

## Skills

- **skill-search-flights** -- search cheap flights by route and dates
- **skill-popular-routes** -- discover popular destinations from any city

## License

MIT
