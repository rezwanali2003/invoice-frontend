"use client";

import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import TemplateLayout from "../TemplateLayout";
import LeftSidebar from "../LeftSidebar";
import RightSidebar from "../RightSidebar";
import TopBar from "../TopBar";

const defaultInvoice = {
  companyName: "Company Name",
  companyAddressLine1: "123 Street Address, City, State, ZIP/Post",
  companyAddressLine2: "Website, Email Address",
  companyPhone: "Phone Number",

  billToContactName: "Contact Name",
  billToName: "Client Company Name",
  billToAddress: "123 Street Address, City, State, ZIP",
  billToEmail: "billing@client.com",
  billToPhone: "+1 (555) 000-0000",

  locationName: "Name",
  locationAddress: "Address",
  locationPhone: "+1 (555) 000-0000",

  invoiceNumber: "INV-2025-0002",
  issueDate: "11/11/25",
  dueDate: "12/12/25",

  discountPercent: "0",
  taxRate: "0.00%",
  totalTax: "0.00",

  termsTitle: "Terms & Instructions",
  termsLine1: "Add payment instructions here, e.g. bank, PayPal...",
  termsLine2: "Add terms here, e.g. warranty, returns policy...",

  rows: [
    {
      id: 1,
      description: "Service description",
      details: "Add a short description here",
      qty: "1",
      unitPrice: "4500.00",
      extras: {},
    },
    {
      id: 2,
      description: "Another item",
      details: "Optional details",
      qty: "1",
      unitPrice: "0.00",
      extras: {},
    },
  ],
};

const defaultColumns = [
  { id: "description", name: "DESCRIPTION", kind: "fixed" },
  { id: "qty", name: "QTY", kind: "fixed" },
  { id: "unitPrice", name: "UNIT PRICE", kind: "fixed" },
  { id: "total", name: "TOTAL", kind: "fixed" },
];

const defaultStyle = {
  primaryColor: "#2563eb",
  accentColor: "#111827",
  textColor: "#0f172a",
  fontFamily: "system",
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 4,
  logoSrc: "",
  logoSize: 64,
  showShadow: true,
};

const defaultTemplateName = "Simple Blue";

const defaultHeaderLayout = {
  x: 40,
  y: 40,
  width: 520,
  height: 140,
};

const defaultBillToLayout = {
  x: 40,
  y: 210,
  width: 260,
  height: 150,
};

const defaultLocationLayout = {
  x: 340,
  y: 210,
  width: 260,
  height: 150,
};

const defaultTableLayout = {
  x: 40,
  y: 350,
  width: 520,
  height: 220,
};

const defaultTotalsLayout = {
  x: 400,
  y: 580,
  width: 220,
  height: 150,
};

const defaultTermsLayout = {
  x: 40,
  y: 430,
  width: 520,
  height: 130,
};

export default function SimpleBluePage() {
  // --------- CORE STATE ----------

  const [invoice, setInvoice] = useState(defaultInvoice);
  const [columns, setColumns] = useState(defaultColumns);
  const [style, setStyle] = useState(defaultStyle);
  const [templateName, setTemplateName] = useState(defaultTemplateName);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showEditTableModal, setShowEditTableModal] = useState(false);

  const [layoutMode, setLayoutMode] = useState(false);
  const [hideUI, setHideUI] = useState(false);

  // Layout state (page coordinate system, px)
  const [headerLayout, setHeaderLayout] = useState(defaultHeaderLayout);
  const [billToLayout, setBillToLayout] = useState(defaultBillToLayout);
  const [locationLayout, setLocationLayout] = useState(defaultLocationLayout);
  const [tableLayout, setTableLayout] = useState(defaultTableLayout);
  const [totalsLayout, setTotalsLayout] = useState(defaultTotalsLayout);
  const [termsLayout, setTermsLayout] = useState(defaultTermsLayout);

  const invoiceRef = useRef(null);
  const prevFontSizeRef = useRef(13);

  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isRestoringRef = useRef(false);
  const isInitialLoadRef = useRef(false);
  const loadedDataRef = useRef(null);

  // Load saved data into ref
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedKey = "simpleBlueLayout";
    let saved = localStorage.getItem(savedKey);
    let loadedData = null;
    if (saved) {
      try {
        loadedData = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved data:", e);
        saved = null;
      }
    }
    loadedDataRef.current = loadedData;
  }, []);

  // Apply loaded data and initialize history
  useEffect(() => {
    if (typeof window === "undefined") return;
    const loaded = loadedDataRef.current;
    let snapshot;
    if (loaded) {
      const fullLoaded = {
        invoice: loaded.invoice || defaultInvoice,
        columns: loaded.columns || defaultColumns,
        style: loaded.style || defaultStyle,
        templateName: loaded.templateName || defaultTemplateName,
        headerLayout: loaded.headerLayout || defaultHeaderLayout,
        billToLayout: loaded.billToLayout || defaultBillToLayout,
        locationLayout: loaded.locationLayout || defaultLocationLayout,
        tableLayout: loaded.tableLayout || defaultTableLayout,
        totalsLayout: loaded.totalsLayout || defaultTotalsLayout,
        termsLayout: loaded.termsLayout || defaultTermsLayout,
      };
      setInvoice(fullLoaded.invoice);
      setColumns(fullLoaded.columns);
      setStyle(fullLoaded.style);
      setTemplateName(fullLoaded.templateName);
      setHeaderLayout(fullLoaded.headerLayout);
      setBillToLayout(fullLoaded.billToLayout);
      setLocationLayout(fullLoaded.locationLayout);
      setTableLayout(fullLoaded.tableLayout);
      setTotalsLayout(fullLoaded.totalsLayout);
      setTermsLayout(fullLoaded.termsLayout);
      snapshot = fullLoaded;
      isInitialLoadRef.current = true;
    } else {
      snapshot = {
        invoice,
        columns,
        style,
        templateName,
        headerLayout,
        billToLayout,
        locationLayout,
        tableLayout,
        totalsLayout,
        termsLayout,
      };
      localStorage.setItem("simpleBlueLayout", JSON.stringify(snapshot));
    }
    setHistory([JSON.parse(JSON.stringify(snapshot))]);
    setCurrentIndex(0);
    prevFontSizeRef.current = loaded ? (snapshot.style.fontSize || 13) : style.fontSize;
  }, []);

  // Scale all layout dimensions (x, y, width, height) and style properties when fontSize changes
  useEffect(() => {
    const oldSize = prevFontSizeRef.current;
    if (oldSize === style.fontSize) return;
    const scale = style.fontSize / oldSize;

    setHeaderLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));

    setBillToLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));

    setLocationLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));

    setTableLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));

    setTermsLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));

    setTotalsLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));

    setStyle((prev) => ({
      ...prev,
      logoSize: Math.round(prev.logoSize * scale),
      borderRadius: Math.round(prev.borderRadius * scale),
    }));

    prevFontSizeRef.current = style.fontSize;
  }, [style.fontSize]);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }

    const snapshot = JSON.parse(JSON.stringify({
      invoice,
      columns,
      style,
      templateName,
      headerLayout,
      billToLayout,
      locationLayout,
      tableLayout,
      totalsLayout,
      termsLayout,
    }));

    setHistory((prevHistory) => {
      let newHistory = [...prevHistory];
      newHistory.length = currentIndex + 1;
      newHistory.push(snapshot);
      return newHistory;
    });

    setCurrentIndex((prev) => prev + 1);

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("simpleBlueLayout", JSON.stringify(snapshot));
      } catch (err) {
        console.error("Failed to save to localStorage:", err);
      }
    }
  }, [invoice, columns, style, templateName, headerLayout, billToLayout, locationLayout, tableLayout, totalsLayout, termsLayout]);

  const handleUndo = () => {
    if (currentIndex <= 0 || history.length === 0) return;
    isRestoringRef.current = true;
    const prevIndex = currentIndex - 1;
    const prevSnapshot = history[prevIndex];
    setCurrentIndex(prevIndex);
    setInvoice(prevSnapshot.invoice);
    setColumns(prevSnapshot.columns);
    setStyle(prevSnapshot.style);
    prevFontSizeRef.current = prevSnapshot.style.fontSize;
    setTemplateName(prevSnapshot.templateName);
    setHeaderLayout(prevSnapshot.headerLayout);
    setBillToLayout(prevSnapshot.billToLayout);
    setLocationLayout(prevSnapshot.locationLayout);
    setTableLayout(prevSnapshot.tableLayout);
    setTotalsLayout(prevSnapshot.totalsLayout);
    setTermsLayout(prevSnapshot.termsLayout);
  };

  const handleRedo = () => {
    if (currentIndex >= history.length - 1 || history.length === 0) return;
    isRestoringRef.current = true;
    const nextIndex = currentIndex + 1;
    const nextSnapshot = history[nextIndex];
    setCurrentIndex(nextIndex);
    setInvoice(nextSnapshot.invoice);
    setColumns(nextSnapshot.columns);
    setStyle(nextSnapshot.style);
    prevFontSizeRef.current = nextSnapshot.style.fontSize;
    setTemplateName(nextSnapshot.templateName);
    setHeaderLayout(nextSnapshot.headerLayout);
    setBillToLayout(nextSnapshot.billToLayout);
    setLocationLayout(nextSnapshot.locationLayout);
    setTableLayout(nextSnapshot.tableLayout);
    setTotalsLayout(nextSnapshot.totalsLayout);
    setTermsLayout(nextSnapshot.termsLayout);
  };

  // --------- HELPERS ----------

  const handleFieldChange = (field, value) =>
    setInvoice((prev) => ({ ...prev, [field]: value }));

  const handleStyleChange = (field, value) =>
    setStyle((prev) => ({ ...prev, [field]: value }));

  const fontFamilyClass =
    style.fontFamily === "serif"
      ? "font-serif"
      : style.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const baseSize = style.fontSize;
  const sizeFactor = baseSize / 13;
  const fs = (em) => `${em * sizeFactor}em`;
  const fw = (base) =>
    Math.min(800, Math.max(300, Math.round((base + style.fontWeight) / 2)));

  const rowsWithTotal = invoice.rows.map((row) => {
    const q = Number(row.qty || "0");
    const up = Number(row.unitPrice || "0");
    return { ...row, total: (q * up).toFixed(2) };
  });

  const subtotal = rowsWithTotal.reduce(
    (sum, r) => sum + Number(r.total || "0"),
    0
  );
  const discountPct = Number(invoice.discountPercent || "0");
  const discountAmt = (subtotal * discountPct) / 100;
  const subtotalLess = subtotal - discountAmt;

  const subtotalStr = subtotal.toFixed(2);
  const discountStr = discountAmt.toFixed(2);
  const subtotalLessStr = subtotalLess.toFixed(2);
  const balanceStr = subtotalLess.toFixed(2);

  // --------- ROW/COLUMN EDITING ----------

  const updateRowField = (rowId, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.id === rowId ? { ...r, [field]: value } : r
      ),
    }));
  };

  const updateRowExtra = (rowId, colId, value) => {
    setInvoice((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.id === rowId
          ? { ...r, extras: { ...r.extras, [colId]: value } }
          : r
      ),
    }));
  };

  const addRow = () => {
    const nextId = (invoice.rows[invoice.rows.length - 1]?.id || 0) + 1;
    const newRow = {
      id: nextId,
      description: `Item ${nextId}`,
      details: "",
      qty: "1",
      unitPrice: "0.00",
      extras: {},
    };
    columns
      .filter((c) => c.kind === "extra")
      .forEach((col) => {
        newRow.extras[col.id] = "";
      });
    setInvoice((prev) => ({ ...prev, rows: [...prev.rows, newRow] }));
    // Dynamically increase table height and push elements below
    const delta = Math.round(50 * sizeFactor);
    setTableLayout((prev) => ({ ...prev, height: prev.height + delta }));
    setTermsLayout((prev) => ({ ...prev, y: prev.y + delta }));
    setTotalsLayout((prev) => ({ ...prev, y: prev.y + delta }));
  };

  const addColumn = () => {
    setColumnName("");
    setShowColumnModal(true);
  };

  const confirmAddColumn = () => {
    const name = columnName.trim();
    if (!name) return;
    const colId = `extra_${Date.now()}`;
    const newCol = { id: colId, name, kind: "extra" };

    setColumns((prev) => [...prev, newCol]);
    setInvoice((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => ({
        ...r,
        extras: { ...r.extras, [colId]: "" },
      })),
    }));
    setShowColumnModal(false);
  };

  const deleteColumn = (colId) => {
    if (!colId) return;
    if (!columns.find((c) => c.id === colId)) return;
    setColumns((prev) => prev.filter((c) => c.id !== colId));
    setInvoice((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => {
        const { [colId]: _, ...restExtras } = r.extras || {};
        return { ...r, extras: restExtras };
      }),
    }));
  };

  const deleteTable = () => {
    setInvoice((prev) => ({ ...prev, rows: [] }));
    setColumns((prev) => prev.filter((c) => c.kind === "fixed"));
  };

  // --------- TOP BAR ACTIONS ----------

  const handleAddRowTop = () => addRow();
  const handleAddColumnTop = () => addColumn();
  const handleDeleteTableTop = () => deleteTable();
  const handleOpenTemplates = () => setShowTemplateModal(true);

  const handleToggleLayoutMode = () => {
    setLayoutMode((prev) => !prev);
  };

  const handleExportPDF = async () => {
    if (typeof window === "undefined") return;
    if (!invoiceRef.current) {
      alert("Preview not ready—try refreshing.");
      return;
    }
    // Temp hide layout mode and UI
    let needsRestore = false;
    if (layoutMode) {
      setLayoutMode(false);
      needsRestore = true;
    }
    setHideUI(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for re-render
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).default;
      // Directly capture the original element without cloning/offscreen tricks
      // This avoids layout reflow issues and ensures styles/fonts render as on-screen
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Reduced from 3 for better performance; increase if sharper needed
        backgroundColor: null, // No forced background—preserve the element's theme
        allowTaint: true,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });
      // Log canvas data URL length for debugging (remove later)
      const imgData = canvas.toDataURL("image/png", 1.0);
      console.log("Canvas captured:", imgData.length > 100 ? "Success (non-empty)" : "Warning: Possibly empty");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20; // Margins
      const totalImgHeight = (canvas.height * imgWidth) / canvas.width;
      let remainingHeight = totalImgHeight;
      let positionY = 10;
      let sourceY = 0; // Track vertical position in source image (in mm scale)
      // Multi-page loop: Slice and add image segments
      while (remainingHeight > 0) {
        const sliceHeight = Math.min(remainingHeight, pageHeight - 20);
        // Crop the source image: Calculate pixel Y offset from mm
        const pixelHeightPerMM = canvas.height / totalImgHeight;
        const sourcePixelY = Math.round(sourceY * pixelHeightPerMM);
        const slicePixelHeight = Math.round(sliceHeight * pixelHeightPerMM);
        // Create cropped canvas for this slice
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = slicePixelHeight;
        const ctx = croppedCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, sourcePixelY, canvas.width, slicePixelHeight, 0, 0, canvas.width, slicePixelHeight);
        const sliceImgData = croppedCanvas.toDataURL("image/png", 1.0);
        // Add to PDF
        pdf.addImage(sliceImgData, "PNG", 10, positionY, imgWidth, sliceHeight);
        // Advance
        remainingHeight -= sliceHeight;
        sourceY += sliceHeight;
        // Add next page if more content
        if (remainingHeight > 0) {
          pdf.addPage();
          positionY = 10;
        }
      }
      pdf.save(`${templateName}_${new Date().toISOString().split('T')[0]}.pdf`);
      console.log(`PDF exported: ${Math.ceil(totalImgHeight / (pageHeight - 20))} pages`); // Debug log
      alert("PDF exported successfully!");
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert(`Export failed: ${err.message}. Check console for details.`);
    } finally {
      // Restore layout mode
      setHideUI(false);
      if (needsRestore) {
        setLayoutMode(true);
      }
    }
  };

  // --------- LEFT SIDEBAR ----------

  const extendedLeft = (
    <div className="space-y-4">
      <LeftSidebar
        invoice={invoice}
        onChange={handleFieldChange}
        rows={rowsWithTotal}
        onRowFieldChange={updateRowField}
        columns={columns}
        onRowExtraChange={updateRowExtra}
      />

      {/* Terms layout controls */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <p className="text-xs font-medium text-slate-400">
          Terms box layout (px)
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <label className="space-y-1">
            <span className="text-slate-500">X</span>
            <input
              type="number"
              value={termsLayout.x}
              onChange={(e) =>
                setTermsLayout((prev) => ({
                  ...prev,
                  x: Number(e.target.value),
                }))
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-1.5 py-1 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-1">
            <span className="text-slate-500">Y</span>
            <input
              type="number"
              value={termsLayout.y}
              onChange={(e) =>
                setTermsLayout((prev) => ({
                  ...prev,
                  y: Number(e.target.value),
                }))
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-1.5 py-1 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-1">
            <span className="text-slate-500">Width</span>
            <input
              type="number"
              value={termsLayout.width}
              onChange={(e) =>
                setTermsLayout((prev) => ({
                  ...prev,
                  width: Number(e.target.value),
                }))
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-1.5 py-1 outline-none focus:border-cyan-400"
            />
          </label>
          <label className="space-y-1">
            <span className="text-slate-500">Height</span>
            <input
              type="number"
              value={termsLayout.height}
              onChange={(e) =>
                setTermsLayout((prev) => ({
                  ...prev,
                  height: Number(e.target.value),
                }))
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-1.5 py-1 outline-none focus:border-cyan-400"
            />
          </label>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 space-y-2">
        <p className="text-xs font-medium text-slate-400">Table controls</p>
        <button
          onClick={addRow}
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-slate-100 hover:border-cyan-400"
        >
          + Add row
        </button>
        <button
          onClick={addColumn}
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-slate-100 hover:border-cyan-400"
        >
          + Add column
        </button>
        {columns.some((c) => c.kind === "extra") && (
          <button
            onClick={() => {
              const lastExtra = [...columns]
                .reverse()
                .find((c) => c.kind === "extra");
              if (lastExtra) deleteColumn(lastExtra.id);
            }}
            className="w-full rounded-md bg-slate-900 border border-rose-600 px-2 py-1.5 text-xs text-rose-100 hover:bg-rose-900/40"
          >
            Delete last column
          </button>
        )}
      </div>
    </div>
  );

  // Calculate dynamic dimensions
  const maxRight = Math.max(
    headerLayout.x + headerLayout.width,
    billToLayout.x + billToLayout.width,
    locationLayout.x + locationLayout.width,
    tableLayout.x + tableLayout.width,
    totalsLayout.x + totalsLayout.width,
    termsLayout.x + termsLayout.width
  );
  const containerWidth = Math.max(900 * sizeFactor, maxRight + 40 * sizeFactor); // right margin

  const maxY = Math.max(
    headerLayout.y + headerLayout.height,
    billToLayout.y + billToLayout.height,
    locationLayout.y + locationLayout.height,
    tableLayout.y + tableLayout.height,
    totalsLayout.y + totalsLayout.height,
    termsLayout.y + termsLayout.height
  );
  const dynamicMinHeight = Math.max(900 * sizeFactor, maxY + 50 * sizeFactor);

  const marginLeft = 32 * sizeFactor;
  const marginRight = 32 * sizeFactor;
  const dividerMargin = 16 * sizeFactor;
  const dividerTop = headerLayout.y + headerLayout.height + dividerMargin;
  const dividerLineHeight = 2 * sizeFactor;

  // --------- PREVIEW ----------

  const preview = (
    <div className="flex flex-col w-full h-full">
      <TopBar
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAddRow={handleAddRowTop}
        onAddColumn={handleAddColumnTop}
        onDeleteTable={handleDeleteTableTop}
        onOpenTemplates={handleOpenTemplates}
        onExportPDF={handleExportPDF}
        layoutMode={layoutMode}
        onToggleLayoutMode={handleToggleLayoutMode}
      />

      <main className="bg-slate-950 text-slate-50 flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-4">
          <div className="rounded-xl bg-slate-900/10">
            <div
              ref={invoiceRef}
              className={`${fontFamilyClass} relative bg-white border border-slate-200 mx-auto my-0`}
              style={{
                fontSize: `${baseSize}px`,
                borderRadius: `${style.borderRadius}px`,
                color: style.textColor,
                boxShadow: style.showShadow
                  ? "0 18px 40px rgba(15,23,42,0.22)"
                  : "none",
                width: `${containerWidth}px`,
                minHeight: `${dynamicMinHeight}px`,
              }}
            >
              {/* Header as Rnd */}
              <Rnd
                bounds="parent"
                enableResizing={layoutMode && !hideUI}
                disableDragging={!layoutMode || hideUI}
                size={{
                  width: headerLayout.width,
                  height: headerLayout.height,
                }}
                position={{
                  x: headerLayout.x - marginLeft,
                  y: headerLayout.y,
                }}
                onDragStop={(_, d) =>
                  setHeaderLayout((prev) => ({
                    ...prev,
                    x: d.x + marginLeft,
                    y: d.y,
                  }))
                }
                onResizeStop={(_, __, ref, ___, pos) =>
                  setHeaderLayout({
                    x: pos.x + marginLeft,
                    y: pos.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  })
                }
                style={{
                  border: layoutMode && !hideUI ? "1px dashed #38bdf8" : "none",
                  borderRadius: 8,
                  backgroundColor: layoutMode && !hideUI ? "#f9fafb" : "transparent",
                }}
              >
                <div className="flex items-start justify-between px-4 py-3 h-full">
                  <div>
                    <p
                      style={{
                        fontSize: fs(1.2),
                        fontWeight: fw(600),
                        color: style.primaryColor,
                      }}
                    >
                      {invoice.companyName}
                    </p>
                    <p
                      style={{
                        fontSize: fs(0.85),
                        color: "#6b7280",
                        marginTop: "0.25rem",
                      }}
                    >
                      {invoice.companyAddressLine1}
                    </p>
                    <p style={{ fontSize: fs(0.85), color: "#6b7280" }}>
                      {invoice.companyAddressLine2}
                    </p>
                    <p
                      style={{
                        fontSize: fs(0.85),
                        color: "#6b7280",
                        marginTop: "0.5rem",
                      }}
                    >
                      {invoice.companyPhone}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    {style.logoSrc ? (
                      <img
                        src={style.logoSrc}
                        alt="Logo"
                        className="rounded-full object-cover"
                        style={{
                          width: style.logoSize,
                          height: style.logoSize,
                        }}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: style.logoSize,
                          height: style.logoSize,
                          borderRadius: "999px",
                          backgroundColor: "#9ca3af",
                          fontSize: fs(0.75),
                          color: "white",
                        }}
                      >
                        LOGO
                      </div>
                    )}

                    <div style={{ fontSize: fs(0.8), color: "#6b7280" }}>
                      <p>
                        Invoice Date:{" "}
                        <span
                          style={{ fontWeight: fw(600), color: "#111827" }}
                        >
                          {invoice.issueDate}
                        </span>
                      </p>
                      <p>
                        Due Date:{" "}
                        <span
                          style={{ fontWeight: fw(600), color: "#111827" }}
                        >
                          {invoice.dueDate}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Rnd>

              {/* Blue divider - absolute positioned and scaled */}
              <div
                style={{
                  position: "absolute",
                  top: `${dividerTop}px`,
                  left: `${marginLeft}px`,
                  right: `${marginRight}px`,
                  height: `${dividerLineHeight}px`,
                  backgroundColor: style.primaryColor,
                }}
              />

              {/* Bill To box */}
              <Rnd
                bounds="parent"
                enableResizing={layoutMode}
                disableDragging={!layoutMode}
                size={{
                  width: billToLayout.width,
                  height: billToLayout.height,
                }}
                position={{
                  x: billToLayout.x - marginLeft,
                  y: billToLayout.y,
                }}
                onDragStop={(_, d) =>
                  setBillToLayout((prev) => ({
                    ...prev,
                    x: d.x + marginLeft,
                    y: d.y,
                  }))
                }
                onResizeStop={(_, __, ref, ___, pos) =>
                  setBillToLayout({
                    x: pos.x + marginLeft,
                    y: pos.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  })
                }
                style={{
                  border: layoutMode ? "1px dashed #38bdf8" : "none",
                  borderRadius: 8,
                  backgroundColor: layoutMode ? "#f9fafb" : "transparent",
                }}
              >
                <div className="px-4 py-3">
                  <p
                    style={{
                      fontSize: fs(0.9),
                      fontWeight: fw(600),
                      color: style.primaryColor,
                    }}
                  >
                    BILL TO
                  </p>
                  <p
                    style={{
                      marginTop: "0.4rem",
                      fontSize: fs(0.8),
                      color: "#334155",
                      lineHeight: 1.5,
                    }}
                  >
                    {invoice.billToContactName}
                    <br />
                    {invoice.billToName}
                    <br />
                    {invoice.billToAddress}
                    <br />
                    {invoice.billToEmail}
                  </p>
                </div>
              </Rnd>

              {/* Location box */}
              <Rnd
                bounds="parent"
                enableResizing={layoutMode}
                disableDragging={!layoutMode}
                size={{
                  width: locationLayout.width,
                  height: locationLayout.height,
                }}
                position={{
                  x: locationLayout.x - marginLeft,
                  y: locationLayout.y,
                }}
                onDragStop={(_, d) =>
                  setLocationLayout((prev) => ({
                    ...prev,
                    x: d.x + marginLeft,
                    y: d.y,
                  }))
                }
                onResizeStop={(_, __, ref, ___, pos) =>
                  setLocationLayout({
                    x: pos.x + marginLeft,
                    y: pos.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  })
                }
                style={{
                  border: layoutMode ? "1px dashed #38bdf8" : "none",
                  borderRadius: 8,
                  backgroundColor: layoutMode ? "#f9fafb" : "transparent",
                }}
              >
                <div className="px-4 py-3">
                  <p
                    style={{
                      fontSize: fs(0.9),
                      fontWeight: fw(600),
                      color: style.primaryColor,
                    }}
                  >
                    LOCATION
                  </p>
                  <p
                    style={{
                      marginTop: "0.4rem",
                      fontSize: fs(0.8),
                      color: "#334155",
                      lineHeight: 1.5,
                    }}
                  >
                    {invoice.locationName}
                    <br />
                    {invoice.locationAddress}
                    <br />
                    {invoice.locationPhone}
                  </p>
                </div>
              </Rnd>

              {/* Items table as Rnd */}
              <Rnd
                bounds="parent"
                enableResizing={layoutMode}
                disableDragging={!layoutMode}
                size={{
                  width: tableLayout.width,
                  height: tableLayout.height,
                }}
                position={{
                  x: tableLayout.x - marginLeft,
                  y: tableLayout.y,
                }}
                onDragStop={(_, d) =>
                  setTableLayout((prev) => ({
                    ...prev,
                    x: d.x + marginLeft,
                    y: d.y,
                  }))
                }
                onResizeStop={(_, __, ref, ___, pos) =>
                  setTableLayout({
                    x: pos.x + marginLeft,
                    y: pos.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  })
                }
                style={{
                  border: layoutMode ? "1px dashed #38bdf8" : "none",
                  borderRadius: 8,
                  backgroundColor: layoutMode ? "#f9fafb" : "transparent",
                }}
              >
                <div className="px-4 pt-3 pb-2 overflow-x-auto">
                  <div className="border border-slate-300">
                    {/* header + edit icon */}
                    <div className="flex items-stretch justify-between">
                      <div
                        className="grid font-semibold text-white flex-1"
                        style={{
                          backgroundColor: style.primaryColor,
                          fontSize: fs(0.8),
                          gridTemplateColumns: [
                            "2fr",
                            "0.6fr",
                            "1fr",
                            "1fr",
                            ...columns
                              .filter((c) => c.kind === "extra")
                              .map(() => "1fr"),
                          ].join(" "),
                        }}
                      >
                        <div className="py-1.5 px-2">DESCRIPTION</div>
                        <div className="py-1.5 px-2 text-center">QTY</div>
                        <div className="py-1.5 px-2 text-right">
                          UNIT PRICE
                        </div>
                        <div className="py-1.5 px-2 text-right">TOTAL</div>
                        {columns
                          .filter((c) => c.kind === "extra")
                          .map((col) => (
                            <div
                              key={col.id}
                              className="py-1.5 px-2 text-center"
                            >
                              {col.name}
                            </div>
                          ))}
                      </div>

                      {/* edit button outside table box */}
                      {!hideUI && (
                        <button
                          type="button"
                          onClick={() => setShowEditTableModal(true)}
                          className="ml-1 mr-2 mt-1 inline-flex items-center justify-center h-7 w-7 rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-slate-100"
                          title="Edit table"
                        >
                          ✏️
                        </button>
                      )}
                    </div>

                    {/* rows */}
                    {rowsWithTotal.map((row) => (
                      <div
                        key={row.id}
                        className="grid border-t border-slate-300"
                        style={{
                          fontSize: fs(0.8),
                          color: "#334155",
                          gridTemplateColumns: [
                            "2fr",
                            "0.6fr",
                            "1fr",
                            "1fr",
                            ...columns
                              .filter((c) => c.kind === "extra")
                              .map(() => "1fr"),
                          ].join(" "),
                        }}
                      >
                        <div className="py-1.5 px-2">
                          <p style={{ fontWeight: fw(600) }}>
                            {row.description}
                          </p>
                          <p
                            style={{
                              fontSize: fs(0.75),
                              color: "#6b7280",
                              marginTop: "0.1rem",
                            }}
                          >
                            {row.details}
                          </p>
                        </div>
                        <div className="py-1.5 px-2 text-center">
                          {row.qty}
                        </div>
                        <div className="py-1.5 px-2 text-right">
                          {Number(row.unitPrice || "0").toFixed(2)}
                        </div>
                        <div className="py-1.5 px-2 text-right">
                          {row.total}
                        </div>
                        {columns
                          .filter((c) => c.kind === "extra")
                          .map((col) => (
                            <div
                              key={col.id}
                              className="py-1.5 px-2 text-center"
                            >
                              {row.extras?.[col.id] ?? ""}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </Rnd>

              {/* Totals as Rnd */}
              <Rnd
                bounds="parent"
                enableResizing={layoutMode}
                disableDragging={!layoutMode}
                size={{
                  width: totalsLayout.width,
                  height: totalsLayout.height,
                }}
                position={{
                  x: totalsLayout.x - marginLeft,
                  y: totalsLayout.y,
                }}
                onDragStop={(_, d) =>
                  setTotalsLayout((prev) => ({
                    ...prev,
                    x: d.x + marginLeft,
                    y: d.y,
                  }))
                }
                onResizeStop={(_, __, ref, ___, pos) =>
                  setTotalsLayout({
                    x: pos.x + marginLeft,
                    y: pos.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  })
                }
                style={{
                  border: layoutMode ? "1px dashed #38bdf8" : "none",
                  borderRadius: 8,
                  backgroundColor: layoutMode ? "#f9fafb" : "transparent",
                }}
              >
                <div
                  className="px-4 py-3 h-full flex items-center justify-center"
                  style={{ fontSize: fs(0.8), color: "#334155" }}
                >
                  <div className="w-full">
                    <div className="flex justify-between">
                      <span>SUBTOTAL</span>
                      <span>{subtotalStr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DISCOUNT ({discountPct.toFixed(0)}%)</span>
                      <span>-{discountStr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SUBTOTAL LESS DISCOUNT</span>
                      <span>{subtotalLessStr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TAX RATE</span>
                      <span>{invoice.taxRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TOTAL TAX</span>
                      <span>{invoice.totalTax}</span>
                    </div>
                    <div className="flex justify-between mt-1 border-t border-slate-300 pt-1">
                      <span
                        style={{
                          fontWeight: fw(600),
                          color: style.primaryColor,
                        }}
                      >
                        Balance Due
                      </span>
                      <span style={{ fontWeight: fw(600) }}>{balanceStr}</span>
                    </div>
                  </div>
                </div>
              </Rnd>

              {/* Terms box as Rnd */}
              <Rnd
                bounds="parent"
                enableResizing={layoutMode}
                disableDragging={!layoutMode}
                size={{
                  width: termsLayout.width,
                  height: termsLayout.height,
                }}
                position={{
                  x: termsLayout.x - marginLeft,
                  y: termsLayout.y,
                }}
                onDragStop={(_, d) =>
                  setTermsLayout((prev) => ({
                    ...prev,
                    x: d.x + marginLeft,
                    y: d.y,
                  }))
                }
                onResizeStop={(_, __, ref, ___, pos) =>
                  setTermsLayout({
                    x: pos.x + marginLeft,
                    y: pos.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  })
                }
                style={{
                  border: layoutMode ? "1px dashed #38bdf8" : "none",
                  borderRadius: 8,
                  backgroundColor: layoutMode ? "#f9fafb" : "transparent",
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{ fontSize: fs(0.8), color: "#334155" }}
                >
                  <p>Thank you for your business!</p>
                  <p
                    style={{
                      marginTop: "0.75rem",
                      fontWeight: fw(600),
                      color: style.primaryColor,
                    }}
                  >
                    {invoice.termsTitle}
                  </p>
                  <p
                    style={{
                      fontSize: fs(0.75),
                      color: "#6b7280",
                      marginTop: "0.25rem",
                    }}
                  >
                    {invoice.termsLine1}
                  </p>
                  <p
                    style={{
                      fontSize: fs(0.75),
                      color: "#6b7280",
                    }}
                  >
                    {invoice.termsLine2}
                  </p>
                </div>
              </Rnd>
            </div>
          </div>
        </div>
      </main>

      {/* Add Column Modal */}
      {showColumnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              Add Column
            </h2>
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Column name (e.g., Notes, Warranty)"
              className="w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={confirmAddColumn}
                className="flex-1 px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-400"
              >
                Add
              </button>
              <button
                onClick={() => setShowColumnModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-100 rounded-md hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditTableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-[560px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              Edit table
            </h2>

            {/* columns */}
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2">Columns</p>
              <div className="space-y-2">
                {columns.map((col) => (
                  <div key={col.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={col.name}
                      disabled={col.kind === "fixed"}
                      onChange={(e) => {
                        const name = e.target.value;
                        setColumns((prev) =>
                          prev.map((c) =>
                            c.id === col.id ? { ...c, name } : c
                          )
                        );
                      }}
                      className={`flex-1 rounded-md bg-slate-800 border px-2 py-1 text-xs text-slate-100 outline-none ${
                        col.kind === "fixed"
                          ? "border-slate-700 opacity-60 cursor-not-allowed"
                          : "border-slate-600 focus:border-cyan-400"
                      }`}
                    />
                    {col.kind === "extra" && (
                      <button
                        type="button"
                        onClick={() => deleteColumn(col.id)}
                        className="px-2 py-1 text-[11px] rounded-md border border-rose-500 text-rose-200 hover:bg-rose-900/40"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* rows */}
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2">Rows</p>
              <div className="space-y-3">
                {invoice.rows.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-md border border-slate-700 bg-slate-900/60 p-3 space-y-2"
                  >
                    <p className="text-[11px] text-slate-400 mb-1">
                      Row #{row.id}
                    </p>
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) =>
                        updateRowField(row.id, "description", e.target.value)
                      }
                      placeholder="Description"
                      className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400 mb-1"
                    />
                    <input
                      type="text"
                      value={row.details}
                      onChange={(e) =>
                        updateRowField(row.id, "details", e.target.value)
                      }
                      placeholder="Details"
                      className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400 mb-1"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={row.qty}
                        onChange={(e) =>
                          updateRowField(row.id, "qty", e.target.value)
                        }
                        className="w-20 rounded-md bg-slate-800 border border-slate-600 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400"
                        placeholder="Qty"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={row.unitPrice}
                        onChange={(e) =>
                          updateRowField(
                            row.id,
                            "unitPrice",
                            e.target.value
                          )
                        }
                        className="flex-1 rounded-md bg-slate-800 border border-slate-600 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400"
                        placeholder="Unit price"
                      />
                    </div>

                    {columns
                      .filter((c) => c.kind === "extra")
                      .map((col) => (
                        <div key={col.id} className="mt-1">
                          <p className="text-[11px] text-slate-400 mb-1">
                            {col.name}
                          </p>
                          <input
                            type="text"
                            value={row.extras?.[col.id] ?? ""}
                            onChange={(e) =>
                              updateRowExtra(
                                row.id,
                                col.id,
                                e.target.value
                              )
                            }
                            className="w-full rounded-md bg-slate-800 border border-slate-600 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400"
                          />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowEditTableModal(false)}
                className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              Templates
            </h2>
            <div className="space-y-2 mb-4">
              <button className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-slate-100 rounded-md hover:bg-slate-700 text-left">
                Simple Blue
              </button>
              <button className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-slate-100 rounded-md hover:bg-slate-700 text-left">
                Creative Bold (Coming Soon)
              </button>
              <button className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-slate-100 rounded-md hover:bg-slate-700 text-left">
                Professional (Coming Soon)
              </button>
            </div>
            <button
              onClick={() => setShowTemplateModal(false)}
              className="w-full px-4 py-2 bg-slate-700 text-slate-100 rounded-md hover:bg-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TemplateLayout
      title="Rezwan Invoice · Simple Blue"
      subtitle="Left: edit all text and table. Center: Simple Blue invoice (layout mode + PDF export). Right: brand, typography, logo & radius."
      left={extendedLeft}
      preview={preview}
      right={
        <RightSidebar styleConfig={style} onStyleChange={handleStyleChange} />
      }
    />
  );
}