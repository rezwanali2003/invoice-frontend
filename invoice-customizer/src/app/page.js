// app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-20 h-72 w-72 rounded-full bg-purple-500/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-10 h-80 w-80 rounded-full bg-cyan-500/40 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-[conic-gradient(from_140deg,#22d3ee,#6366f1,#ec4899,#22d3ee)] shadow-lg shadow-cyan-500/40" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight">
              Rezwan Invoice Studio
            </span>
            <span className="text-[11px] text-slate-300">
              Custom invoice templates in seconds
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition">
            Templates
          </button>
          <button className="px-3.5 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-semibold shadow-md shadow-cyan-400/40 hover:bg-cyan-300 transition">
            Export PDF
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="flex-1 px-6 py-10 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Title + subtitle */}
          <div className="mb-8">
            <p className="inline-flex items-center gap-2 text-xs font-medium text-cyan-300 bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
              Pick a layout · then customize
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              Choose your Rezwan invoice style
            </h1>
            <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl">
              Each template opens its own editor screen where you will tune
              colors, fonts and sections before exporting as PDF.
            </p>
          </div>

          {/* Template cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Link
              href="/templates/corporate-stripe"
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-col shadow-[0_18px_40px_rgba(15,23,42,0.75)] cursor-pointer overflow-hidden transition transform hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.9)]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 transition" />
              <div className="absolute -top-3 left-4 text-[11px] px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-semibold shadow shadow-emerald-400/60">
                Selected
              </div>
              <div className="flex items-center justify-between mb-3 mt-2">
                <span className="text-[11px] font-semibold text-indigo-200 bg-indigo-500/20 border border-indigo-400/40 px-2 py-1 rounded-full">
                  Corporate · Pro
                </span>
                <span className="text-[11px] text-slate-300">
                  12 fields · 2 colors
                </span>
              </div>
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mb-3 flex items-center justify-center text-xs text-slate-400 border border-white/10 group-hover:border-cyan-300/70 transition">
                Rezwan Corporate invoice layout preview
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Corporate Stripe
                </h3>
                <p className="text-xs text-slate-300">
                  Classic B2B layout with header band and clean item table for
                  Rezwan invoices.
                </p>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="/templates/modern-minimal"
              className="group rounded-2xl border border-white/10 bg-white/3 backdrop-blur-lg p-4 flex flex-col hover:border-cyan-300/60 hover:-translate-y-1 hover:shadow-xl transition transform cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-emerald-200 bg-emerald-500/20 border border-emerald-400/40 px-2 py-1 rounded-full">
                  Minimal
                </span>
                <span className="text-[11px] text-slate-300">
                  8 fields · 1 color
                </span>
              </div>
              <div className="aspect-[3/4] rounded-xl bg-slate-900/70 mb-3 flex items-center justify-center text-xs text-slate-400 border border-white/10 group-hover:border-emerald-300/70 transition">
                Ultra‑clean Rezwan invoice preview
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Modern Minimal
                </h3>
                <p className="text-xs text-slate-300">
                  Lightweight, print‑ready layout for solo creators using Rezwan
                  invoices.
                </p>
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              href="/templates/creative-bold"
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 flex flex-col hover:border-pink-400/70 hover:-translate-y-1 hover:shadow-xl transition transform cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-white bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 px-2 py-1 rounded-full">
                  Creative
                </span>
                <span className="text-[11px] text-slate-300">
                  10 fields · 4 colors
                </span>
              </div>
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-orange-400 via-pink-500 to-indigo-500 mb-3 flex items-center justify-center text-xs text-white/90 border border-white/20 shadow-lg shadow-pink-500/40 group-hover:scale-[1.02] transition">
                Color‑blocked Rezwan invoice preview
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Creative Bold
                </h3>
                <p className="text-xs text-slate-200">
                  High‑contrast sections and gradients for agencies using Rezwan
                  invoice styles.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
