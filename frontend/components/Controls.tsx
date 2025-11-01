"use client";
type Props = {
  mode: "raw"|"ma7";
  scale: "linear"|"log";
  onChange: (v: Partial<Props>) => void;
};

export default function Controls({ mode, scale, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-6 mt-4 items-center">
      <div className="flex items-center gap-2">
        <span className="font-medium">数据展示模式：</span>
        <label className="flex items-center gap-1">
          <input type="radio" checked={mode==="ma7"} onChange={()=>onChange({mode:"ma7"})}/>
        <span>显示移动平均值（7日）</span>
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" checked={mode==="raw"} onChange={()=>onChange({mode:"raw"})}/>
          <span>显示原始数据</span>
        </label>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Y轴刻度：</span>
        <label className="flex items-center gap-1">
          <input type="radio" checked={scale==="linear"} onChange={()=>onChange({scale:"linear"})}/>
          <span>线性刻度</span>
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" checked={scale==="log"} onChange={()=>onChange({scale:"log"})}/>
          <span>对数刻度</span>
        </label>
      </div>
    </div>
  );
}
