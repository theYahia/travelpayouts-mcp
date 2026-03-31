import { describe, it, expect, vi } from "vitest";

vi.mock("../src/client.js", () => ({
  tpGet: vi.fn(),
}));

import { searchFlightsSchema, getPopularSchema, getCalendarSchema } from "../src/tools/flights.js";

describe("searchFlightsSchema", () => {
  it("accepts valid params", () => {
    const result = searchFlightsSchema.safeParse({
      origin: "MOW",
      destination: "LED",
      departure_at: "2025-06",
    });
    expect(result.success).toBe(true);
  });

  it("requires origin and destination", () => {
    expect(searchFlightsSchema.safeParse({}).success).toBe(false);
    expect(searchFlightsSchema.safeParse({ origin: "MOW" }).success).toBe(false);
  });

  it("applies defaults", () => {
    const result = searchFlightsSchema.parse({ origin: "MOW", destination: "LED" });
    expect(result.one_way).toBe(true);
    expect(result.limit).toBe(10);
  });
});

describe("getPopularSchema", () => {
  it("accepts origin", () => {
    const result = getPopularSchema.safeParse({ origin: "MOW" });
    expect(result.success).toBe(true);
  });

  it("requires origin", () => {
    expect(getPopularSchema.safeParse({}).success).toBe(false);
  });
});

describe("getCalendarSchema", () => {
  it("accepts origin and destination", () => {
    const result = getCalendarSchema.safeParse({ origin: "MOW", destination: "LED" });
    expect(result.success).toBe(true);
  });

  it("requires both fields", () => {
    expect(getCalendarSchema.safeParse({ origin: "MOW" }).success).toBe(false);
    expect(getCalendarSchema.safeParse({}).success).toBe(false);
  });
});
