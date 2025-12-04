"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Rnd } from "react-rnd";
import TemplateLayout from "../TemplateLayout";
import RightSidebar from "../RightSidebar";
import TopBar from "../TopBar";
import LeftSidebar from "../LeftSidebar";
function InlineEditable({ value, onChange, className = '', multiline = false, style = {} }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [value, editing]);
  const startEdit = () => {
    setEditing(true);
    // Focus after render
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const finishEdit = () => {
    setEditing(false);
    if (draft !== value) {
      onChange(draft);
    }
  };
  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      finishEdit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setDraft(value);
      setEditing(false);
    }
  };
  if (!editing) {
    return (
      <span
        className={className + ' cursor-text select-none'}
        style={style}
        onDoubleClick={startEdit}
      >
        {value || '\u00A0'} {/* Non-breaking space if empty */}
      </span>
    );
  }
  const editingStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#000000',
    padding: 0,
    margin: 0,
    font: 'inherit',
    lineHeight: 'inherit',
    caretColor: '#000000',
    outline: 'none',
    width: 'auto',
    minWidth: multiline ? '100%' : 'auto',
    display: multiline ? 'block' : 'inline-block',
    ...style,
  };
  if (multiline) {
    return (
      <textarea
        ref={inputRef}
        className={className}
        style={editingStyle}
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={finishEdit}
        onKeyDown={handleKeyDown}
        rows={Math.max(2, (draft.match(/\n/g) || []).length + 1)}
      />
    );
  }
  return (
    <input
      ref={inputRef}
      className={className}
      style={editingStyle}
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={finishEdit}
      onKeyDown={handleKeyDown}
    />
  );
}
function TemplateText({ templateKey, templates, setTemplates, previewMode, resolveTemplate, className = '', multiline = false, textColor }) {
  const rawValue = templates[templateKey] || '';
  const displayValue = previewMode === 'raw' ? rawValue : resolveTemplate(rawValue);
  return (
    <InlineEditable
      className={className}
      multiline={multiline}
      value={displayValue}
      onChange={(next) => setTemplates((prev) => ({ ...prev, [templateKey]: next, }))}
      style={{ color: textColor }}
    />
  );
}
function RowFieldText({ row, field, updateRowField, className = '', multiline = false, textColor }) {
  const value = row[field] || '';
  return (
    <InlineEditable
      className={className}
      multiline={multiline}
      value={value}
      onChange={(next) => updateRowField(row.id, field, next)}
      style={{ color: textColor }}
    />
  );
}
function RowExtraText({ row, colId, updateRowExtra, className = '', multiline = false, textColor }) {
  const value = row.extras?.[colId] || '';
  return (
    <InlineEditable
      className={className}
      multiline={multiline}
      value={value}
      onChange={(next) => updateRowExtra(row.id, colId, next)}
      style={{ color: textColor }}
    />
  );
}
const MAX_HISTORY = 30;
const defaultInvoice = {
  companyName: "Rezwan Studio",
  tagline: "Creative Invoice Template",
  billToName: "Global Enterprises LLC",
  billToAddress: "456 Corporate Blvd, New York, NY 10001",
  billToEmail: "billing@globalent.com",
  billToPhone: "+1 (555) 123-4567",
  invoiceNumber: "INV-2025-0001",
  currency: "USD",
  issueDate: "October 15, 2025",
  dueDate: "November 14, 2025",
  paymentTerms: "Net 30",
  taxRate: "10",
  discountPercent: "0",
  notes: "Thank you for choosing Rezwan Studio. Please make payment by the due date using the details below. For any questions about this invoice, reach out to billing@rezwanstudio.com.",
  rows: [
    {
      id: 1,
      description: "Website Development",
      details: "Corporate website redesign and development",
      qty: "1",
      unitPrice: "4500.00",
      extras: {},
    },
    {
      id: 2,
      description: "SEO Optimization",
      details: "Search engine optimization services",
      qty: "1",
      unitPrice: "1200.00",
      extras: {},
    },
    {
      id: 3,
      description: "Maintenance & Support",
      details: "3 months of website monitoring and support",
      qty: "1",
      unitPrice: "570.00",
      extras: {},
    },
  ],
};
const defaultTemplates = {
  headerCompany: "{companyName}",
  headerTagline: "{tagline}",
  headerInvoiceBadge: "INVOICE",
  headerInvoiceNumber: "{invoiceNumber}",
  billToLabel: "BILL TO",
  billToName: "{billToName}",
  billToAddress: "{billToAddress}",
  billToEmail: "{billToEmail}",
  billToPhone: "{billToPhone}",
  detailsLabel: "INVOICE DETAILS",
  issueDateLabel: "Issue Date",
  issueDate: "{issueDate}",
  dueDateLabel: "Due Date",
  dueDate: "{dueDate}",
  paymentTermsLabel: "Payment Terms",
  paymentTerms: "{paymentTerms}",
  currencyLabel: "Currency",
  currency: "{currency}",
  notesLabel: "NOTES",
  notes: "{notes}",
  subtotalLabel: "Subtotal",
  taxLabel: "Tax ({taxRate}%)",
  discountLabel: "Discount ({discountPercent}%)",
  totalDueLabel: "Total Due",
  paymentLabel: "PAYMENT INFO",
  paymentText: "Bank: Creative Bank · IBAN: XX00 1234 5678 9000 · SWIFT: CRVTUS00",
  paymentNote: "Please include invoice number in payment reference.",
  footerLeft: "{companyName} · rezwanstudio.com",
  footerRight: "Thank you for your business.",
};
const defaultColumns = [
  { id: "description", name: "Description", kind: "fixed" },
  { id: "qty", name: "Qty", kind: "fixed" },
  { id: "unitPrice", name: "Price", kind: "fixed" },
  { id: "total", name: "Amount", kind: "fixed" },
];
const defaultStyle = {
  primaryColor: "#f97316",
  accentColor: "#6366f1",
  fontFamily: "system",
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 22,
  logoSrc: "",
  logoSize: 40,
  showShadow: true,
  backgroundMode: "white",
  textColor: "#0f172a",
};
const defaultTemplateName = "Corporate";
const defaultDynamicElements = [];
const defaultHeaderLayout = {
  x: 40,
  y: 40,
  width: 720,
  height: 140,
};
const defaultBillToLayout = {
  x: 40,
  y: 200,
  width: 720,
  height: 220,
};
const defaultTableLayout = {
  x: 40,
  y: 420,
  width: 720,
  height: 300,
};
const defaultNotesTotalsLayout = {
  x: 40,
  y: 740,
  width: 720,
  height: 250,
};
const defaultFooterLayout = {
  x: 40,
  y: 960,
  width: 720,
  height: 60,
};
const defaultMergeFields = {
  all: [
    { label: "Customer Name", value: "{billToName}", category: "customer" },
    { label: "Customer Email", value: "{billToEmail}", category: "customer" },
    { label: "Customer Phone", value: "{billToPhone}", category: "customer" },
    { label: "Customer Address", value: "{billToAddress}", category: "customer" },
    { label: "Company Name", value: "{companyName}", category: "company" },
    { label: "Tagline", value: "{tagline}", category: "company" },
    { label: "Invoice #", value: "{invoiceNumber}", category: "financial" },
    { label: "Currency", value: "{currency}", category: "financial" },
    { label: "Subtotal", value: "{subtotal}", category: "financial" },
    { label: "Tax", value: "{tax}", category: "financial" },
    { label: "Discount", value: "{discount}", category: "financial" },
    { label: "Total Due", value: "{total}", category: "financial" },
    { label: "Issue Date", value: "{issueDate}", category: "dates" },
    { label: "Due Date", value: "{dueDate}", category: "dates" },
    { label: "Payment Terms", value: "{paymentTerms}", category: "dates" },
    { label: "Notes", value: "{notes}", category: "financial" },
  ],
  customer: [
    { label: "Customer Name", value: "{billToName}" },
    { label: "Customer Email", value: "{billToEmail}" },
    { label: "Customer Phone", value: "{billToPhone}" },
    { label: "Customer Address", value: "{billToAddress}" },
  ],
  company: [
    { label: "Company Name", value: "{companyName}" },
    { label: "Tagline", value: "{tagline}" },
  ],
  financial: [
    { label: "Invoice #", value: "{invoiceNumber}" },
    { label: "Currency", value: "{currency}" },
    { label: "Subtotal", value: "{subtotal}" },
    { label: "Tax", value: "{tax}" },
    { label: "Discount", value: "{discount}" },
    { label: "Total Due", value: "{total}" },
    { label: "Notes", value: "{notes}" },
  ],
  dates: [
    { label: "Issue Date", value: "{issueDate}" },
    { label: "Due Date", value: "{dueDate}" },
    { label: "Payment Terms", value: "{paymentTerms}" },
  ],
};
const defaultDataFields = [
  { label: "Company Name", value: "{companyName}", field: "companyName" },
  { label: "Tagline", value: "{tagline}", field: "tagline" },
  { label: "Bill To Name", value: "{billToName}", field: "billToName" },
  { label: "Bill To Address", value: "{billToAddress}", field: "billToAddress" },
  { label: "Bill To Email", value: "{billToEmail}", field: "billToEmail" },
  { label: "Bill To Phone", value: "{billToPhone}", field: "billToPhone" },
  { label: "Invoice Number", value: "{invoiceNumber}", field: "invoiceNumber" },
  { label: "Issue Date", value: "{issueDate}", field: "issueDate" },
  { label: "Due Date", value: "{dueDate}", field: "dueDate" },
  { label: "Payment Terms", value: "{paymentTerms}", field: "paymentTerms" },
  { label: "Currency", value: "{currency}", field: "currency" },
  { label: "Tax Rate", value: "{taxRate}", field: "taxRate" },
  { label: "Discount Percent", value: "{discountPercent}", field: "discountPercent" },
  { label: "Notes", value: "{notes}", field: "notes" },
];
const rgba = (hex, opacity) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
export default function CorporatePage() {
  // --------- CORE STATE ----------
  const [invoice, setInvoice] = useState(defaultInvoice);
  const [templates, setTemplates] = useState(defaultTemplates);
  const [dynamicElements, setDynamicElements] = useState(defaultDynamicElements);
  const [activeTab, setActiveTab] = useState("all");
  const [columns, setColumns] = useState(defaultColumns);
  const [style, setStyle] = useState(defaultStyle);
  const [templateName, setTemplateName] = useState(defaultTemplateName);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [layoutMode, setLayoutMode] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [mergeFields, setMergeFields] = useState(defaultMergeFields);
  const [dataFields, setDataFields] = useState(defaultDataFields);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showTableEditModal, setShowTableEditModal] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState(null);
  // Layout state (page coordinate system, px)
  const [headerLayout, setHeaderLayout] = useState(defaultHeaderLayout);
  const [billToLayout, setBillToLayout] = useState(defaultBillToLayout);
  const [tableLayout, setTableLayout] = useState(defaultTableLayout);
  const [notesTotalsLayout, setNotesTotalsLayout] = useState(defaultNotesTotalsLayout);
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
    const savedKey = "corporateLayout";
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
        templates: loaded.templates || defaultTemplates,
        dynamicElements: loaded.dynamicElements || defaultDynamicElements,
        columns: loaded.columns || defaultColumns,
        style: loaded.style || defaultStyle,
        templateName: loaded.templateName || defaultTemplateName,
        headerLayout: loaded.headerLayout || defaultHeaderLayout,
        billToLayout: loaded.billToLayout || defaultBillToLayout,
        tableLayout: loaded.tableLayout || defaultTableLayout,
        notesTotalsLayout: loaded.notesTotalsLayout || defaultNotesTotalsLayout,
        footerLayout: loaded.footerLayout || defaultFooterLayout,
      };
      setInvoice(fullLoaded.invoice);
      setTemplates(fullLoaded.templates);
      setDynamicElements(fullLoaded.dynamicElements);
      setColumns(fullLoaded.columns);
      setStyle(fullLoaded.style);
      setTemplateName(fullLoaded.templateName);
      setHeaderLayout(fullLoaded.headerLayout);
      setBillToLayout(fullLoaded.billToLayout);
      setTableLayout(fullLoaded.tableLayout);
      setNotesTotalsLayout(fullLoaded.notesTotalsLayout);
      setFooterLayout(fullLoaded.footerLayout);
      snapshot = fullLoaded;
      isInitialLoadRef.current = true;
    } else {
      snapshot = {
        invoice,
        templates: defaultTemplates,
        dynamicElements: defaultDynamicElements,
        columns,
        style,
        templateName,
        headerLayout,
        billToLayout,
        tableLayout,
        notesTotalsLayout,
        footerLayout,
      };
      try {
        localStorage.setItem("corporateLayout", JSON.stringify(snapshot));
      } catch (err) {
        if (err && (err.name === "QuotaExceededError" || err.code === 22)) {
          console.warn("Initial save skipped: quota exceeded");
        } else {
          console.error("Failed to save initial layout:", err);
        }
      }
    }
    setHistory([JSON.parse(JSON.stringify(snapshot))]);
    setCurrentIndex(0);
    prevFontSizeRef.current = loaded ? (snapshot.style.fontSize || 12) : style.fontSize;
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
    setTableLayout((prev) => ({
      x: Math.round(prev.x * scale),
      y: Math.round(prev.y * scale),
      width: Math.round(prev.width * scale),
      height: Math.round(prev.height * scale),
    }));
    setNotesTotalsLayout((prev) => ({
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
    setDynamicElements((prev) =>
      prev.map((el) => ({
        ...el,
        x: Math.round(el.x * scale),
        y: Math.round(el.y * scale),
        width: Math.round(el.width * scale),
        height: Math.round(el.height * scale),
        fontSize: Math.round(el.fontSize * scale),
      }))
    );
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
    // No more stripping of image src
    const snapshot = JSON.parse(
      JSON.stringify({
        invoice,
        templates,
        dynamicElements, // keep images with src so they persist
        columns,
        style,
        templateName,
        headerLayout,
        billToLayout,
        tableLayout,
        notesTotalsLayout,
        footerLayout,
      })
    );
    setHistory((prevHistory) => {
      let newHistory = [...prevHistory];
      if (newHistory.length > currentIndex + 1) {
        newHistory = newHistory.slice(0, currentIndex + 1);
      }
      newHistory.push(snapshot);
      if (newHistory.length > MAX_HISTORY) {
        newHistory = newHistory.slice(newHistory.length - MAX_HISTORY);
      }
      return newHistory;
    });
    setCurrentIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
    if (typeof window !== "undefined") {
      try {
        const json = JSON.stringify(snapshot);
        // Always try to save, no manual size limit
        localStorage.setItem("corporateLayout", json);
      } catch (err) {
        if (err && (err.name === "QuotaExceededError" || err.code === 22)) {
          // Browser storage is full – layout still works in memory,
          // but this particular state will not persist after reload
          console.warn("Skipping save to localStorage: quota exceeded");
        } else {
          console.error("Failed to save to localStorage", err);
        }
      }
    }
  }, [
    invoice,
    templates,
    dynamicElements,
    columns,
    style,
    templateName,
    headerLayout,
    billToLayout,
    tableLayout,
    notesTotalsLayout,
    footerLayout,
  ]);
  const handleUndo = () => {
    if (currentIndex <= 0 || history.length === 0) return;
    isRestoringRef.current = true;
    const prevIndex = currentIndex - 1;
    const prevSnapshot = history[prevIndex];
    setCurrentIndex(prevIndex);
    setInvoice(prevSnapshot.invoice);
    setTemplates(prevSnapshot.templates);
    setDynamicElements(prevSnapshot.dynamicElements);
    setColumns(prevSnapshot.columns);
    setStyle(prevSnapshot.style);
    prevFontSizeRef.current = prevSnapshot.style.fontSize;
    setTemplateName(prevSnapshot.templateName);
    setHeaderLayout(prevSnapshot.headerLayout);
    setBillToLayout(prevSnapshot.billToLayout);
    setTableLayout(prevSnapshot.tableLayout);
    setNotesTotalsLayout(prevSnapshot.notesTotalsLayout);
    setFooterLayout(prevSnapshot.footerLayout);
  };
  const handleRedo = () => {
    if (currentIndex >= history.length - 1 || history.length === 0) return;
    isRestoringRef.current = true;
    const nextIndex = currentIndex + 1;
    const nextSnapshot = history[nextIndex];
    setCurrentIndex(nextIndex);
    setInvoice(nextSnapshot.invoice);
    setTemplates(nextSnapshot.templates);
    setDynamicElements(nextSnapshot.dynamicElements);
    setColumns(nextSnapshot.columns);
    setStyle(nextSnapshot.style);
    prevFontSizeRef.current = nextSnapshot.style.fontSize;
    setTemplateName(nextSnapshot.templateName);
    setHeaderLayout(nextSnapshot.headerLayout);
    setBillToLayout(nextSnapshot.billToLayout);
    setTableLayout(nextSnapshot.tableLayout);
    setNotesTotalsLayout(nextSnapshot.notesTotalsLayout);
    setFooterLayout(nextSnapshot.footerLayout);
  };
  const updateDynamicElement = (id, updates) => {
    setDynamicElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
    // Clear selection if updating a different block
    if (selectedBlock?.id === id) {
      setSelectedBlock(prev => ({ ...prev, ...updates }));
    }
  };
  const deleteDynamicElement = (id) => {
    setDynamicElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedBlock?.id === id) {
      setSelectedBlock(null);
    }
  };
  const onBlockStyleChange = (field, value) => {
    if (selectedBlock) {
      updateDynamicElement(selectedBlock.id, { [field]: value });
    }
  };
  const handleBlockSelect = (el) => {
    setSelectedBlock({
      id: el.id,
      blockType: el.blockType || 'text',
      bgColor: el.bgColor || '#ffffff',
      textColor: el.textColor || style.textColor || '#0f172a',
      borderColor: el.borderColor || '#e5e7eb',
    });
  };
  // --------- HELPERS ----------
  const handleFieldChange = (field, value) =>
    setInvoice((prev) => ({ ...prev, [field]: value }));
  const handleStyleChange = (field, value) =>
    setStyle((prev) => ({ ...prev, [field]: value }));
  const handleInsertField = (e, key) => {
    e.preventDefault();
    const fieldValue = e.dataTransfer.getData("text/plain");
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const newValue =
      value.substring(0, start) + fieldValue + value.substring(end);
    setTemplates((prev) => ({ ...prev, [key]: newValue }));
    textarea.focus();
    textarea.setSelectionRange(
      start + fieldValue.length,
      start + fieldValue.length
    );
  };
  const handleDropToTemplate = (templateKey, e) => {
    e.preventDefault();
    const fieldValue = e.dataTransfer.getData("text/plain");
    setTemplates((prev) => ({
      ...prev,
      [templateKey]: prev[templateKey] + " " + fieldValue,
    }));
  };
  const handlePreviewDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // 1) Blocks from RightSidebar (Button, Image, Link, Table, etc.)
    if (data.startsWith("BLOCK::")) {
      const type = data.replace("BLOCK::", "");
      const id = Date.now();
      // IMAGE: ask for file upload
      if (type === "image") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result;
            if (!src) return;
            setDynamicElements((prev) => [
              ...prev,
              {
                id,
                x,
                y,
                width: 220,
                height: 140,
                blockType: "image",
                src,
              },
            ]);
          };
          reader.readAsDataURL(file);
        };
        input.click();
        return;
      }
      // LINK / LINK BLOCK: ask for URL + label
      if (type === "link" || type === "link-block") {
        const href = window.prompt("Paste link URL");
        if (!href) return;
        const label = window.prompt("Link text", href) || href;
        setDynamicElements((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            width: 220,
            height: 32,
            blockType: type,
            href,
            content: label,
            fontSize: baseSize,
          },
        ]);
        return;
      }
      // TEXT / TEXT SECTION: editable text box
      if (type === "text" || type === "text-section") {
        setDynamicElements((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            width: type === "text-section" ? 260 : 200,
            height: type === "text-section" ? 80 : 32,
            blockType: "text",
            content: "Double-click to edit",
            fontSize: baseSize,
          },
        ]);
        return;
      }
      // TABLE / GRID: simple rows/cols config
      if (type === "table" || type === "grid") {
        const rows = Number(window.prompt("Number of rows?", "3") || "0");
        const cols = Number(window.prompt("Number of columns?", "3") || "0");
        if (!rows || !cols) return;
        setDynamicElements((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            width: 320,
            height: 140,
            blockType: "table",
            rows,
            cols,
          },
        ]);
        return;
      }
      // BUTTON
      if (type === "button") {
        setDynamicElements((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            width: 160,
            height: 36,
            blockType: "button",
            content: "Button",
          },
        ]);
        return;
      }
      // DIVIDER
      if (type === "divider") {
        setDynamicElements((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            width: 260,
            height: 16,
            blockType: "divider",
          },
        ]);
        return;
      }
      // QUOTE
      if (type === "quote") {
        setDynamicElements((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            width: 260,
            height: 80,
            blockType: "quote",
            content: "Quote text...",
            fontSize: baseSize,
          },
        ]);
        return;
      }
      // Unknown block type – just exit
      return;
    }
    // Ignore drags of existing images/content that give data:image/... text
    if (data.startsWith("data:image")) {
      return;
    }
    // 2) Fallback: existing merge / text behavior
    const isMerge = data.startsWith("{") && data.endsWith("}");
    const newId = Date.now();
    setDynamicElements((prev) => [
      ...prev,
      {
        id: newId,
        x,
        y,
        width: 200,
        height: 30,
        content: data,
        fontSize: baseSize,
        isMerge,
      },
    ]);
  };
  const fontFamilyValue = useMemo(() => {
    if (style.fontFamily === "serif") {
      return "ui-serif, Georgia, 'Times New Roman', serif";
    }
    if (style.fontFamily === "mono") {
      return "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    }
    return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }, [style.fontFamily]);
  const baseSize = style.fontSize;
  const sizeFactor = baseSize / 12;
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
  const taxRatePct = Number(invoice.taxRate || "0") / 100;
  const totalTax = subtotalLess * taxRatePct;
  const grandTotal = subtotalLess + totalTax;
  const subtotalStr = subtotal.toFixed(2);
  const discountStr = discountAmt.toFixed(2);
  const totalTaxStr = totalTax.toFixed(2);
  const grandTotalStr = grandTotal.toFixed(2);
  const currencySymbol = invoice.currency === "USD" ? "$" : invoice.currency;
  const fullData = useMemo(() => ({
    ...invoice,
    currencySymbol,
    subtotal: subtotalStr,
    tax: totalTaxStr,
    discount: discountStr,
    total: grandTotalStr,
  }), [invoice, currencySymbol, subtotalStr, totalTaxStr, discountStr, grandTotalStr]);
  const resolveTemplate = useMemo(() => (template, data = fullData) => {
    if (!template) return "";
    return template.replace(/{([^}]+)}/g, (match, key) => data[key] || match);
  }, [fullData]);
  const previewMode = layoutMode ? 'raw' : 'resolved';
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
    setNotesTotalsLayout((prev) => ({ ...prev, y: prev.y + delta }));
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
  const updateColumnName = (colId, newName) => {
    if (!newName.trim()) return;
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, name: newName.trim() } : c));
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
  const openTableEdit = () => {
    setShowTableEditModal(true);
  };
  const closeTableEdit = () => {
    setShowTableEditModal(false);
    setEditingColumnId(null);
  };
  // --------- TOP BAR ACTIONS ----------
  const handleAddRowTop = () => addRow();
  const handleAddColumnTop = () => addColumn();
  const handleDeleteTableTop = () => deleteTable();
  const handleOpenTemplates = () => {
    // Placeholder for templates modal if needed
  };
  const handleToggleLayoutMode = () => {
    setLayoutMode((prev) => !prev);
  };
  const handleExportPDF = async () => {
    if (typeof window === "undefined") return;
    // Temp hide UI (optional – renderer doesn't capture DOM)
    let needsRestore = false;
    if (layoutMode) {
      setLayoutMode(false);
      needsRestore = true;
    }
    setHideUI(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // Re-render if needed
    try {
      // Duplicate calculations for PDF closure
      const rowsWithTotalPDF = invoice.rows.map((row) => {
        const q = Number(row.qty || "0");
        const up = Number(row.unitPrice || "0");
        return { ...row, total: (q * up).toFixed(2) };
      });
      const subtotalPDF = rowsWithTotalPDF.reduce(
        (sum, r) => sum + Number(r.total || "0"),
        0
      );
      const discountPctPDF = Number(invoice.discountPercent || "0");
      const discountAmtPDF = (subtotalPDF * discountPctPDF) / 100;
      const subtotalLessPDF = subtotalPDF - discountAmtPDF;
      const taxRatePctPDF = Number(invoice.taxRate || "0") / 100;
      const totalTaxPDF = subtotalLessPDF * taxRatePctPDF;
      const grandTotalPDF = subtotalLessPDF + totalTaxPDF;
      const subtotalStrPDF = subtotalPDF.toFixed(2);
      const discountStrPDF = discountAmtPDF.toFixed(2);
      const totalTaxStrPDF = totalTaxPDF.toFixed(2);
      const grandTotalStrPDF = grandTotalPDF.toFixed(2);
      const currencySymbolPDF = invoice.currency === "USD" ? "$" : invoice.currency;
      const fullDataPDF = {
        ...invoice,
        currencySymbol: currencySymbolPDF,
        subtotal: subtotalStrPDF,
        tax: totalTaxStrPDF,
        discount: discountStrPDF,
        total: grandTotalStrPDF,
      };
      const resolveTemplatePDF = (template, data = fullDataPDF) => {
        if (!template) return "";
        return template.replace(/{([^}]+)}/g, (match, key) => data[key] || match);
      };
      const baseSize = style.fontSize;
      const sf = baseSize / 12;
      // Define PDF styles (mirrors your preview: light theme, orange/indigo accents)
      const styles = StyleSheet.create({
        page: {
          backgroundColor: '#ffffff', // Light theme BG
          fontFamily: style.fontFamily === 'serif' ? 'Times-Roman' : style.fontFamily === 'mono' ? 'Courier' : 'Helvetica',
          fontSize: baseSize,
          padding: `${40 * sf}pt`,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: `${32 * sf}pt ${32 * sf}pt 0 ${32 * sf}pt`,
          backgroundColor: '#0f172a', // slate-900
          color: style.textColor,
        },
        logo: { width: style.logoSize, height: style.logoSize, borderRadius: style.borderRadius / 2 },
        company: {
          flexDirection: 'column',
          rowGap: 2 * sf,
          leading: '1',
        },
        companyName: { fontSize: baseSize * 0.875, fontWeight: style.fontWeight, letterSpacing: -0.025, color: style.textColor },
        tagline: { fontSize: baseSize * 0.917, color: '#cbd5e1' }, // slate-300
        invoiceBadge: {
          fontSize: baseSize * 0.75,
          letterSpacing: 0.16,
          color: '#94a3b8', // slate-400
          textTransform: 'uppercase',
        },
        invoiceNum: { fontSize: baseSize * 1.125, fontWeight: style.fontWeight, marginTop: 4 * sf, color: style.textColor },
        headerBand: {
          height: `${6 * sf}pt`, // h-1.5 scaled
          backgroundColor: style.primaryColor, // Gradient sim
        },
        billToGrid: {
          flexDirection: 'row',
          columnGap: `${24 * sf}pt`,
          padding: `${24 * sf}pt ${32 * sf}pt ${24 * sf}pt ${32 * sf}pt`, // py-6 px-8
          marginTop: `${20 * sf}pt`,
        },
        billToBox: {
          borderWidth: 1,
          borderColor: '#e2e8f0', // slate-200
          borderRadius: `${12 * sf}pt`,
          padding: `${16 * sf}pt`,
        },
        billToLabel: {
          fontSize: baseSize * 0.917,
          fontWeight: style.fontWeight,
          letterSpacing: 0.18,
          color: style.textColor,
          textTransform: 'uppercase',
          marginBottom: `${8 * sf}pt`,
        },
        billToName: { fontSize: baseSize * 0.875, fontWeight: style.fontWeight, color: style.textColor, marginTop: `${8 * sf}pt` },
        billToDetail: { fontSize: baseSize * 0.917, color: style.textColor, leading: 1.25 }, // slate-600
        detailsBox: {
          borderWidth: 1,
          borderColor: rgba(style.accentColor, 0.2),
          backgroundColor: rgba(style.accentColor, 0.06),
          borderRadius: `${12 * sf}pt`,
          padding: `${16 * sf}pt`,
        },
        detailsLabel: {
          fontSize: baseSize * 0.917,
          fontWeight: style.fontWeight,
          letterSpacing: 0.18,
          color: style.accentColor,
          textTransform: 'uppercase',
          marginBottom: `${12 * sf}pt`,
        },
        detailsGrid: {
          flexDirection: 'column',
          rowGap: `${4 * sf}pt`,
          fontSize: baseSize * 0.917,
        },
        detailsKey: { color: style.textColor }, // slate-500
        detailsValue: { textAlign: 'right', color: style.textColor }, // slate-800
        detailsDue: { color: style.primaryColor, fontWeight: style.fontWeight },
        table: {
          paddingBottom: `${24 * sf}pt`,
          marginTop: `${20 * sf}pt`,
        },
        tableHeader: {
          flexDirection: 'row',
          backgroundColor: '#0f172a', // slate-900
          borderRadius: `${8 * sf}pt`,
          padding: `${0.125 * baseSize}pt ${0.25 * baseSize}pt`,
          marginBottom: `${16 * sf}pt`,
          fontSize: baseSize * 0.875,
          fontWeight: style.fontWeight,
          letterSpacing: 0.14,
          textTransform: 'uppercase',
          color: style.textColor,
        },
        headerColDesc: { flex: 2.3 },
        headerColQty: { flex: 0.6, textAlign: 'center' },
        headerColPrice: { flex: 0.9, textAlign: 'right' },
        headerColTotal: { flex: 0.9, textAlign: 'right' },
        tableRow: {
          flexDirection: 'row',
          padding: `${0.75 * baseSize}pt ${baseSize}pt`,
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0', // slate-200
          fontSize: baseSize * 0.875,
          color: style.textColor,
        },
        rowFirst: { backgroundColor: 'white' },
        rowAlt: { backgroundColor: '#f8fafc' }, // slate-50
        rowDesc: {
          flex: 2.3,
          flexDirection: 'column',
        },
        rowDescTitle: { fontSize: baseSize * 1, fontWeight: fw(600), color: style.textColor },
        rowDescDetail: { fontSize: baseSize * 0.875, color: style.textColor }, // slate-500
        rowQty: { flex: 0.6, textAlign: 'center', color: style.textColor },
        rowPrice: { flex: 0.9, textAlign: 'right', color: style.textColor },
        rowTotal: { flex: 0.9, textAlign: 'right', fontWeight: 500, color: style.textColor },
        notesTotals: {
          flexDirection: 'row',
          columnGap: `${16 * sf}pt`,
          paddingBottom: `${32 * sf}pt`,
          marginTop: `${20 * sf}pt`,
        },
        notesBox: {
          flex: 1,
          borderWidth: 1,
          borderColor: rgba(style.primaryColor, 0.2),
          backgroundColor: rgba(style.primaryColor, 0.06),
          borderRadius: `${12 * sf}pt`,
          padding: `${16 * sf}pt`,
        },
        notesLabel: {
          fontSize: baseSize * 0.917,
          fontWeight: style.fontWeight,
          letterSpacing: 0.18,
          color: style.primaryColor,
          textTransform: 'uppercase',
          marginBottom: `${8 * sf}pt`,
        },
        notesText: { fontSize: baseSize * 0.917, color: style.textColor, leading: 1.25 }, // slate-700
        totalsBox: {
          flex: 1,
          flexDirection: 'column',
          rowGap: `${16 * sf}pt`,
        },
        subtotalBox: {
          borderWidth: 1,
          borderColor: '#e2e8f0', // slate-200
          borderRadius: `${12 * sf}pt`,
          padding: `${16 * sf}pt`,
          backgroundColor: '#f8fafc', // slate-50
          fontSize: baseSize * 0.917,
          color: style.textColor,
        },
        subtotalLine: { flexDirection: 'row', justifyContent: 'space-between', marginTop: `${4 * sf}pt` },
        grandLine: {
          marginTop: `${12 * sf}pt`,
          paddingTop: `${12 * sf}pt`,
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        grandLabel: { fontSize: baseSize * 0.875, fontWeight: 600, color: style.textColor },
        grandValue: { fontSize: baseSize * 1.125, fontWeight: 700, color: style.primaryColor },
        paymentInfo: {
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: `${12 * sf}pt`,
          padding: `${16 * sf}pt`,
          backgroundColor: '#0f172a', // slate-900
          color: style.textColor,
          fontSize: baseSize * 0.917,
        },
        paymentLabel: { fontWeight: style.fontWeight, letterSpacing: 0.18, color: style.textColor }, // slate-300
        paymentText: { marginTop: `${8 * sf}pt`, color: style.textColor },
        paymentNote: { marginTop: `${4 * sf}pt`, color: style.textColor }, // slate-300
        footer: {
          marginTop: `${20 * sf}pt`,
        },
        footerBand: {
          height: `${6 * sf}pt`,
          backgroundColor: style.accentColor, // Gradient sim
        },
        footerText: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${16 * sf}pt ${32 * sf}pt`, // py-4 px-8
          backgroundColor: '#0f172a', // slate-900
          color: style.textColor,
          fontSize: baseSize * 0.917,
          rowGap: `${8 * sf}pt`,
        },
      });
      // PDF Component (mirrors your preview JSX)
      const InvoicePDF = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flexDirection: 'row', columnGap: `${12 * sf}pt`, alignItems: 'center' }}>
                {style.logoSrc ? (
                  <Image style={styles.logo} src={style.logoSrc} />
                ) : (
                  <View style={{
                    width: style.logoSize,
                    height: style.logoSize,
                    borderRadius: style.borderRadius / 2,
                    backgroundColor: style.primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: 'rgba(0,0,0,0.35)',
                    shadowOffset: { width: 0, height: 10 * sf },
                    shadowRadius: `${25 * sf}pt`,
                  }}>
                    {/* Placeholder logo – empty for sim */}
                  </View>
                )}
                <View style={styles.company}>
                  <Text style={styles.companyName}>{resolveTemplatePDF(templates.headerCompany)}</Text>
                  <Text style={styles.tagline}>{resolveTemplatePDF(templates.headerTagline)}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.invoiceBadge}>{resolveTemplatePDF(templates.headerInvoiceBadge)}</Text>
                <Text style={styles.invoiceNum}>{resolveTemplatePDF(templates.headerInvoiceNumber)}</Text>
              </View>
            </View>
            <View style={styles.headerBand} />
            {/* Bill To / Details */}
            <View style={styles.billToGrid}>
              <View style={styles.billToBox}>
                <Text style={styles.billToLabel}>{resolveTemplatePDF(templates.billToLabel)}</Text>
                <Text style={styles.billToName}>{resolveTemplatePDF(templates.billToName)}</Text>
                <Text style={styles.billToDetail}>{resolveTemplatePDF(templates.billToAddress)}</Text>
                <Text style={styles.billToDetail}>{resolveTemplatePDF(templates.billToEmail)}</Text>
                <Text style={styles.billToDetail}>{resolveTemplatePDF(templates.billToPhone)}</Text>
              </View>
              <View style={styles.detailsBox}>
                <Text style={styles.detailsLabel}>{resolveTemplatePDF(templates.detailsLabel)}</Text>
                <View style={styles.detailsGrid}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.detailsKey}>{resolveTemplatePDF(templates.issueDateLabel)}</Text>
                    <Text style={styles.detailsValue}>{resolveTemplatePDF(templates.issueDate)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.detailsKey}>{resolveTemplatePDF(templates.dueDateLabel)}</Text>
                    <Text style={[styles.detailsValue, styles.detailsDue]}>{resolveTemplatePDF(templates.dueDate)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.detailsKey}>{resolveTemplatePDF(templates.paymentTermsLabel)}</Text>
                    <Text style={styles.detailsValue}>{resolveTemplatePDF(templates.paymentTerms)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.detailsKey}>{resolveTemplatePDF(templates.currencyLabel)}</Text>
                    <Text style={styles.detailsValue}>{resolveTemplatePDF(templates.currency)}</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.headerColDesc}>Description</Text>
                  <Text style={styles.headerColQty}>Qty</Text>
                  <Text style={styles.headerColPrice}>Price</Text>
                  <Text style={styles.headerColTotal}>Amount</Text>
                  {columns.filter(c => c.kind === 'extra').map(col => (
                    <Text key={col.id} style={{ flex: 1, textAlign: 'center', color: style.textColor }}>{col.name}</Text>
                  ))}
                </View>
              </View>
              {rowsWithTotalPDF.map((row, index) => (
                <View key={row.id} style={[styles.tableRow, index === 0 ? styles.rowFirst : index % 2 === 1 ? styles.rowAlt : null]}>
                  <View style={styles.rowDesc}>
                    <Text style={styles.rowDescTitle}>{row.description}</Text>
                    <Text style={styles.rowDescDetail}>{row.details}</Text>
                  </View>
                  <Text style={styles.rowQty}>{row.qty}</Text>
                  <Text style={styles.rowPrice}>{currencySymbolPDF}{Number(row.unitPrice).toFixed(2)}</Text>
                  <Text style={styles.rowTotal}>{currencySymbolPDF}{row.total}</Text>
                  {columns.filter(c => c.kind === 'extra').map(col => (
                    <Text key={col.id} style={{ flex: 1, textAlign: 'center', color: style.textColor }}>{row.extras?.[col.id] ?? ''}</Text>
                  ))}
                </View>
              ))}
            </View>
            {/* Notes / Totals */}
            <View style={styles.notesTotals}>
              <View style={styles.notesBox}>
                <Text style={styles.notesLabel}>{resolveTemplatePDF(templates.notesLabel)}</Text>
                <Text style={styles.notesText}>{resolveTemplatePDF(templates.notes)}</Text>
              </View>
              <View style={styles.totalsBox}>
                <View style={styles.subtotalBox}>
                  <View style={[styles.subtotalLine, { marginTop: 0 }]}><Text style={{ color: style.textColor }}>{resolveTemplatePDF(templates.subtotalLabel)}</Text><Text style={{ color: style.textColor }}>{currencySymbolPDF}{subtotalStrPDF}</Text></View>
                  <View style={styles.subtotalLine}><Text style={{ color: style.textColor }}>{resolveTemplatePDF(templates.taxLabel)}</Text><Text style={{ color: style.textColor }}>{currencySymbolPDF}{totalTaxStrPDF}</Text></View>
                  <View style={styles.subtotalLine}><Text style={{ color: style.textColor }}>{resolveTemplatePDF(templates.discountLabel)}</Text><Text style={{ color: style.textColor }}>-{currencySymbolPDF}{discountStrPDF}</Text></View>
                  <View style={styles.grandLine}>
                    <Text style={styles.grandLabel}>{resolveTemplatePDF(templates.totalDueLabel)}</Text>
                    <Text style={styles.grandValue}>{currencySymbolPDF}{grandTotalStrPDF}</Text>
                  </View>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentLabel}>{resolveTemplatePDF(templates.paymentLabel)}</Text>
                  <Text style={styles.paymentText}>{resolveTemplatePDF(templates.paymentText)}</Text>
                  <Text style={styles.paymentNote}>{resolveTemplatePDF(templates.paymentNote)}</Text>
                </View>
              </View>
            </View>
            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerBand} />
              <View style={styles.footerText}>
                <Text style={{ color: style.textColor }}>{resolveTemplatePDF(templates.footerLeft)}</Text>
                <Text style={{ color: style.textColor }}>{resolveTemplatePDF(templates.footerRight)}</Text>
              </View>
            </View>
          </Page>
        </Document>
      );
      // Generate & Download
      const blob = await pdf(<InvoicePDF />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateName}_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      alert("PDF exported successfully!");
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert(`Export failed: ${err.message}. Check console for details.`);
    } finally {
      setHideUI(false);
      if (needsRestore) setLayoutMode(true);
    }
  };
  // --------- LEFT CONTENT ----------
  const currentFields = mergeFields[activeTab] || mergeFields.all;
  // Calculate dynamic dimensions
  const marginLeft = 32 * sizeFactor;
  const marginRight = 32 * sizeFactor;
  const maxRight = Math.max(
    headerLayout.x + headerLayout.width,
    billToLayout.x + billToLayout.width,
    tableLayout.x + tableLayout.width,
    notesTotalsLayout.x + notesTotalsLayout.width,
    footerLayout.x + footerLayout.width
  );
  const containerWidth = Math.max(900 * sizeFactor, maxRight + marginRight);
  const maxY = Math.max(
    headerLayout.y + headerLayout.height,
    billToLayout.y + billToLayout.height,
    tableLayout.y + tableLayout.height,
    notesTotalsLayout.y + notesTotalsLayout.height,
    footerLayout.y + footerLayout.height
  );
  const dynamicMinHeight = Math.max(900 * sizeFactor, maxY + marginRight);
  const outerPadding = Math.round(3 * sizeFactor);
  const outerBorderRadius = style.borderRadius + Math.round(4 * sizeFactor);
  const previewRootStyle = {
    "--primary-color": style.primaryColor,
    "--accent-color": style.accentColor,
    fontFamily: fontFamilyValue,
    fontSize: `${baseSize}px`,
    backgroundColor: "transparent",
    color: style.textColor,
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
      <main className="bg-slate-950 text-slate-50 flex-1 overflow-auto px-4 py-10 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl bg-slate-900/10">
            <div
              ref={invoiceRef}
              className="p-[3px] shadow-2xl mx-auto my-0 rounded-3xl"
              style={{
                backgroundImage: `linear-gradient(135deg, ${style.primaryColor}, ${style.accentColor})`,
                borderRadius: `${outerBorderRadius}px`,
                boxShadow: style.showShadow
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  : "none",
                ...previewRootStyle,
              }}
            >
              <div
                className="relative bg-white overflow-hidden"
                style={{
                  borderRadius: `${style.borderRadius}px`,
                  width: `${containerWidth}px`,
                  minHeight: `${dynamicMinHeight}px`,
                  ...previewRootStyle,
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handlePreviewDrop}
              >
                {/* Dynamic Elements */}
                {dynamicElements.map((el) => (
                  <Rnd
                    key={el.id}
                    bounds="parent"
                    enableResizing={layoutMode}
                    disableDragging={!layoutMode}
                    size={{ width: el.width, height: el.height }}
                    position={{ x: el.x, y: el.y }}
                    onDragStop={(_, d) => updateDynamicElement(el.id, { x: d.x, y: d.y })}
                    onResizeStop={(_, __, ref, ___, pos) =>
                      updateDynamicElement(el.id, {
                        x: pos.x,
                        y: pos.y,
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                      })
                    }
                    onClick={() => layoutMode && handleBlockSelect(el)}
                    style={{
                      border: layoutMode ? "1px dashed #38bdf8" : "none",
                      borderRadius: 4,
                      backgroundColor: layoutMode ? "#0f172a0d" : "transparent",
                    }}
                  >
                    <div
                      className="w-full h-full bg-transparent border border-slate-200 rounded overflow-hidden flex items-center justify-center"
                      style={{
                        backgroundColor: el.bgColor || 'transparent',
                        borderColor: el.borderColor || 'transparent',
                      }}
                    >
                      {el.blockType === "image" && el.src ? (
                        // IMAGE
                        <img src={el.src} alt="" className="w-full h-full object-contain" />
                      ) : el.blockType === "table" || el.blockType === "grid" ? (
                        // TABLE / GRID – styled like items table
                        <div className="w-full h-full px-2 py-2 flex flex-col">
                          {/* header + edit icon (same vibe as main table) */}
                          <div className="flex items-stretch justify-between">
                            <div
                              className="grid font-semibold text-slate-100 flex-1"
                              style={{
                                backgroundColor: "#0f172a", // slate-900
                                fontSize: fs(0.6875),
                                textTransform: "uppercase",
                                letterSpacing: "0.14em",
                                fontWeight: style.fontWeight,
                                gridTemplateColumns: `repeat(${el.cols}, 1fr)`,
                                padding: `${fs(0.125)} ${fs(0.25)}`,
                                borderRadius: "9999px",
                              }}
                            >
                              {Array.from({ length: el.cols }).map((_, i) => (
                                <span
                                  key={i}
                                  className={i === 0 ? "" : i === el.cols - 1 ? "text-right" : "text-center"}
                                >
                                  Col {i + 1}
                                </span>
                              ))}
                            </div>
                            {layoutMode && !hideUI && (
                              <button
                                type="button"
                                className="ml-1 mr-1 mt-1 inline-flex items-center justify-center h-6 w-6 rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-slate-100"
                                title="Edit table block"
                              >
                                ✏️
                              </button>
                            )}
                          </div>
                          {/* body rows with same zebra colors as main table */}
                          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 flex-1 overflow-y-auto">
                            {Array.from({ length: el.rows }).map((_, r) => (
                              <div
                                key={r}
                                className={`grid py-2 px-3 text-slate-800 ${
                                  r === 0 ? "bg-white" : "border-t border-slate-200"
                                } ${r % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                                style={{
                                  fontSize: fs(0.6875),
                                  gridTemplateColumns: `repeat(${el.cols}, 1fr)`,
                                }}
                              >
                                {Array.from({ length: el.cols }).map((_, c) => (
                                  <div key={c} className={c === 0 ? "" : "text-center"}>
                                    Cell {r + 1}-{c + 1}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : el.blockType === "divider" ? (
                        // DIVIDER – thin line, resizable in layout mode
                        <div className="w-full h-full flex items-center">
                          <div className="w-full border-t border-slate-300" />
                        </div>
                      ) : (
                        // TEXT / DEFAULT
                        <div
                          className={`w-full h-full p-1 overflow-hidden flex items-center ${
                            el.isMerge ? "text-slate-600 font-medium" : "text-slate-800"
                          } ${layoutMode ? "cursor-move" : "cursor-default"}`}
                          contentEditable={!el.isMerge && !layoutMode}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            if (!el.isMerge) {
                              updateDynamicElement(el.id, {
                                content: e.currentTarget.innerText,
                              });
                            }
                          }}
                          style={{
                            fontSize: `${el.fontSize}px`,
                            color: el.textColor || style.textColor || '#0f172a',
                            caretColor: '#000000',
                          }}
                        >
                          {el.isMerge ? resolveTemplate(el.content) : el.content}
                        </div>
                      )}
                    </div>
                    {layoutMode && (
                      <button
                        className="absolute top-0 right-0 m-1 text-[10px] text-red-500 bg-white rounded-full w-4 h-4 flex items-center justify-center"
                        onClick={() => deleteDynamicElement(el.id)}
                      >
                        ×
                      </button>
                    )}
                  </Rnd>
                ))}
                {/* Header as Rnd (includes top color band) */}
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
                  <div className="flex items-start justify-between px-8 pt-8 pb-0 bg-slate-900 h-full" style={{ color: style.textColor }}>
                    <div className="flex items-center gap-3">
                      {style.logoSrc ? (
                        <img
                          src={style.logoSrc}
                          alt="Logo"
                          className="object-cover"
                          style={{
                            width: style.logoSize,
                            height: style.logoSize,
                            borderRadius: `${style.borderRadius / 2}px`,
                          }}
                        />
                      ) : (
                        <div
                          className="flex items-center justify-center h-10 w-10 rounded-xl shadow-lg"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${style.primaryColor}, ${style.accentColor})`,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
                          }}
                        />
                      )}
                      <div className="flex flex-col leading-tight">
                        <span
                          className="text-sm font-semibold tracking-tight"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("headerCompany", e)}
                        >
                          <TemplateText
                            templateKey="headerCompany"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                        <span
                          className="text-[11px]"
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("headerTagline", e)}
                        >
                          <TemplateText
                            templateKey="headerTagline"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xs tracking-[0.16em]"
                        style={{ color: style.textColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("headerInvoiceBadge", e)}
                      >
                        <TemplateText
                          templateKey="headerInvoiceBadge"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                      <p
                        className="text-lg font-semibold mt-1"
                        style={{ color: style.textColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("headerInvoiceNumber", e)}
                      >
                        <TemplateText
                          templateKey="headerInvoiceNumber"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                    </div>
                  </div>
                  <div
                    className="h-1.5"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${style.primaryColor}, ${style.accentColor})`,
                    }}
                  />
                </Rnd>
                {/* Bill To / details as Rnd */}
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
                  <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <div className="border border-slate-200 rounded-xl p-4">
                      <p
                        className="text-[11px] font-semibold tracking-[0.18em]"
                        style={{ color: style.textColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("billToLabel", e)}
                      >
                        <TemplateText
                          templateKey="billToLabel"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                      <p
                        className="mt-2 text-sm font-semibold"
                        style={{ color: style.textColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("billToName", e)}
                      >
                        <TemplateText
                          templateKey="billToName"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                      <p
                        className="mt-1 text-[11px] leading-relaxed"
                        style={{ color: style.textColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("billToAddress", e)}
                      >
                        <TemplateText
                          templateKey="billToAddress"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                      <p
                        className="mt-1 text-[11px]"
                        style={{ color: style.textColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("billToEmail", e)}
                      >
                        <TemplateText
                          templateKey="billToEmail"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                      <p
                        className="mt-1 text-[11px]"
                        style={{ color: style.textColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("billToPhone", e)}
                      >
                        <TemplateText
                          templateKey="billToPhone"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                    </div>
                    <div
                      className="border rounded-xl p-4"
                      style={{
                        borderColor: rgba(style.accentColor, 0.2),
                        backgroundColor: rgba(style.accentColor, 0.06),
                      }}
                    >
                      <p
                        className="text-[11px] font-semibold tracking-[0.18em]"
                        style={{ color: style.accentColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("detailsLabel", e)}
                      >
                        <TemplateText
                          templateKey="detailsLabel"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-y-1 text-[11px]">
                        <span
                          className=""
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("issueDateLabel", e)}
                        >
                          <TemplateText
                            templateKey="issueDateLabel"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                        <span
                          className="text-right"
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("issueDate", e)}
                        >
                          <TemplateText
                            templateKey="issueDate"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                        <span
                          className=""
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("dueDateLabel", e)}
                        >
                          <TemplateText
                            templateKey="dueDateLabel"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                        <span
                          className="text-right font-semibold"
                          style={{ color: style.primaryColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("dueDate", e)}
                        >
                          <TemplateText
                            templateKey="dueDate"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                        <span
                          className=""
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("paymentTermsLabel", e)}
                        >
                          <TemplateText
                            templateKey="paymentTermsLabel"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                        <span
                          className="text-right"
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("paymentTerms", e)}
                        >
                          <TemplateText
                            templateKey="paymentTerms"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                        <span
                          className=""
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("currencyLabel", e)}
                        >
                          <TemplateText
                            templateKey="currencyLabel"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                        <span
                          className="text-right"
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("currency", e)}
                        >
                          <TemplateText
                            templateKey="currency"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </span>
                      </div>
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
                  <div className="px-8 pb-6 h-full">
                    {/* header + edit icon */}
                    <div className="flex items-stretch justify-between pt-0">
                      <div
                        className="grid font-semibold flex-1"
                        style={{
                          backgroundColor: "slate-900",
                          fontSize: fs(0.6875),
                          textTransform: "uppercase",
                          tracking: "0.14em",
                          fontWeight: style.fontWeight,
                          gridTemplateColumns: [
                            "2.3fr",
                            "0.6fr",
                            "0.9fr",
                            "0.9fr",
                            ...columns
                              .filter((c) => c.kind === "extra")
                              .map(() => "1fr"),
                          ].join(" "),
                          padding: `${fs(0.125)} ${fs(0.25)}`,
                          borderRadius: "1rem",
                        }}
                      >
                        <span style={{ color: style.textColor }}>Description</span>
                        <span className="text-center" style={{ color: style.textColor }}>Qty</span>
                        <span className="text-right" style={{ color: style.textColor }}>Price</span>
                        <span className="text-right" style={{ color: style.textColor }}>Amount</span>
                        {columns
                          .filter((c) => c.kind === "extra")
                          .map((col) => (
                            <div key={col.id} className="text-center" style={{ color: style.textColor }}>
                              {col.name}
                            </div>
                          ))}
                      </div>
                      {!hideUI && (
                        <button
                          type="button"
                          onClick={openTableEdit}
                          className="ml-1 mr-2 mt-1 inline-flex items-center justify-center h-7 w-7 rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-slate-100"
                          title="Edit table"
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                    {/* rows */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 mt-4 flex-1 overflow-y-auto">
                      {rowsWithTotal.map((row, index) => (
                        <div
                          key={row.id}
                          className={`grid py-3 px-4 ${
                            index === 0 ? "bg-white" : "border-t border-slate-200"
                          } ${index % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                          style={{
                            fontSize: fs(0.6875),
                            gridTemplateColumns: [
                              "2.3fr",
                              "0.6fr",
                              "0.9fr",
                              "0.9fr",
                              ...columns
                                .filter((c) => c.kind === "extra")
                                .map(() => "1fr"),
                            ].join(" "),
                          }}
                        >
                          <div style={{ color: style.textColor }}>
                            <p style={{ fontSize: fs(0.75), fontWeight: fw(600), color: style.textColor }}>
                              <RowFieldText
                                row={row}
                                field="description"
                                updateRowField={updateRowField}
                                textColor={style.textColor}
                              />
                            </p>
                            <p
                              style={{
                                fontSize: fs(0.6875),
                                color: style.textColor,
                              }}
                            >
                              <RowFieldText
                                row={row}
                                field="details"
                                updateRowField={updateRowField}
                                multiline={true}
                                textColor={style.textColor}
                              />
                            </p>
                          </div>
                          <span className="text-center" style={{ color: style.textColor }}>
                            <RowFieldText
                              row={row}
                              field="qty"
                              updateRowField={updateRowField}
                              textColor={style.textColor}
                            />
                          </span>
                          <span className="text-right" style={{ color: style.textColor }}>
                            {currencySymbol}
                            <RowFieldText
                              row={row}
                              field="unitPrice"
                              updateRowField={updateRowField}
                              textColor={style.textColor}
                            />
                          </span>
                          <span className="text-right font-medium" style={{ color: style.textColor }}>
                            {currencySymbol}
                            {row.total}
                          </span>
                          {columns
                            .filter((c) => c.kind === "extra")
                            .map((col) => (
                              <div key={col.id} className="text-center" style={{ color: style.textColor }}>
                                <RowExtraText
                                  row={row}
                                  colId={col.id}
                                  updateRowExtra={updateRowExtra}
                                  textColor={style.textColor}
                                />
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </Rnd>
                {/* Notes / Totals as Rnd */}
                <Rnd
                  bounds="parent"
                  enableResizing={layoutMode}
                  disableDragging={!layoutMode}
                  size={{
                    width: notesTotalsLayout.width,
                    height: notesTotalsLayout.height,
                  }}
                  position={{
                    x: notesTotalsLayout.x - marginLeft,
                    y: notesTotalsLayout.y,
                  }}
                  onDragStop={(_, d) =>
                    setNotesTotalsLayout((prev) => ({
                      ...prev,
                      x: d.x + marginLeft,
                      y: d.y,
                    }))
                  }
                  onResizeStop={(_, __, ref, ___, pos) =>
                    setNotesTotalsLayout({
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
                  <div className="px-8 pb-8 flex flex-col gap-4 md:flex-row h-full">
                    <div
                      className="md:flex-1 border rounded-2xl p-4"
                      style={{
                        borderColor: rgba(style.primaryColor, 0.2),
                        backgroundColor: rgba(style.primaryColor, 0.06),
                      }}
                    >
                      <p
                        className="text-[11px] font-semibold tracking-[0.18em]"
                        style={{ color: style.primaryColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("notesLabel", e)}
                      >
                        <TemplateText
                          templateKey="notesLabel"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          textColor={style.textColor}
                        />
                      </p>
                      <p
                        className="mt-2 text-[11px] leading-relaxed"
                        style={{ whiteSpace: "pre-line", color: style.textColor }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToTemplate("notes", e)}
                      >
                        <TemplateText
                          templateKey="notes"
                          templates={templates}
                          setTemplates={setTemplates}
                          previewMode={previewMode}
                          resolveTemplate={resolveTemplate}
                          multiline={true}
                          textColor={style.textColor}
                        />
                      </p>
                    </div>
                    <div className="md:flex-1 flex flex-col gap-4">
                      <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 text-[11px]" style={{ color: style.textColor }}>
                        <div className="flex justify-between">
                          <span
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropToTemplate("subtotalLabel", e)}
                          >
                            <TemplateText
                              templateKey="subtotalLabel"
                              templates={templates}
                              setTemplates={setTemplates}
                              previewMode={previewMode}
                              resolveTemplate={resolveTemplate}
                              textColor={style.textColor}
                            />
                          </span>
                          <span style={{ color: style.textColor }}>{currencySymbol}{subtotalStr}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropToTemplate("taxLabel", e)}
                          >
                            <TemplateText
                              templateKey="taxLabel"
                              templates={templates}
                              setTemplates={setTemplates}
                              previewMode={previewMode}
                              resolveTemplate={resolveTemplate}
                              textColor={style.textColor}
                            />
                          </span>
                          <span style={{ color: style.textColor }}>{currencySymbol}{totalTaxStr}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropToTemplate("discountLabel", e)}
                          >
                            <TemplateText
                              templateKey="discountLabel"
                              templates={templates}
                              setTemplates={setTemplates}
                              previewMode={previewMode}
                              resolveTemplate={resolveTemplate}
                              textColor={style.textColor}
                            />
                          </span>
                          <span style={{ color: style.textColor }}>-{currencySymbol}{discountStr}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                          <span
                            className="font-semibold"
                            style={{ color: style.textColor }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropToTemplate("totalDueLabel", e)}
                          >
                            <TemplateText
                              templateKey="totalDueLabel"
                              templates={templates}
                              setTemplates={setTemplates}
                              previewMode={previewMode}
                              resolveTemplate={resolveTemplate}
                              textColor={style.textColor}
                            />
                          </span>
                          <span
                            className="text-lg font-bold"
                            style={{ color: style.primaryColor }}
                          >
                            {currencySymbol}{grandTotalStr}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-4 bg-slate-900 text-[11px]" style={{ color: style.textColor }}>
                        <p
                          className="font-semibold tracking-[0.18em]"
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("paymentLabel", e)}
                        >
                          <TemplateText
                            templateKey="paymentLabel"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </p>
                        <p
                          className="mt-2"
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("paymentText", e)}
                        >
                          <TemplateText
                            templateKey="paymentText"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </p>
                        <p
                          className="mt-1"
                          style={{ color: style.textColor }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropToTemplate("paymentNote", e)}
                        >
                          <TemplateText
                            templateKey="paymentNote"
                            templates={templates}
                            setTemplates={setTemplates}
                            previewMode={previewMode}
                            resolveTemplate={resolveTemplate}
                            textColor={style.textColor}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </Rnd>
                {/* Footer as Rnd (includes bottom color band) */}
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
                    className="h-1.5"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${style.accentColor}, ${style.primaryColor})`,
                    }}
                  />
                  <div className="px-8 py-4 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-2 h-full" style={{ color: style.textColor }}>
                    <span
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropToTemplate("footerLeft", e)}
                    >
                      <TemplateText
                        templateKey="footerLeft"
                        templates={templates}
                        setTemplates={setTemplates}
                        previewMode={previewMode}
                        resolveTemplate={resolveTemplate}
                        textColor={style.textColor}
                      />
                    </span>
                    <span
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropToTemplate("footerRight", e)}
                    >
                      <TemplateText
                        templateKey="footerRight"
                        templates={templates}
                        setTemplates={setTemplates}
                        previewMode={previewMode}
                        resolveTemplate={resolveTemplate}
                        textColor={style.textColor}
                      />
                    </span>
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
              className="w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-400 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={confirmAddColumn}
                className="flex-1 px-4 py-2 bg-orange-500 text-slate-900 font-semibold rounded-md hover:bg-orange-400"
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
      {/* Table Edit Modal */}
      {showTableEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Edit Table</h2>
            <div className="space-y-4">
              {/* Edit Columns */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Columns</h3>
                {columns.map((col) => (
                  <div key={col.id} className="flex items-center justify-between mb-2">
                    {editingColumnId === col.id ? (
                      <input
                        type="text"
                        defaultValue={col.name}
                        onBlur={(e) => {
                          updateColumnName(col.id, e.target.value);
                          setEditingColumnId(null);
                        }}
                        autoFocus
                        className="flex-1 rounded-md bg-slate-800 border border-slate-600 px-3 py-1 text-sm text-slate-100 outline-none focus:border-orange-400"
                      />
                    ) : (
                      <span className="text-slate-100">{col.name}</span>
                    )}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingColumnId(col.id)}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      {col.kind === "extra" && (
                        <button
                          onClick={() => deleteColumn(col.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={addColumn}
                  className="text-xs text-green-400 hover:text-green-300"
                >
                  + Add New Column
                </button>
              </div>
              {/* Edit Rows Data */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Rows Data</h3>
                {invoice.rows.map((row) => (
                  <div key={row.id} className="border border-slate-600 rounded p-2 mb-2">
                    <p className="text-xs text-slate-400 mb-1">Row {row.id}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Description:</span>
                        <span className="text-slate-100">{row.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Details:</span>
                        <span className="text-slate-100">{row.details}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Qty:</span>
                        <span className="text-slate-100">{row.qty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span className="text-slate-100">{row.unitPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="text-slate-100 font-medium">{row.total}</span>
                      </div>
                      {columns.filter(c => c.kind === "extra").map(col => (
                        <div key={col.id} className="flex justify-between">
                          <span>{col.name}:</span>
                          <span className="text-slate-100">{row.extras?.[col.id] || ''}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {/* Inline edit row - expand as needed */}}
                      className="mt-1 text-xs text-blue-400 hover:text-blue-300 w-full"
                    >
                      Edit Row Details
                    </button>
                  </div>
                ))}
                <button
                  onClick={addRow}
                  className="text-xs text-green-400 hover:text-green-300"
                >
                  + Add New Row
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
              <button
                onClick={closeTableEdit}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-100 rounded-md hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Templates Modal - Placeholder */}
      {/* Add if needed */}
    </div>
  );
  return (
    <TemplateLayout
      title="Rezwan Invoice · Corporate"
      subtitle="Left: edit data, templates with merge fields drag-drop. Center: Corporate invoice (layout mode + PDF export). Right: brand, typography, logo & radius."
      left={
        <LeftSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          invoice={invoice}
          setInvoice={setInvoice}
          templates={templates}
          setTemplates={setTemplates}
          columns={columns}
          setColumns={setColumns}
          addRow={addRow}
          addColumn={addColumn}
          mergeFields={mergeFields}
          setMergeFields={setMergeFields}
          dataFields={dataFields}
          setDataFields={setDataFields}
        />
      }
      preview={preview}
      right={
        <RightSidebar
          styleConfig={style}
          onStyleChange={handleStyleChange}
          selectedBlock={selectedBlock}
          onBlockStyleChange={onBlockStyleChange}
        />
      }
    />
  );
}