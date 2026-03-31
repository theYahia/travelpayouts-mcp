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
  version: "1.0.0",
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
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[travelpayouts-mcp] Сервер запущен. 3 инструмента. Требуется TRAVELPAYOUTS_TOKEN.");
}

main().catch((error) => {
  console.error("[travelpayouts-mcp] Ошибка:", error);
  process.exit(1);
});
