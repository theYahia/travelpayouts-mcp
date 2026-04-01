import { z } from "zod";
import { tpGet } from "../client.js";

export const lookupAirportsSchema = z.object({
  query: z.string().describe("Search query — airport or city name, IATA code"),
  locale: z.string().default("ru").describe("Locale (ru, en)"),
});

export async function handleLookupAirports(params: z.infer<typeof lookupAirportsSchema>): Promise<string> {
  const result = await tpGet(`/aviasales/v3/autocomplete?term=${encodeURIComponent(params.query)}&locale=${params.locale}&types[]=airport&types[]=city`);
  return JSON.stringify(result, null, 2);
}

export const lookupAirlinesSchema = z.object({
  query: z.string().describe("Search query — airline name or IATA code"),
});

export async function handleLookupAirlines(params: z.infer<typeof lookupAirlinesSchema>): Promise<string> {
  // Use the data API for airlines
  const result = await tpGet(`/data/ru/airlines.json`, true);
  const airlines = result as Array<{ name: string; iata: string; icao?: string; is_lowcost?: boolean }>;

  if (!Array.isArray(airlines)) {
    return JSON.stringify(result, null, 2);
  }

  const q = params.query.toLowerCase();
  const filtered = airlines.filter(a =>
    a.name?.toLowerCase().includes(q) ||
    a.iata?.toLowerCase() === q ||
    a.icao?.toLowerCase() === q
  ).slice(0, 20);

  if (filtered.length === 0) {
    return `No airlines found matching "${params.query}".`;
  }

  return JSON.stringify(filtered.map(a => ({
    name: a.name,
    iata: a.iata,
    icao: a.icao,
    is_lowcost: a.is_lowcost,
  })), null, 2);
}

export const lookupCitiesSchema = z.object({
  query: z.string().describe("Search query — city name or IATA code"),
  locale: z.string().default("ru").describe("Locale (ru, en)"),
});

export async function handleLookupCities(params: z.infer<typeof lookupCitiesSchema>): Promise<string> {
  const result = await tpGet(`/aviasales/v3/autocomplete?term=${encodeURIComponent(params.query)}&locale=${params.locale}&types[]=city`);
  return JSON.stringify(result, null, 2);
}
