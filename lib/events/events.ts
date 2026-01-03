import { TimeRange } from "@/types/event";

export const rangeToMs: Record<TimeRange, number> = {
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};

export const isWithinRange = (ts: string, range: TimeRange) => {
  const now = Date.now();
  return now - new Date(ts).getTime() <= rangeToMs[range];
}
