"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from "recharts";
import { useMemo, useState } from "react";

const SERIES = [
  { key: "roi_d0",  name: "当日(7日均值)" },
  { key: "roi_d1",  name: "1日(7日均值)" },
  { key: "roi_d3",  name: "3日(7日均值)" },
  { key: "roi_d7",  name: "7日(7日均值)" },
  { key: "roi_d14", name: "14日(7日均值)" },
  { key: "roi_d30", name: "30日(7日均值)" },
  { key: "roi_d60", name: "60日(7日均值)" },
  { key: "roi_d90", name: "90日(7日均值)" },
];

type Props = {
  dates: string[];
  series: Record<string, (number|null)[]>;
  insufficient: Record<string, boolean[]>;
  scale: "linear"|"log";
};

export default function RoiChart({ dates, series, insufficient, scale }: Props) {
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(SERIES.map(s => [s.key, true]))
  );

const data = useMemo(()=> {
  return dates.map((d, i) => {
    const row: any = { date: d };
    for (const s of SERIES) {
      const v = series[s.key]?.[i] ?? null;
      // ⚠️ log 轴不允许 ≤ 0，渲染时置 null（保持 Tooltip 的原始值）
      row[s.key] = (scale === "log" && (v === null || v <= 0)) ? null : v;
    }
    return row;
  });
}, [dates, series, scale]);

  return (
    <div className="w-full h-[560px] mt-6">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            scale={scale}
            tickFormatter={(v)=> `${Math.round(v*100)}%`}
            domain={scale==="log" ? ["auto","auto"] : ["auto","auto"]}
            allowDataOverflow
          />
          <Tooltip formatter={(v:any)=> `${(v*100).toFixed(2)}%`} />
          <Legend
            onClick={(e: any) => setVisible(v => ({...v, [e.dataKey]: !v[e.dataKey]}))}
          />
          <ReferenceLine y={1} stroke="red" strokeDasharray="4 4" label="100%回本线" />

          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              strokeOpacity={visible[s.key] ? 1 : 0}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
