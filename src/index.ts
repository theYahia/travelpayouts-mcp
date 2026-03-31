#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  searchFlightsSchema, handleSearchFlights,
  getPopularSchema as getPopularRoutesSchema, handleGetPopular as handleGetPopularRoutes,
  getCalendarSchema as getPricesCalendarSchema, handleGetCalendar as handleGetPricesCalendar,
} from "./tools/flights.js";

const server = new McpServer({
  name: "travelpayouts-mcp",
  version: "1.1.0",
});

server.tool(
  "search_flights",
  "Поиск дешёвых авиабилетов.",
  searchFlightsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSearchFlights(params) }] }),
);

server.tool(
  "get_popular_routes",
  "Популярные направления из города.",
  getPopularRoutesSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetPopularRoutes(params) }] }),
);

server.tool(
  "get_prices_calendar",
  "Календарь цен на авиабилеты.",
  getPricesCalendarSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetPricesCalendar(params) }] }),
);

async function main() {
  const httpPort = process.env.HTTP_PORT || (process.argv.includes("--http") ? process.argv[process.argv.indexOf("--http") + 1] : null);
  if (httpPort) {
    const port = parseInt(String(httpPort), 10) || 3000;
    await startHttpTransport(port);
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[travelpayouts-mcp] Сервер запущен (stdio). 3 инструмента.");
  }
}

async function startHttpTransport(port: number) {
  const { createServer } = await import("node:http");
  const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined as unknown as (() => string) });
  const httpServer = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", tools: 3, transport: "streamable-http" }));
      return;
    }
    if (req.url === "/mcp") { await transport.handleRequest(req, res); return; }
    res.writeHead(404); res.end("Not found. Use /mcp or /health.");
  });
  await server.connect(transport);
  httpServer.listen(port, () => {
    console.error(`[travelpayouts-mcp] HTTP server on port ${port}. 3 tools available.`);
  });
}

const isDirectRun = process.argv[1]?.endsWith("index.js") || process.argv[1]?.endsWith("index.ts");
if (isDirectRun) {
  main().catch((error) => { console.error("[travelpayouts-mcp] Ошибка:", error); process.exit(1); });
}

export { server };
