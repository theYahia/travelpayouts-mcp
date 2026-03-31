import { z } from "zod";
import { tpGet } from "../client.js";

export const searchFlightsSchema = z.object({
  origin: z.string().describe("Код города вылета (IATA, например MOW)"),
  destination: z.string().describe("Код города прилёта (IATA, например LED)"),
  departure_at: z.string().optional().describe("Дата вылета YYYY-MM или YYYY-MM-DD"),
  one_way: z.boolean().default(true).describe("Только в одну сторону"),
  limit: z.number().default(10).describe("Количество результатов"),
});

export async function handleSearchFlights(params: z.infer<typeof searchFlightsSchema>): Promise<string> {
  const q = new URLSearchParams();
  q.set("origin", params.origin);
  q.set("destination", params.destination);
  if (params.departure_at) q.set("departure_at", params.departure_at);
  q.set("one_way", String(params.one_way));
  q.set("limit", String(params.limit));
  q.set("currency", "rub");
  const result = await tpGet(`/aviasales/v3/prices_for_dates?${q.toString()}`);
  return JSON.stringify(result, null, 2);
}

export const getPopularSchema = z.object({
  origin: z.string().describe("Код города (IATA)"),
});

export async function handleGetPopular(params: z.infer<typeof getPopularSchema>): Promise<string> {
  const result = await tpGet(`/aviasales/v3/get_special_offers?origin=${params.origin}&currency=rub`);
  return JSON.stringify(result, null, 2);
}

export const getCalendarSchema = z.object({
  origin: z.string().describe("Код города вылета"),
  destination: z.string().describe("Код города прилёта"),
});

export async function handleGetCalendar(params: z.infer<typeof getCalendarSchema>): Promise<string> {
  const result = await tpGet(`/aviasales/v3/calendar?origin=${params.origin}&destination=${params.destination}&currency=rub`);
  return JSON.stringify(result, null, 2);
}
