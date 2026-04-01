#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  searchFlightsPricesSchema, handleSearchFlightsPrices,
  getCheapestMonthSchema, handleGetCheapestMonth,
  getCalendarPricesSchema, handleGetCalendarPrices,
  getPopularDirectionsSchema, handleGetPopularDirections,
  getAirlineDirectionsSchema, handleGetAirlineDirections,
  getSpecialOffersSchema, handleGetSpecialOffers,
} from "./tools/flights.js";
import { searchHotelsSchema, handleSearchHotels, getHotelPricesSchema, handleGetHotelPrices } from "./tools/hotels.js";
import { lookupAirportsSchema, handleLookupAirports, lookupAirlinesSchema, handleLookupAirlines, lookupCitiesSchema, handleLookupCities } from "./tools/lookup.js";

const server = new McpServer({
  name: "travelpayouts-mcp",
  version: "2.0.0",
});

function wrap(handler: (params: any) => Promise<string>) {
  return async (params: any) => {
    try {
      const text = await handler(params);
      return { content: [{ type: "text" as const, text }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
    }
  };
}

// Flights (6)
server.tool("search_flights_prices", "Search cheap flight tickets by route, dates, and currency. Returns prices, airlines, and durations.", searchFlightsPricesSchema.shape, wrap(handleSearchFlightsPrices));
server.tool("get_cheapest_month", "Find the cheapest flights for an entire month on a route. Sorted by price.", getCheapestMonthSchema.shape, wrap(handleGetCheapestMonth));
server.tool("get_calendar_prices", "Get a price calendar for flights on a route. Shows cheapest price per day.", getCalendarPricesSchema.shape, wrap(handleGetCalendarPrices));
server.tool("get_popular_directions", "Get popular flight directions from a city with current prices and special offers.", getPopularDirectionsSchema.shape, wrap(handleGetPopularDirections));
server.tool("get_airline_directions", "Get routes served by a specific airline with prices.", getAirlineDirectionsSchema.shape, wrap(handleGetAirlineDirections));
server.tool("get_special_offers", "Get current special flight offers and deals across all routes.", getSpecialOffersSchema.shape, wrap(handleGetSpecialOffers));

// Hotels (2)
server.tool("search_hotels", "Search hotels by city with check-in/check-out dates. Returns prices and ratings.", searchHotelsSchema.shape, wrap(handleSearchHotels));
server.tool("get_hotel_prices", "Get detailed prices for a specific hotel by ID and dates.", getHotelPricesSchema.shape, wrap(handleGetHotelPrices));

// Lookup (3)
server.tool("lookup_airports", "Search/autocomplete airports and cities by name or IATA code.", lookupAirportsSchema.shape, wrap(handleLookupAirports));
server.tool("lookup_airlines", "Search airlines by name or IATA/ICAO code.", lookupAirlinesSchema.shape, wrap(handleLookupAirlines));
server.tool("lookup_cities", "Search/autocomplete cities by name or IATA code.", lookupCitiesSchema.shape, wrap(handleLookupCities));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[travelpayouts-mcp] Server started. 11 tools. Requires TRAVELPAYOUTS_TOKEN.");
}

main().catch((error) => {
  console.error("[travelpayouts-mcp] Error:", error);
  process.exit(1);
});
