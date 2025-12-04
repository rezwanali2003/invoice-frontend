"use client";

import { useState } from "react";
import {
  FiMinus,
  FiType,
  FiImage,
  FiLink,
  FiGrid,
  FiSquare,
  FiMessageSquare,
} from "react-icons/fi";

export default function RightSidebar({
  styleConfig,
  onStyleChange,
  selectedBlock,          // { id, blockType, bgColor, textColor, borderColor, ... }
  onBlockStyleChange,     // (field, value) => void
}) {
  const [activeTab, setActiveTab] = useState("colors");

  const handle = (field) => (value) => onStyleChange(field, value);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handle("logoSrc")(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const blocks = [
    { id: "button", label: "Button", icon: FiSquare },
    { id: "divider", label: "Divider", icon: FiMinus },
    { id: "text", label: "Text", icon: FiType },
    { id: "text-section", label: "Text Section", icon: FiType },
    { id: "image", label: "Image", icon: FiImage },
    { id: "quote", label: "Quote", icon: FiMessageSquare },
    { id: "link", label: "Link", icon: FiLink },
    { id: "link-block", label: "Link Block", icon: FiLink },
    { id: "table", label: "Table", icon: FiGrid },
    { id: "grid", label: "Grid", icon: FiGrid },
  ];

  const canEditBlock = !!(selectedBlock && onBlockStyleChange);

  return (
    <div className="space-y-4 text-slate-100 text-xs">
      <h2 className="text-sm font-semibold mb-1">Sidebar</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-1">
        <button
          onClick={() => setActiveTab("colors")}
          className={`flex-1 px-2 py-1.5 rounded-md text-xs border ${
            activeTab === "colors"
              ? "border-cyan-400 bg-cyan-400/10 text-slate-100"
              : "border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-100"
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab("blocks")}
          className={`flex-1 px-2 py-1.5 rounded-md text-xs border ${
            activeTab === "blocks"
              ? "border-cyan-400 bg-cyan-400/10 text-slate-100"
              : "border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-100"
          }`}
        >
          Blocks
        </button>
      </div>

      {/* GLOBAL COLORS / TYPO TAB */}
      {activeTab === "colors" && (
        <>
          <h2 className="text-sm font-semibold mb-1">Style &amp; typography</h2>

          {/* Brand colors */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">Primary color</p>
              <input
                type="color"
                value={styleConfig.primaryColor}
                onChange={(e) => handle("primaryColor")(e.target.value)}
                className="h-8 w-full rounded-md bg-slate-900 border border-slate-700 cursor-pointer"
              />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Accent color</p>
              <input
                type="color"
                value={styleConfig.accentColor}
                onChange={(e) => handle("accentColor")(e.target.value)}
                className="h-8 w-full rounded-md bg-slate-900 border border-slate-700 cursor-pointer"
              />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Text color</p>
              <input
                type="color"
                value={styleConfig.textColor || "#0f172a"}
                onChange={(e) => handle("textColor")(e.target.value)}
                className="h-8 w-full rounded-md bg-slate-900 border border-slate-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Background + shadow */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400">Background</p>
            <div className="flex gap-2">
              <button
                onClick={() => handle("backgroundMode")("white")}
                className={`flex-1 px-2 py-1.5 rounded-md border ${
                  styleConfig.backgroundMode === "white"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                White
              </button>
              <button
                onClick={() => handle("backgroundMode")("soft")}
                className={`flex-1 px-2 py-1.5 rounded-md border ${
                  styleConfig.backgroundMode === "soft"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                Soft tint
              </button>
              <button
                onClick={() => handle("backgroundMode")("gradient")}
                className={`flex-1 px-2 py-1.5 rounded-md border ${
                  styleConfig.backgroundMode === "gradient"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                Gradient
              </button>
            </div>

            <label className="flex items-center justify-between text-xs text-slate-400">
              <span>Card shadow</span>
              <input
                type="checkbox"
                checked={styleConfig.showShadow ?? true}
                onChange={(e) => handle("showShadow")(e.target.checked)}
                className="h-3 w-3 accent-cyan-400"
              />
            </label>
          </div>

          {/* Font family & weight */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400">Font family</p>
            <div className="flex gap-2">
              <button
                onClick={() => handle("fontFamily")("system")}
                className={`flex-1 text-xs px-2 py-1.5 rounded-md border ${
                  styleConfig.fontFamily === "system"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                Sans
              </button>
              <button
                onClick={() => handle("fontFamily")("serif")}
                className={`flex-1 text-xs px-2 py-1.5 rounded-md border ${
                  styleConfig.fontFamily === "serif"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => handle("fontFamily")("mono")}
                className={`flex-1 text-xs px-2 py-1.5 rounded-md border ${
                  styleConfig.fontFamily === "mono"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                Mono
              </button>
            </div>

            <p className="text-xs text-slate-400 flex justify-between mt-2">
              <span>Font weight</span>
              <span>{styleConfig.fontWeight || 500}</span>
            </p>
            <input
              type="range"
              min={300}
              max={800}
              step={100}
              value={styleConfig.fontWeight ?? 500}
              onChange={(e) => handle("fontWeight")(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Font size & radius */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400 flex justify-between">
              <span>Font size</span>
              <span>{styleConfig.fontSize}px</span>
            </p>
            <input
              type="range"
              min={11}
              max={18}
              value={styleConfig.fontSize}
              onChange={(e) => handle("fontSize")(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400 flex justify-between">
              <span>Corner radius</span>
              <span>{styleConfig.borderRadius}px</span>
            </p>
            <input
              type="range"
              min={0}
              max={24}
              value={styleConfig.borderRadius}
              onChange={(e) => handle("borderRadius")(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Logo controls */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400 flex justify-between">
              <span>Logo</span>
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-[11px] text-slate-400 file:text-xs file:px-2 file:py-1.5 file:rounded-md file:border file:border-slate-700 file:bg-slate-900 file:text-slate-200"
            />
            <p className="text-[11px] text-slate-500">
              Upload a logo image to show in the invoice header.
            </p>
            <p className="text-xs text-slate-400 flex justify-between mt-1">
              <span>Logo size</span>
              <span>{styleConfig.logoSize ?? 64}px</span>
            </p>
            <input
              type="range"
              min={32}
              max={96}
              value={styleConfig.logoSize ?? 64}
              onChange={(e) => handle("logoSize")(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* BLOCKS TAB + PER-BLOCK COLORS */}
      {activeTab === "blocks" && (
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <p className="text-xs text-slate-400">
            Drag a block onto the invoice. Then click a block to edit its colors.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {blocks.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", `BLOCK::${b.id}`);
                  }}
                  className="h-20 rounded-md border border-slate-700 bg-slate-900 flex flex-col items-center justify-center gap-1 text-[11px] text-slate-100 hover:border-cyan-400 cursor-grab active:cursor-grabbing select-none"
                >
                  <Icon className="text-xl" />
                  <span>{b.label}</span>
                </button>
              );
            })}
          </div>

          {/* Selected block color controls */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <p className="text-xs text-slate-400">
              Block colors{" "}
              {canEditBlock
                ? `(editing ${selectedBlock.blockType || "block"} #${selectedBlock.id})`
                : "(click a block on the canvas)"}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Background</span>
                <input
                  type="color"
                  disabled={!canEditBlock}
                  value={selectedBlock?.bgColor || "#ffffff"}
                  onChange={(e) =>
                    onBlockStyleChange &&
                    onBlockStyleChange("bgColor", e.target.value)
                  }
                  className="h-6 w-16 rounded border border-slate-700 bg-slate-900 cursor-pointer disabled:opacity-40"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Text</span>
                <input
                  type="color"
                  disabled={!canEditBlock}
                  value={
                    selectedBlock?.textColor ||
                    styleConfig.textColor ||
                    "#0f172a"
                  }
                  onChange={(e) =>
                    onBlockStyleChange &&
                    onBlockStyleChange("textColor", e.target.value)
                  }
                  className="h-6 w-16 rounded border border-slate-700 bg-slate-900 cursor-pointer disabled:opacity-40"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Border</span>
                <input
                  type="color"
                  disabled={!canEditBlock}
                  value={selectedBlock?.borderColor || "#e5e7eb"}
                  onChange={(e) =>
                    onBlockStyleChange &&
                    onBlockStyleChange("borderColor", e.target.value)
                  }
                  className="h-6 w-16 rounded border border-slate-700 bg-slate-900 cursor-pointer disabled:opacity-40"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
