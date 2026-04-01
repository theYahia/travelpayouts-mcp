import { z } from "zod";
import { tpGet } from "../client.js";

export const searchHotelsSchema = z.object({
  location: z.string().describe("City name or IATA code for hotel search"),
  check_in: z.string().describe("Check-in date YYYY-MM-DD"),
  check_out: z.string().describe("Check-out date YYYY-MM-DD"),
  adults: z.number().int().min(1).max(6).default(2).describe("Number of adults"),
  currency: z.string().default("rub").describe("Currency code"),
  limit: z.number().int().min(1).max(50).default(15).describe("Number of results"),
});

export async function handleSearchHotels(params: z.infer<typeof searchHotelsSchema>): Promise<string> {
  const q = new URLSearchParams();
  q.set("location", params.location);
  q.set("checkIn", params.check_in);
  q.set("checkOut", params.check_out);
  q.set("adults", String(params.adults));
  q.set("currency", params.currency);
  q.set("limit", String(params.limit));

  const result = await tpGet(`/hotellook/v2/cache.json?${q.toString()}`, true);
  return JSON.stringify(result, null, 2);
}

export const getHotelPricesSchema = z.object({
  hotel_id: z.number().describe("Hotel ID from search results"),
  check_in: z.string().describe("Check-in date YYYY-MM-DD"),
  check_out: z.string().describe("Check-out date YYYY-MM-DD"),
  adults: z.number().int().min(1).max(6).default(2).describe("Number of adults"),
  currency: z.string().default("rub").describe("Currency code"),
});

export async function handleGetHotelPrices(params: z.infer<typeof getHotelPricesSchema>): Promise<string> {
  const q = new URLSearchParams();
  q.set("hotelId", String(params.hotel_id));
  q.set("checkIn", params.check_in);
  q.set("checkOut", params.check_out);
  q.set("adults", String(params.adults));
  q.set("currency", params.currency);

  const result = await tpGet(`/hotellook/v2/cache.json?${q.toString()}`, true);
  return JSON.stringify(result, null, 2);
}
