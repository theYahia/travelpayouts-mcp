import { z } from "zod";
import { tpGet } from "../client.js";

export const lookupAirportsSchema = z.object({
  query: z.string().describe("Название города, аэропорта или IATA-код (напр. Москва, SVO, Moscow)"),
  lang: z.string().default("ru").describe("Язык результатов (ru, en)"),
  limit: z.number().int().min(1).max(20).default(5).describe("Количество результатов"),
});

export const lookupAirlinesSchema = z.object({
  lang: z.string().default("ru").describe("Язык названий авиакомпаний (ru, en)"),
});

export const lookupCitiesSchema = z.object({
  query: z.string().describe("Название города для поиска (напр. Москва, Moscow)"),
  lang: z.string().default("ru").describe("Язык результатов (ru, en)"),
  limit: z.number().int().min(1).max(20).default(5).describe("Количество результатов"),
});

export async function handleLookupAirports(
  params: z.infer<typeof lookupAirportsSchema>
): Promise<string> {
  const q = new URLSearchParams({
    term: params.query,
    lang: params.lang,
    limit: String(params.limit),
    types: "airport",
  });
  const result = await tpGet(`/aviasales/v3/autocomplete?${q.toString()}`);
  return JSON.stringify(result, null, 2);
}

export async function handleLookupAirlines(
  params: z.infer<typeof lookupAirlinesSchema>
): Promise<string> {
  const result = await tpGet(`/data/${params.lang}/airlines.json`);
  return JSON.stringify(result, null, 2);
}

export async function handleLookupCities(
  params: z.infer<typeof lookupCitiesSchema>
): Promise<string> {
  const q = new URLSearchParams({
    term: params.query,
    lang: params.lang,
    limit: String(params.limit),
    types: "city",
  });
  const result = await tpGet(`/aviasales/v3/autocomplete?${q.toString()}`);
  return JSON.stringify(result, null, 2);
}
