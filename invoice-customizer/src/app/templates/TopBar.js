"use client";

export default function TopBar({
  templateName,
  onTemplateNameChange,
  onUndo,
  onRedo,
  onAddRow,
  onAddColumn,
  onDeleteTable,
  onOpenTemplates,
  onExportPDF,
  layoutMode,          // new
  onToggleLayoutMode,  // new
}) {
  return (
    <div className="w-full border-b border-slate-800/70 bg-slate-950/80 backdrop-blur flex items-center justify-between px-4 py-2">
      {/* Left: template name */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="text-slate-400">Template:</span>
          <input
            value={templateName}
            onChange={(e) => onTemplateNameChange?.(e.target.value)}
            className="rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400 min-w-[120px]"
          />
        </div>
      </div>

      {/* Center: table actions + layout */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          className="px-3 py-1.5 text-xs rounded-md border border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400/70"
        >
          ↶ Undo
        </button>
        <button
          onClick={onRedo}
          className="px-3 py-1.5 text-xs rounded-md border border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400/70"
        >
          ↷ Redo
        </button>
        <button
          onClick={onAddRow}
          className="px-3 py-1.5 text-xs rounded-md border border-slate-600 bg-slate-900 text-slate-100 hover:border-cyan-400/70"
        >
          + Add Row
        </button>
        <button
          onClick={onAddColumn}
          className="px-3 py-1.5 text-xs rounded-md border border-slate-600 bg-slate-900 text-slate-100 hover:border-cyan-400/70"
        >
          + Add Column
        </button>
        <button
          onClick={onDeleteTable}
          className="px-3 py-1.5 text-xs rounded-md border border-rose-500/80 bg-rose-950/40 text-rose-100 hover:bg-rose-900/60"
        >
          Delete Table
        </button>

        {/* Layout mode toggle */}
        <button
          onClick={onToggleLayoutMode}
          className={`ml-2 px-3 py-1.5 text-xs rounded-full border ${
            layoutMode
              ? "bg-cyan-500 text-slate-950 border-cyan-400"
              : "bg-slate-900 text-slate-100 border-slate-600"
          }`}
        >
          {layoutMode ? "Layout: ON" : "Layout: OFF"}
        </button>
      </div>

      {/* Right: templates / export */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTemplates}
          className="px-4 py-1.5 text-xs rounded-full bg-slate-800 text-slate-100 border border-slate-600 hover:border-cyan-400/70"
        >
          🎨 Templates
        </button>
        <button
          onClick={onExportPDF}
          className="px-4 py-1.5 text-xs rounded-full bg-emerald-500 text-emerald-950 font-semibold hover:bg-emerald-400"
        >
          ⬇ Export PDF
        </button>
      </div>
    </div>
  );
}
