"use client";

export default function TemplateLayout({ left, preview, right, title, subtitle }) {
  const SIDEBAR_WIDTH = 280;
  const GAP = 16;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* LEFT fixed sidebar */}
      <aside
        className="fixed left-4 top-16 bottom-6 rounded-2xl border border-white/10 bg-slate-900/85 backdrop-blur-xl p-4 overflow-y-auto"
        style={{ width: SIDEBAR_WIDTH }}
      >
        {left}
      </aside>

      {/* RIGHT fixed sidebar */}
      <aside
        className="fixed right-4 top-16 bottom-6 rounded-2xl border border-white/10 bg-slate-900/85 backdrop-blur-xl p-4 overflow-y-auto"
        style={{ width: SIDEBAR_WIDTH }}
      >
        {right}
      </aside>

      {/* CENTER */}
      <div className="min-h-screen flex flex-col items-center">
        <header className="mt-4 mb-3 text-center px-4">
          <h1 className="text-2xl md:text-3xl font-semibold mb-1">{title}</h1>
          <p className="text-slate-300 text-sm">{subtitle}</p>
        </header>

        <div
          className="flex-1 flex justify-center items-center w-full"
          style={{
            paddingLeft: SIDEBAR_WIDTH + GAP + 16,
            paddingRight: SIDEBAR_WIDTH + GAP + 16,
          }}
        >
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-[960px] h-[calc(100vh-160px)] rounded-3xl bg-slate-950/60 border border-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.9)] overflow-hidden">
              {/* Allow preview (including TopBar) to control its own layout */}
              <div className="w-full h-full bg-slate-900/90">
                {preview}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
