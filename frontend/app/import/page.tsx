"use client";
import { useCallback, useMemo, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

type Stage = "idle" | "validating" | "uploading" | "success" | "error";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [msg, setMsg] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCSV = (f: File | null) =>
    !!f && (f.type === "text/csv" || f.name.toLowerCase().endsWith(".csv"));

  const humanSize = (s: number) =>
    s > 1024 * 1024
      ? (s / 1024 / 1024).toFixed(2) + " MB"
      : (s / 1024).toFixed(1) + " KB";

  const canSubmit = useMemo(() => {
    return !!file && isCSV(file) && file.size <= MAX_SIZE && stage !== "uploading";
  }, [file, stage]);

  // 拖拽区域
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (f) handlePick(f);
  }, []);

  const handlePick = (f: File) => {
    setMsg("");
    if (!isCSV(f)) {
      setFile(null);
      setStage("error");
      setMsg("仅支持 CSV 文件（.csv）");
      return;
    }
    if (f.size > MAX_SIZE) {
      setFile(null);
      setStage("error");
      setMsg("文件过大，最大支持 10MB");
      return;
    }
    setFile(f);
    setStage("idle");
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) handlePick(f);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setStage("validating");
    setMsg("校验文件…");
    // 这里留钩子：可在浏览器读取前几行做列名校验

    setStage("uploading");
    setMsg("上传中…");
    setProgress(12);

    const fd = new FormData();
    fd.append("file", file);

    try {
      // 原生 fetch 不提供上传进度，这里做一个“拟进度”体验
      const fake = setInterval(() => {
        setProgress((p) => (p < 88 ? p + 6 : p));
      }, 150);

      const r = await fetch(`${BASE}/import/upload`, { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));

      clearInterval(fake);
      setProgress(100);

      if (j?.code === 0) {
        const { total, maxDate } = j.data || {};
        setStage("success");
        setMsg(`导入成功：${total ?? "-"} 行；数据截止日：${maxDate ? new Date(maxDate).toISOString().slice(0,10) : "-"}`);
      } else {
        setStage("error");
        setMsg(`导入失败：${j?.msg || j?.error || r.statusText || "Unknown error"}`);
      }
    } catch (err: any) {
      setStage("error");
      setMsg(`导入失败：${err?.message || String(err)}`);
    }
  }

  const reset = () => {
    setFile(null);
    setStage("idle");
    setMsg("");
    setProgress(0);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-8">
      {/* 顶部说明 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">导入 CSV 到数据库</h1>
          <p className="text-neutral-600 mt-2">选择包含 ROI 数据的 CSV 文件，提交后将批量写入数据库。</p>
        </div>
        <a
          href="/"
          className="text-sm px-3 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50"
          title="返回图表"
        >
          ← 返回图表
        </a>
      </div>

      {/* 卡片 */}
      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        {/* 拖拽上传区 */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="group border-2 border-dashed rounded-xl p-8 text-center
                     transition-colors bg-neutral-50 hover:bg-neutral-100 border-neutral-300"
          aria-label="拖拽 CSV 至此或点击选择"
        >
          <div className="text-lg font-medium mb-2">拖拽 CSV 至此，或点击下方按钮选择文件</div>
          <div className="text-neutral-500 mb-4">仅支持 .csv，最大 10MB</div>

          <div className="flex items-center justify-center gap-3">
            <input
              ref={inputRef}
              id="file"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={onChangeFile}
            />
            <label
              htmlFor="file"
              className="cursor-pointer px-4 py-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50"
            >
              选择文件
            </label>

            {file && (
              <div className="text-sm text-neutral-600">
                <span className="font-medium">{file.name}</span>
                <span className="mx-2">·</span>
                <span>{humanSize(file.size)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 进度条 / 信息 */}
        {(stage === "uploading" || stage === "success" || stage === "error") && (
          <div className="mt-6">
            <div className="w-full h-2 bg-neutral-200 rounded">
              <div
                className={`h-2 rounded transition-all ${stage === "error" ? "bg-red-500" : "bg-blue-600"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={`mt-2 text-sm ${stage === "error" ? "text-red-600" : "text-neutral-700"}`}>
              {msg}
            </div>
          </div>
        )}

        {/* 操作区 */}
        <div className="mt-8 flex items-center justify-end gap-3">
        <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 rounded-lg text-white bg-black disabled:bg-neutral-300 disabled:text-neutral-600"
        >
            {stage === "uploading" ? "上传中…" : "上传并导入"}
        </button>
        <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50"
        >
            重置
        </button>
        <a
            href="/api/import/spec"
            className="text-sm text-blue-600 hover:underline"
            onClick={(e) => e.preventDefault()}
            title="（可选）列名规范接口"
        >
            查看列名规范（可选）
        </a>
        </div>
      </form>

    </div>
  );
}