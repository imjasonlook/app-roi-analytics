import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="max-w-7xl mx-auto p-6">
          <header className="flex items-center justify-between py-3 px-2 border-b border-neutral-200 mb-6 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-neutral-800">ROI 可视化系统</div>
              <div className="text-sm text-neutral-500 hidden md:block">多时间维度分析</div>
            </div>
            <nav className="flex items-center gap-6 text-sm text-neutral-700">
              <a href="/" className="hover:text-black">📈 图表分析</a>
              <a href="/import" className="hover:text-black">📤 导入数据</a>
            </nav>
          </header>
    {children}</div>
      </body>
    </html>
  );
}
