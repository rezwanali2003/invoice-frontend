"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { Rnd } from "react-rnd";
import TemplateLayout from "../TemplateLayout";
import LeftSidebar from "../LeftSidebar";
import RightSidebar from "../RightSidebar";
import TopBar from "../TopBar";

const defaultInvoice = {
  companyName: "Rezwan Studio",
  tagline: "Creative Invoice Template",
  contactEmail: "billing@rezwanstudio.com",
  contactPhone: "+1 (555) 555-0000",
  contactWebsite: "rezwanstudio.com",
  billToName: "ROBERT KAMIL",
  billToCompany: "Creative Athletes Ltd",
  billToAddress: "123 Baker Street, London, UK",
  billToEmail: "robert@example.com",
  invoiceNumber: "INV-2025-0001",
  currency: "US",
  issueDate: "11/11/25",
  dueDate: "12/12/25",
  taxRate: "10",
  discountPercent: "25",
  rows: [
    {
      id: 1,
      description: "Your Description here",
      details: "Add a short description here",
      qty: "1",
      unitPrice: "500.00",
      extras: {},
    },
  ],
  paymentMethod: "Bank transfer · PayPal · Credit card",
  footerLeft: "Thank you for your business.",
  footerRight: "All rights reserved.",
};

const defaultColumns = [
  { id: "description", name: "Items Description", kind: "fixed" },
  { id: "unitPrice", name: "Unit Price", kind: "fixed" },
  { id: "qty", name: "Qty", kind: "fixed" },
  { id: "total", name: "Total", kind: "fixed" },
];

const defaultStyle = {
  primaryColor: "#f97316",
  accentColor: "#111827",
  fontFamily: "system",
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 22,
  logoSrc: "",
  logoSize: 40,
  showShadow: true,
};

const defaultTemplateName = "Creative Bold";

const defaultHeaderLayout = {
  x: 40,
  y: 40,
  width: 760,
  height: 120,
};

const defaultTopBandLayout = {
  x: 40,
  y: 180,
  width: 760,
  height: 160,
};

const defaultTableLayout = {
  x: 40,
  y: 360,
  width: 760,
  height: 300,
};

const defaultTotalsLayout = {
  x: 500,
  y: 680,
  width: 256,
  height: 80,
};

const defaultPaymentLayout = {
  x: 40,
  y: 780,
  width: 760,
  height: 60,
};

const defaultFooterLayout = {
  x: 40,
  y: 860,
  width: 760,
  height: 60,
};

export default function CreativeBoldPage() {
  // --------- CORE STATE ----------
  const [invoice, setInvoice] = useState(defaultInvoice);
  const [columns, setColumns] = useState(defaultColumns);
  const [styleConfig, setStyleConfig] = useState(defaultStyle);
  const [templateName, setTemplateName] = useState(defaultTemplateName);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showEditTableModal, setShowEditTableModal] = useState(false);
  const [layoutMode, setLayoutMode] = useState(false);
  const [hideUI, setHideUI] = useState(false);

  // Layout state (page coordinate system, px)
  const [headerLayout, setHeaderLayout] = useState(defaultHeaderLayout);
  const [topBandLayout, setTopBandLayout] = useState(defaultTopBandLayout);
  const [tableLayout, setTableLayout] = useState(defaultTableLayout);
  const [totalsLayout, setTotalsLayout] = useState(defaultTotalsLayout);
  const [paymentLayout, setPaymentLayout] = useState(defaultPaymentLayout);
  const [footerLayout, setFooterLayout] = useState(defaultFooterLayout);

  const invoiceRef = useRef(null);
  const prevFontSizeRef = useRef(12);
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isRestoringRef = useRef(false);
  const isInitialLoadRef = useRef(false);
  const loadedDataRef = useRef(null);

  // Load saved data into ref
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedKey = "creativeBoldLayout";
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
        styleConfig: loaded.styleConfig || defaultStyle,
        templateName: loaded.templateName || defaultTemplateName,
        headerLayout: loaded.headerLayout || defaultHeaderLayout,
        topBandLayout: loaded.topBandLayout || defaultTopBandLayout,
        tableLayout: loaded.tableLayout || defaultTableLayout,
        totalsLayout: loaded.totalsLayout || defaultTotalsLayout,
        paymentLayout: loaded.paymentLayout || defaultPaymentLayout,
        footerLayout: loaded.footerLayout || defaultFooterLayout,
      };
      setInvoice(fullLoaded.invoice);
      setColumns(fullLoaded.columns);
      setStyleConfig(fullLoaded.styleConfig);
      setTemplateName(fullLoaded.templateName);
      setHeaderLayout(fullLoaded.headerLayout);
      setTopBandLayout(fullLoaded.topBandLayout);
      setTableLayout(fullLoaded.tableLayout);
      setTotalsLayout(fullLoaded.totalsLayout);
      setPaymentLayout(fullLoaded.paymentLayout);
      setFooterLayout(fullLoaded.footerLayout);
      snapshot = fullLoaded;
      isInitialLoadRef.current = true;
    } else {
      snapshot = {
        invoice,
        columns,
        styleConfig,
        templateName,
        headerLayout,
        topBandLayout,
        tableLayout,
        totalsLayout,
        paymentLayout,
        footerLayout,
      };
      localStorage.setItem("creativeBoldLayout", JSON.stringify(snapshot));
    }
    setHistory([JSON.parse(JSON.stringify(snapshot))]);
    setCurrentIndex(0);
    prevFontSizeRef.current = loaded ? (snapshot.styleConfig.fontSize || 12) : styleConfig.fontSize;
  }, []);

  // Scale all layout dimensions (x, y, width, height) and style properties when fontSize changes
  useEffect(() => {
    const oldSize = prevFontSizeRef.current;
    if (oldSize === styleConfig.fontSize) return;
    const scale = styleConfig.fontSize / oldSize;
    setHeaderLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));
    setTopBandLayout((prev) => ({
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
    setTotalsLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));
    setPaymentLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));
    setFooterLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));
    setStyleConfig((prev) => ({
      ...prev,
      logoSize: Math.round(prev.logoSize * scale),
      borderRadius: Math.round(prev.borderRadius * scale),
    }));
    prevFontSizeRef.current = styleConfig.fontSize;
  }, [styleConfig.fontSize]);

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
      styleConfig,
      templateName,
      headerLayout,
      topBandLayout,
      tableLayout,
      totalsLayout,
      paymentLayout,
      footerLayout,
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
        localStorage.setItem("creativeBoldLayout", JSON.stringify(snapshot));
      } catch (err) {
        console.error("Failed to save to localStorage:", err);
      }
    }
  }, [invoice, columns, styleConfig, templateName, headerLayout, topBandLayout, tableLayout, totalsLayout, paymentLayout, footerLayout]);

  const handleUndo = () => {
    if (currentIndex <= 0 || history.length === 0) return;
    isRestoringRef.current = true;
    const prevIndex = currentIndex - 1;
    const prevSnapshot = history[prevIndex];
    setCurrentIndex(prevIndex);
    setInvoice(prevSnapshot.invoice);
    setColumns(prevSnapshot.columns);
    setStyleConfig(prevSnapshot.styleConfig);
    prevFontSizeRef.current = prevSnapshot.styleConfig.fontSize;
    setTemplateName(prevSnapshot.templateName);
    setHeaderLayout(prevSnapshot.headerLayout);
    setTopBandLayout(prevSnapshot.topBandLayout);
    setTableLayout(prevSnapshot.tableLayout);
    setTotalsLayout(prevSnapshot.totalsLayout);
    setPaymentLayout(prevSnapshot.paymentLayout);
    setFooterLayout(prevSnapshot.footerLayout);
  };

  const handleRedo = () => {
    if (currentIndex >= history.length - 1 || history.length === 0) return;
    isRestoringRef.current = true;
    const nextIndex = currentIndex + 1;
    const nextSnapshot = history[nextIndex];
    setCurrentIndex(nextIndex);
    setInvoice(nextSnapshot.invoice);
    setColumns(nextSnapshot.columns);
    setStyleConfig(nextSnapshot.styleConfig);
    prevFontSizeRef.current = nextSnapshot.styleConfig.fontSize;
    setTemplateName(nextSnapshot.templateName);
    setHeaderLayout(nextSnapshot.headerLayout);
    setTopBandLayout(nextSnapshot.topBandLayout);
    setTableLayout(nextSnapshot.tableLayout);
    setTotalsLayout(nextSnapshot.totalsLayout);
    setPaymentLayout(nextSnapshot.paymentLayout);
    setFooterLayout(nextSnapshot.footerLayout);
  };

  // --------- HELPERS ----------
  const handleFieldChange = (field, value) =>
    setInvoice((prev) => ({ ...prev, [field]: value }));
  const handleStyleChange = (field, value) =>
    setStyleConfig((prev) => ({ ...prev, [field]: value }));

  const fontFamilyValue = useMemo(() => {
    if (styleConfig.fontFamily === "serif") {
      return "ui-serif, Georgia, 'Times New Roman', serif";
    }
    if (styleConfig.fontFamily === "mono") {
      return "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    }
    return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }, [styleConfig.fontFamily]);

  const baseSize = styleConfig.fontSize;
  const sizeFactor = baseSize / 12;
  const fs = (em) => `${em * sizeFactor}em`;
  const fw = (base) =>
    Math.min(800, Math.max(300, Math.round((base + styleConfig.fontWeight) / 2)));

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
  const taxRatePct = Number(invoice.taxRate || "0") / 100;
  const totalTax = subtotalLess * taxRatePct;
  const grandTotal = subtotalLess + totalTax;
  const subtotalStr = subtotal.toFixed(2);
  const discountStr = discountAmt.toFixed(2);
  const subtotalLessStr = subtotalLess.toFixed(2);
  const totalTaxStr = totalTax.toFixed(2);
  const grandTotalStr = grandTotal.toFixed(2);
  const taxLabel = `TAX VAT(${invoice.taxRate}%)`;
  const discountLabel = `DISCOUNT (${discountPct}%)`;

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
    setTotalsLayout((prev) => ({ ...prev, y: prev.y + delta }));
    setPaymentLayout((prev) => ({ ...prev, y: prev.y + delta }));
    setFooterLayout((prev) => ({ ...prev, y: prev.y + delta }));
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
      backgroundColor: null, // No forced background—preserve the element's dark theme
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
  const marginLeft = 32 * sizeFactor;
  const marginRight = 32 * sizeFactor;
  const maxRight = Math.max(
    headerLayout.x + headerLayout.width,
    topBandLayout.x + topBandLayout.width,
    tableLayout.x + tableLayout.width,
    totalsLayout.x + totalsLayout.width,
    paymentLayout.x + paymentLayout.width,
    footerLayout.x + footerLayout.width
  );
  const containerWidth = Math.max(900 * sizeFactor, maxRight + marginRight);
  const maxY = Math.max(
    headerLayout.y + headerLayout.height,
    topBandLayout.y + topBandLayout.height,
    tableLayout.y + tableLayout.height,
    totalsLayout.y + totalsLayout.height,
    paymentLayout.y + paymentLayout.height,
    footerLayout.y + footerLayout.height
  );
  const dynamicMinHeight = Math.max(900 * sizeFactor, maxY + marginRight);
  const outerPadding = Math.round(3 * sizeFactor);
  const outerBorderRadius = styleConfig.borderRadius + Math.round(4 * sizeFactor);

  const currencySymbol = "$"; // Hardcoded for US, extend if needed

  const previewRootStyle = {
    "--primary-color": styleConfig.primaryColor,
    "--accent-color": styleConfig.accentColor,
    fontFamily: fontFamilyValue,
    fontSize: `${baseSize}px`,
  };

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
              className="shadow-2xl mx-auto my-0"
              style={{
                padding: `${outerPadding}px`,
                backgroundColor: styleConfig.primaryColor,
                borderRadius: `${outerBorderRadius}px`,
                ...previewRootStyle,
              }}
            >
              <div
                ref={invoiceRef}
                className="relative overflow-hidden"
                style={{
                  borderRadius: `${styleConfig.borderRadius}px`,
                  backgroundColor: "#020617",
                  color: "white",
                  width: `${containerWidth}px`,
                  minHeight: `${dynamicMinHeight}px`,
                  ...previewRootStyle,
                }}
              >
                {/* Header as Rnd */}
                <Rnd
                  bounds="parent"
                  enableResizing={layoutMode}
                  disableDragging={!layoutMode}
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
                    border: layoutMode ? "1px dashed #38bdf8" : "none",
                    borderRadius: 8,
                    backgroundColor: layoutMode ? "#f9fafb" : "transparent",
                  }}
                >
                  <div className="flex items-start justify-between px-8 pt-6 pb-4 border-b border-orange-500/40 h-full">
                    <div className="flex items-center gap-3">
                      {styleConfig.logoSrc ? (
                        <img
                          src={styleConfig.logoSrc}
                          alt="Logo"
                          className="object-cover"
                          style={{
                            width: styleConfig.logoSize,
                            height: styleConfig.logoSize,
                            borderRadius: 12,
                          }}
                        />
                      ) : (
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: styleConfig.logoSize,
                            height: styleConfig.logoSize,
                            borderRadius: 10,
                            backgroundColor: styleConfig.primaryColor,
                            fontSize: fs(0.75),
                            fontWeight: styleConfig.fontWeight,
                          }}
                        >
                          LOGO
                        </div>
                      )}
                      <div className="flex flex-col leading-tight">
                        <span
                          style={{
                            fontSize: fs(1.3),
                            fontWeight: styleConfig.fontWeight,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {invoice.companyName}
                        </span>
                        <span
                          style={{
                            fontSize: fs(0.7),
                            color: "rgb(148 163 184)",
                          }}
                        >
                          {invoice.tagline}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div>
                        <span
                          style={{
                            padding: "0.35rem 1.2rem",
                            borderRadius: 999,
                            border: `1px solid rgba(249,115,22,0.8)`,
                            fontSize: fs(0.8),
                            fontWeight: styleConfig.fontWeight,
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            background:
                              "linear-gradient(135deg, rgba(249,115,22,0.2), transparent)",
                          }}
                        >
                          INVOICE
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: fs(0.7),
                          color: "rgb(148 163 184)",
                        }}
                      >
                        <p>{invoice.contactEmail}</p>
                        <p>{invoice.contactPhone}</p>
                        <p>{invoice.contactWebsite}</p>
                      </div>
                    </div>
                  </div>
                </Rnd>

                {/* Top band as Rnd */}
                <Rnd
                  bounds="parent"
                  enableResizing={layoutMode}
                  disableDragging={!layoutMode}
                  size={{
                    width: topBandLayout.width,
                    height: topBandLayout.height,
                  }}
                  position={{
                    x: topBandLayout.x - marginLeft,
                    y: topBandLayout.y,
                  }}
                  onDragStop={(_, d) =>
                    setTopBandLayout((prev) => ({
                      ...prev,
                      x: d.x + marginLeft,
                      y: d.y,
                    }))
                  }
                  onResizeStop={(_, __, ref, ___, pos) =>
                    setTopBandLayout({
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
                  <div className="px-8 py-4 grid grid-cols-3 gap-6 border-b border-orange-500/40 h-full">
                    <div
                      className="rounded-xl px-4 py-3"
                      style={{
                        border: "1px solid rgba(148,163,184,0.3)",
                        fontSize: fs(0.7),
                      }}
                    >
                      <p
                        style={{
                          fontSize: fs(0.7),
                          textTransform: "uppercase",
                          letterSpacing: "0.16em",
                          color: "rgb(148 163 184)",
                          fontWeight: styleConfig.fontWeight,
                        }}
                      >
                        Bill To
                      </p>
                      <p
                        style={{
                          marginTop: "0.4rem",
                          fontSize: fs(0.9),
                          fontWeight: styleConfig.fontWeight,
                        }}
                      >
                        {invoice.billToName}
                      </p>
                      <p
                        style={{
                          fontSize: fs(0.8),
                          color: "rgb(148 163 184)",
                        }}
                      >
                        {invoice.billToCompany}
                      </p>
                      <p
                        style={{
                          marginTop: "0.2rem",
                          fontSize: fs(0.8),
                          color: "rgb(148 163 184)",
                        }}
                      >
                        {invoice.billToAddress}
                      </p>
                      <p
                        style={{
                          fontSize: fs(0.8),
                          color: "rgb(148 163 184)",
                        }}
                      >
                        {invoice.billToEmail}
                      </p>
                    </div>

                    <div
                      className="rounded-xl px-4 py-3"
                      style={{
                        border: "1px solid rgba(148,163,184,0.3)",
                        fontSize: fs(0.7),
                      }}
                    >
                      <p
                        style={{
                          fontSize: fs(0.7),
                          textTransform: "uppercase",
                          letterSpacing: "0.16em",
                          color: "rgb(148 163 184)",
                          fontWeight: styleConfig.fontWeight,
                        }}
                      >
                        Invoice Details
                      </p>
                      <div
                        className="mt-2 space-y-1"
                        style={{ fontSize: fs(0.8) }}
                      >
                        <p>
                          <span className="text-slate-400">Invoice No: </span>
                          <span className="text-slate-50 font-semibold">
                            {invoice.invoiceNumber}
                          </span>
                        </p>
                        <p>
                          <span className="text-slate-400">Issue Date: </span>
                          <span className="text-slate-50">
                            {invoice.issueDate}
                          </span>
                        </p>
                        <p>
                          <span className="text-slate-400">Due Date: </span>
                          <span className="text-slate-50">
                            {invoice.dueDate}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div
                      className="rounded-xl px-4 py-3 flex flex-col justify-between"
                      style={{
                        border: "1px solid rgba(249,115,22,0.7)",
                        background:
                          "linear-gradient(145deg, rgba(249,115,22,0.18), rgba(15,23,42,0.9))",
                        fontSize: fs(0.8),
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-slate-200">Total</span>
                        <span
                          style={{
                            padding: "0.1rem 0.5rem",
                            borderRadius: 999,
                            border: "1px solid rgba(148,163,184,0.3)",
                            fontSize: fs(0.7),
                            textTransform: "uppercase",
                            letterSpacing: "0.16em",
                            color: "rgb(226 232 240)",
                          }}
                        >
                          {invoice.currency}
                        </span>
                      </div>
                      <p
                        style={{
                          marginTop: "0.4rem",
                          fontSize: fs(1.4),
                          fontWeight: styleConfig.fontWeight,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {currencySymbol}
                        {grandTotalStr}
                      </p>
                    </div>
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
                  <div className="h-full">
                    {/* header + edit icon */}
                    <div className="flex items-stretch justify-between px-8 pt-6">
                      <div
                        className="grid font-semibold text-white flex-1"
                        style={{
                          backgroundColor: styleConfig.primaryColor,
                          fontSize: fs(0.8),
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          fontWeight: styleConfig.fontWeight,
                          gridTemplateColumns: [
                            "2.4fr",
                            "0.9fr",
                            "0.7fr",
                            "0.9fr",
                            ...columns
                              .filter((c) => c.kind === "extra")
                              .map(() => "1fr"),
                          ].join(" "),
                          borderRadius: "9999px",
                          padding: "0.5rem 1.25rem",
                        }}
                      >
                        <span>Description</span>
                        <span className="text-center">Unit Price</span>
                        <span className="text-center">Qty</span>
                        <span className="text-right">Total</span>
                        {columns
                          .filter((c) => c.kind === "extra")
                          .map((col) => (
                            <div
                              key={col.id}
                              className="text-center"
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
                    <div className="px-8 pb-6 overflow-y-auto flex-1">
                      {rowsWithTotal.map((row) => (
                        <div
                          key={row.id}
                          className="grid border-b border-slate-700/60"
                          style={{
                            fontSize: fs(0.8),
                            color: "#334155",
                            gridTemplateColumns: [
                              "2.4fr",
                              "0.9fr",
                              "0.7fr",
                              "0.9fr",
                              ...columns
                                .filter((c) => c.kind === "extra")
                                .map(() => "1fr"),
                            ].join(" "),
                          }}
                        >
                          <div className="py-3 px-0">
                            <p style={{ fontWeight: fw(600) }}>{row.description}</p>
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
                          <span className="text-center py-3">
                            {currencySymbol}
                            {Number(row.unitPrice || "0").toFixed(2)}
                          </span>
                          <span className="text-center py-3">{row.qty}</span>
                          <span className="text-right py-3">
                            {currencySymbol}
                            {row.total}
                          </span>
                          {columns
                            .filter((c) => c.kind === "extra")
                            .map((col) => (
                              <div
                                key={col.id}
                                className="text-center py-3"
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
                    className="px-8 pb-6 flex justify-end h-full items-end"
                    style={{ fontSize: fs(0.8), color: "rgb(148 163 184)" }}
                  >
                    <div className="w-64 space-y-1">
                      <div className="flex justify-between">
                        <span>SUBTOTAL</span>
                        <span>{currencySymbol}
                        {subtotalStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{taxLabel}</span>
                        <span>{currencySymbol}
                        {totalTaxStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{discountLabel}</span>
                        <span>-{currencySymbol}
                        {discountStr}</span>
                      </div>
                      <div className="flex justify-between mt-1 border-t border-slate-700 pt-2">
                        <span
                          style={{
                            fontWeight: fw(600),
                            color: styleConfig.primaryColor,
                          }}
                        >
                          GRAND TOTAL
                        </span>
                        <span style={{ fontWeight: fw(600), color: styleConfig.primaryColor }}>
                          {currencySymbol}
                          {grandTotalStr}
                        </span>
                      </div>
                    </div>
                  </div>
                </Rnd>

                {/* Payment as Rnd */}
                <Rnd
                  bounds="parent"
                  enableResizing={layoutMode}
                  disableDragging={!layoutMode}
                  size={{
                    width: paymentLayout.width,
                    height: paymentLayout.height,
                  }}
                  position={{
                    x: paymentLayout.x - marginLeft,
                    y: paymentLayout.y,
                  }}
                  onDragStop={(_, d) =>
                    setPaymentLayout((prev) => ({
                      ...prev,
                      x: d.x + marginLeft,
                      y: d.y,
                    }))
                  }
                  onResizeStop={(_, __, ref, ___, pos) =>
                    setPaymentLayout({
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
                  <div className="px-8 pb-6 h-full flex items-center">
                    <div>
                      <p
                        style={{
                          fontSize: fs(0.8),
                          fontWeight: styleConfig.fontWeight,
                          color: styleConfig.primaryColor,
                        }}
                      >
                        Payment Method :
                      </p>
                      <p
                        style={{
                          fontSize: fs(0.8),
                          color: "rgb(148 163 184)",
                          marginTop: "0.25rem",
                        }}
                      >
                        {invoice.paymentMethod}
                      </p>
                    </div>
                  </div>
                </Rnd>

                {/* Footer as Rnd */}
                <Rnd
                  bounds="parent"
                  enableResizing={layoutMode}
                  disableDragging={!layoutMode}
                  size={{
                    width: footerLayout.width,
                    height: footerLayout.height,
                  }}
                  position={{
                    x: footerLayout.x - marginLeft,
                    y: footerLayout.y,
                  }}
                  onDragStop={(_, d) =>
                    setFooterLayout((prev) => ({
                      ...prev,
                      x: d.x + marginLeft,
                      y: d.y,
                    }))
                  }
                  onResizeStop={(_, __, ref, ___, pos) =>
                    setFooterLayout({
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
                    className="px-8 py-4 flex items-center justify-between h-full"
                    style={{
                      borderTop: "1px solid rgba(15,23,42,0.9)",
                      backgroundColor: "#000000",
                      fontSize: fs(0.75),
                      color: "rgb(148 163 184)",
                    }}
                  >
                    <span>{invoice.footerLeft}</span>
                    <span>{invoice.footerRight}</span>
                  </div>
                </Rnd>
              </div>
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
                Creative Bold
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
      title="Rezwan Invoice · Creative Bold"
      subtitle="Left: edit all text and table. Center: Creative Bold invoice (layout mode + PDF export). Right: brand, typography, logo & radius."
      left={extendedLeft}
      preview={preview}
      right={
        <RightSidebar styleConfig={styleConfig} onStyleChange={handleStyleChange} />
      }
    />
  );
}