"use client";
import { useEffect, useState } from "react";
import { fetchFilters } from "@/lib/api";

type Props = {
  value: { app?: string; country?: string; channel?: string; bidType?: string; };
  onChange: (v: Props["value"]) => void;
};

export default function FilterBar({ value, onChange }: Props) {
  const [opts, setOpts] = useState<{apps:string[], countries:string[], channels:string[], bidTypes:string[]}>({apps:[], countries:[], channels:[], bidTypes:[]});
  useEffect(()=>{ fetchFilters().then(setOpts); },[]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <select className="border border-neutral-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 bg-white" value={value.channel ?? ""} onChange={e=>onChange({...value, channel: e.target.value || undefined})}>
        <option value="">安装渠道（默认Apple）</option>
        {opts.channels.map(x => <option key={x} value={x}>{x}</option>)}
      </select>
      <select className="border border-neutral-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 bg-white" value={value.bidType ?? ""} onChange={e=>onChange({...value, bidType: e.target.value || undefined})}>
        <option value="">出价类型（默认CPI）</option>
        {opts.bidTypes.map(x => <option key={x} value={x}>{x}</option>)}
      </select>
      <select className="border border-neutral-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 bg-white" value={value.country ?? ""} onChange={e=>onChange({...value, country: e.target.value || undefined})}>
        <option value="">国家地区</option>
        {opts.countries.map(x => <option key={x} value={x}>{x}</option>)}
      </select>
      <select className="border border-neutral-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 bg-white" value={value.app ?? ""} onChange={e=>onChange({...value, app: e.target.value || undefined})}>
        <option value="">APP</option>
        {opts.apps.map(x => <option key={x} value={x}>{x}</option>)}
      </select>
    </div>
  );
}
