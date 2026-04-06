import { createLogger } from "@theyahia/mcp-core";

const logger = createLogger("travelpayouts-mcp");

const TP_BASE = "https://api.travelpayouts.com";
const HOTELLOOK_BASE = "https://engine.hotellook.com/api/v2";

function createToken(): string {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) throw new Error("TRAVELPAYOUTS_TOKEN is required. Get it at travelpayouts.com");
  return token;
}

let _token: string | null = null;
function getToken(): string {
  if (!_token) _token = createToken();
  return _token;
}

export async function tpGet(path: string, hotellook = false): Promise<unknown> {
  const token = getToken();
  const base = hotellook ? HOTELLOOK_BASE : TP_BASE;
  const sep = path.includes("?") ? "&" : "?";
  const url = `${base}${path}${sep}token=${token}`;

  logger.debug("tpGet", { url: url.replace(token, "***") });

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Travelpayouts API ${path} → ${res.status}: ${text}`);
  }

  return res.json();
}
