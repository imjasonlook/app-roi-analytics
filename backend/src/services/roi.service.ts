import { PrismaClient } from "@prisma/client";
import { movingAverage } from "../utils/ma.js";
import { RoiQuery } from "../utils/zod-schemas.js";

const prisma = new PrismaClient();

const ROI_KEYS = ["roi_d0","roi_d1","roi_d3","roi_d7","roi_d14","roi_d30","roi_d60","roi_d90"] as const;

export async function queryRoi(q: RoiQuery) {
  const { app, country, channel, bidType, start, end, mode, limitDays } = q;

  const where: any = {};
  if (app) where.app = app;
  if (country) where.country = country;
  if (channel) where.channel = channel;
  if (bidType) where.bidType = bidType;
  if (start || end) {
    where.date = {};
    if (start) where.date.gte = new Date(start);
    if (end) where.date.lte = new Date(end);
  }

  const rows = await prisma.roiRecord.findMany({
    where,
    orderBy: { date: "asc" }
  });

  const data = start || end ? rows : rows.slice(Math.max(0, rows.length - limitDays));

  const dates = data.map(d => d.date.toISOString().slice(0,10));

  const series: Record<string, (number|null)[]> = {};
  for (const key of ROI_KEYS) {
    const vals = data.map(d => Number((d as any)[key]));
    const ma = mode === "ma7" ? movingAverage(vals, 7) : vals.map(v=>v);
    series[key] = ma.map(v => Number.isFinite(v) ? v! : null);
  }

  const insufficient: Record<string, boolean[]> = {};
  for (const key of ROI_KEYS) {
    const suffKey = "is_zero_insufficient_" + key.split("_")[1];
    const mask = data.map((d: any) => Boolean(d[suffKey]));
    insufficient[key] = mask;
  }

  return { dates, series, insufficient };
}

export async function listFilters() {
  const [apps, countries, channels, bidTypes] = await Promise.all([
    prisma.roiRecord.findMany({ distinct: ["app"], select: { app: true } }),
    prisma.roiRecord.findMany({ distinct: ["country"], select: { country: true } }),
    prisma.roiRecord.findMany({ distinct: ["channel"], select: { channel: true } }),
    prisma.roiRecord.findMany({ distinct: ["bidType"], select: { bidType: true } }),
  ]);
  return {
    apps: apps.map(x => x.app).sort(),
    countries: countries.map(x => x.country).sort(),
    channels: channels.map(x => x.channel).sort(),
    bidTypes: bidTypes.map(x => x.bidType).sort(),
  };
}
