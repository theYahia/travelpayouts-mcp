const BASE_URL = "https://api.travelpayouts.com";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

export async function tpGet(path: string, useHeader = false): Promise<unknown> {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) throw new Error("TRAVELPAYOUTS_TOKEN is required. Get it at travelpayouts.com/developers");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      let url: string;
      const headers: Record<string, string> = { "Accept": "application/json" };

      if (useHeader) {
        url = `${BASE_URL}${path}`;
        headers["X-Access-Token"] = token;
      } else {
        const sep = path.includes("?") ? "&" : "?";
        url = `${BASE_URL}${path}${sep}token=${token}`;
      }

      const response = await fetch(url, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) return response.json();

      if (response.status === 403 || response.status === 401) {
        throw new Error(`Travelpayouts: authentication error (HTTP ${response.status}). Check TRAVELPAYOUTS_TOKEN.`);
      }

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[travelpayouts-mcp] ${response.status}, retry in ${delay}ms (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const text = await response.text();
      throw new Error(`Travelpayouts HTTP ${response.status}: ${text}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        if (attempt < MAX_RETRIES) {
          console.error(`[travelpayouts-mcp] Timeout, retry (${attempt}/${MAX_RETRIES})`);
          continue;
        }
        throw new Error("Travelpayouts: request timeout (10s). Try again later.");
      }
      throw error;
    }
  }
  throw new Error("Travelpayouts: all retries exhausted");
}
