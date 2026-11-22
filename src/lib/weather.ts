/** Rain detection rules for Chengdu live weather; browser-safe and testable. */
export const CHENGDU_WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=30.66&longitude=104.07&current=temperature_2m,precipitation,weather_code&timezone=Asia%2FShanghai";

export function isRainy(code: number, precipitationMm: number) {
  return precipitationMm > 0.1 || (code >= 51 && code <= 67) || (code >= 80 && code <= 99);
}

export async function fetchChengduWeather(signal?: AbortSignal) {
  const res = await fetch(CHENGDU_WEATHER_URL, { signal });
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const data = (await res.json()) as { current?: { temperature_2m?: number; precipitation?: number; weather_code?: number } };
  const c = data.current ?? {};
  return { rain: isRainy(c.weather_code ?? 0, c.precipitation ?? 0), temp: Math.round(c.temperature_2m ?? 0) };
}
