const BASE_URL = "https://api.travelpayouts.com";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

export async function tpGet(path: string): Promise<unknown> {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) throw new Error("TRAVELPAYOUTS_TOKEN обязателен. Получите на travelpayouts.com");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      const sep = path.includes("?") ? "&" : "?";
      const response = await fetch(`${BASE_URL}${path}${sep}token=${token}`, {
        headers: { "Accept": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (response.ok) return response.json();
      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 1000 * 2 ** (attempt - 1)));
        continue;
      }
      throw new Error(`Travelpayouts HTTP ${response.status}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) continue;
      throw error;
    }
  }
  throw new Error("Travelpayouts: все попытки исчерпаны");
}
