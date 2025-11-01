import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import { parse } from "fast-csv";

const prisma = new PrismaClient();

const HORIZONS = [
  { key: "d0", days: 0 },
  { key: "d1", days: 1 },
  { key: "d3", days: 3 },
  { key: "d7", days: 7 },
  { key: "d14", days: 14 },
  { key: "d30", days: 30 },
  { key: "d60", days: 60 },
  { key: "d90", days: 90 },
];

function pctToFloat(s: string): number {
  if (!s) return 0;
  const n = Number(String(s).replace('%','').trim());
  return isFinite(n) ? n/100 : 0;
}

export async function importCsv(filePath: string) {
  const rows: any[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ headers: true, ignoreEmpty: true, trim: true }))
      .on("error", reject)
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve());
  });

  const dates = rows.map(r => new Date(r["日期"] || r["date"]));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  const chunks: any[] = [];
  for (const r of rows) {
    const date = new Date(r["日期"] || r["date"]);
    const app = r["app"] || r["APP"] || r["App"] || r["应用名称"];
    const country = r["国家地区"] || r["country"] || "";
    const channel = r["用户安装渠道"] || r["channel"] || "Apple";
    const bidType = r["出价类型"] || r["bidType"] || "CPI";
    const installs = Number(r["应用安装.总次数"] || r["installs"] || 0);

    const rec: any = {
      date, app, country, channel, bidType, installs,
      roi_d0:  pctToFloat(r["当日ROI"] || r["roi_d0"]),
      roi_d1:  pctToFloat(r["1日ROI"] || r["roi_d1"]),
      roi_d3:  pctToFloat(r["3日ROI"] || r["roi_d3"]),
      roi_d7:  pctToFloat(r["7日ROI"] || r["roi_d7"]),
      roi_d14: pctToFloat(r["14日ROI"] || r["roi_d14"]),
      roi_d30: pctToFloat(r["30日ROI"] || r["roi_d30"]),
      roi_d60: pctToFloat(r["60日ROI"] || r["roi_d60"]),
      roi_d90: pctToFloat(r["90日ROI"] || r["roi_d90"]),
    };

    for (const { key, days } of HORIZONS) {
      const roiKey = `roi_${key}`;
      const isZero = rec[roiKey] === 0;
      const insufficient = (maxDate.getTime() - date.getTime()) / 86400000 < days;
      rec[`is_zero_insufficient_${key}`] = isZero && insufficient;
      rec[`is_zero_real_${key}`] = isZero && !insufficient;
    }
    chunks.push(rec);
  }

  await prisma.$transaction([
    prisma.roiRecord.deleteMany(),
    prisma.roiRecord.createMany({ data: chunks })
  ]);

  return { total: chunks.length, maxDate };
}
