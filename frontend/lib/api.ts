const BASE = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

export async function fetchFilters() {
  const r = await fetch(`${BASE}/roi/filters`, { cache: "no-store" });
  const j = await r.json();
  return j.data;
}

export async function fetchRoi(params: Record<string,string|number|undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k,v])=>{
    if (v !== undefined && v !== "") qs.set(k,String(v));
  });
  const r = await fetch(`${BASE}/roi?${qs.toString()}`, { cache: "no-store" });
  const j = await r.json();
  return j.data;
}
