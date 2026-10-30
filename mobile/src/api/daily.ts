import { apiGet } from "./client";
import { DailyEditionResponse } from "../types";

export function fetchDaily(dateISO?: string): Promise<DailyEditionResponse> {
  const qs = dateISO ? `?date=${dateISO}` : "";
  return apiGet<DailyEditionResponse>(`/api/daily${qs}`);
}
