"use client";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/FilterBar";
import Controls from "@/components/Controls";
import RoiChart from "@/components/RoiChart";
import { fetchRoi } from "@/lib/api";

export default function Page() {
  const [filters, setFilters] = useState<{app?:string; country?:string; channel?:string; bidType?:string;}>({});
  const [mode, setMode] = useState<"raw"|"ma7">("ma7");
  const [scale, setScale] = useState<"linear"|"log">("linear");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchRoi({ ...filters, mode, scale, limitDays: 90 }).then(setData);
  }, [filters, mode, scale]);

  const title = useMemo(()=>{
    return `App-${filters.app ?? "X"} - 多时间维度ROI趋势`;
  }, [filters.app]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="text-neutral-600">(7日移动平均)</div>
        </div>
        <div className="text-sm text-neutral-500 mt-2 md:mt-0">
          数据范围：<span className="font-medium">最近90天</span>
        </div>
      </div>
      <div className="bg-neutral-100 p-4 rounded-xl mt-6 space-y-4 shadow-sm">
        <FilterBar value={filters} onChange={setFilters} />
        <div className="border-t border-neutral-300 my-2"></div>
        <Controls mode={mode} scale={scale} onChange={v=>{ if(v.mode) setMode(v.mode); if(v.scale) setScale(v.scale); }} />
      </div>
      {data ? (
        <RoiChart dates={data.dates} series={data.series} insufficient={data.insufficient} scale={scale} />
      ) : (
        <div className="mt-8 text-neutral-500">加载中...</div>
      )}
    </div>
  );
}
