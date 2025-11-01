export type RoiFilters = {
  apps: string[];
  countries: string[];
  channels: string[];
  bidTypes: string[];
}

export type RoiSeriesResponse = {
  dates: string[];
  series: Record<string, (number|null)[]>;
  insufficient: Record<string, boolean[]>;
}
