import { z } from "zod";
import { tpGet } from "../client.js";

export const searchFlightsPricesSchema = z.object({
  origin: z.string().describe("Origin city IATA code (e.g. MOW, LED)"),
  destination: z.string().describe("Destination city IATA code"),
  departure_at: z.string().optional().describe("Departure date YYYY-MM-DD or YYYY-MM"),
  return_at: z.string().optional().describe("Return date YYYY-MM-DD or YYYY-MM"),
  one_way: z.boolean().default(true).describe("One-way flight only"),
  currency: z.string().default("rub").describe("Currency code (rub, usd, eur)"),
  limit: z.number().int().min(1).max(100).default(10).describe("Number of results"),
});

export async function handleSearchFlightsPrices(params: z.infer<typeof searchFlightsPricesSchema>): Promise<string> {
  const q = new URLSearchParams();
  q.set("origin", params.origin);
  q.set("destination", params.destination);
  if (params.departure_at) q.set("departure_at", params.departure_at);
  if (params.return_at) q.set("return_at", params.return_at);
  q.set("one_way", String(params.one_way));
  q.set("currency", params.currency);
  q.set("limit", String(params.limit));
  const result = await tpGet(`/aviasales/v3/prices_for_dates?${q.toString()}`);
  return JSON.stringify(result, null, 2);
}

export const getCheapestMonthSchema = z.object({
  origin: z.string().describe("Origin city IATA code"),
  destination: z.string().describe("Destination city IATA code"),
  month: z.string().describe("Month in YYYY-MM format"),
  currency: z.string().default("rub").describe("Currency code"),
});

export async function handleGetCheapestMonth(params: z.infer<typeof getCheapestMonthSchema>): Promise<string> {
  const q = new URLSearchParams();
  q.set("origin", params.origin);
  q.set("destination", params.destination);
  q.set("departure_at", params.month);
  q.set("currency", params.currency);
  q.set("sorting", "price");
  q.set("limit", "30");
  const result = await tpGet(`/aviasales/v3/prices_for_dates?${q.toString()}`);
  return JSON.stringify(result, null, 2);
}

export const getCalendarPricesSchema = z.object({
  origin: z.string().describe("Origin city IATA code"),
  destination: z.string().describe("Destination city IATA code"),
  departure_at: z.string().optional().describe("Departure month YYYY-MM"),
  return_at: z.string().optional().describe("Return month YYYY-MM"),
  currency: z.string().default("rub").describe("Currency code"),
});

export async function handleGetCalendarPrices(params: z.infer<typeof getCalendarPricesSchema>): Promise<string> {
  const q = new URLSearchParams();
  q.set("origin", params.origin);
  q.set("destination", params.destination);
  if (params.departure_at) q.set("departure_at", params.departure_at);
  if (params.return_at) q.set("return_at", params.return_at);
  q.set("currency", params.currency);
  const result = await tpGet(`/aviasales/v3/calendar?${q.toString()}`);
  return JSON.stringify(result, null, 2);
}

export const getPopularDirectionsSchema = z.object({
  origin: z.string().describe("Origin city IATA code"),
  currency: z.string().default("rub").describe("Currency code"),
});

export async function handleGetPopularDirections(params: z.infer<typeof getPopularDirectionsSchema>): Promise<string> {
  const result = await tpGet(`/aviasales/v3/get_special_offers?origin=${params.origin}&currency=${params.currency}`);
  return JSON.stringify(result, null, 2);
}

export const getAirlineDirectionsSchema = z.object({
  airline_code: z.string().describe("IATA airline code (e.g. SU, S7, DP)"),
  limit: z.number().int().min(1).max(100).default(30).describe("Number of results"),
});

export async function handleGetAirlineDirections(params: z.infer<typeof getAirlineDirectionsSchema>): Promise<string> {
  const result = await tpGet(`/aviasales/v3/prices_for_dates?airline=${params.airline_code}&limit=${params.limit}&sorting=route&currency=rub`);
  return JSON.stringify(result, null, 2);
}

export const getSpecialOffersSchema = z.object({
  currency: z.string().default("rub").describe("Currency code"),
  locale: z.string().default("ru").describe("Locale (ru, en)"),
});

export async function handleGetSpecialOffers(params: z.infer<typeof getSpecialOffersSchema>): Promise<string> {
  const result = await tpGet(`/aviasales/v3/get_special_offers?currency=${params.currency}&locale=${params.locale}`);
  return JSON.stringify(result, null, 2);
}
