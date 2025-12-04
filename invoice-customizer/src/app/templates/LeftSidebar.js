"use client";
import React from "react";

export const defaultMergeFields = {
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

export const defaultDataFields = [
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

export default function LeftSidebar({
  activeTab,
  setActiveTab,
  invoice,
  setInvoice,
  templates,
  setTemplates,
  columns,
  setColumns,
  addRow,
  addColumn,
  mergeFields,
  setMergeFields,
  dataFields,
  setDataFields,
}) {
  const currentFields = mergeFields[activeTab] || mergeFields.all;

  const updateMergeFieldLabel = (category, index, newLabel) => {
    setMergeFields((prev) => {
      const updated = { ...prev };
      if (updated[category]) {
        updated[category] = [...updated[category]];
        updated[category][index] = { ...updated[category][index], label: newLabel };
      }
      if (category !== "all") {
        const allIndex = updated.all.findIndex(
          (f) => f.value === updated[category][index].value
        );
        if (allIndex !== -1) {
          updated.all = [...updated.all];
          updated.all[allIndex] = { ...updated.all[allIndex], label: newLabel };
        }
      }
      return updated;
    });
  };

  const updateDataFieldLabel = (index, newLabel) => {
    setDataFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], label: newLabel };
      return updated;
    });
  };

  const handleFieldChange = (field, value) =>
    setInvoice((prev) => ({ ...prev, [field]: value }));

  const handleBasicChange = (field) => (e) =>
    handleFieldChange(field, e.target.value);

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

  return (
    <div className="space-y-4 pr-2 h-full overflow-y-auto scrollbar-hide">
      {/* Simple Invoice Text (from first component) */}
      <div className="space-y-4 border border-slate-800 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-slate-100 mb-1">
          Invoice text
        </h2>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400">Bill To</p>
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.billToName ?? ""}
            onChange={handleBasicChange("billToName")}
          />
          <textarea
            rows={2}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.billToAddress ?? ""}
            onChange={handleBasicChange("billToAddress")}
          />
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.billToEmail ?? ""}
            onChange={handleBasicChange("billToEmail")}
          />
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.billToPhone ?? ""}
            onChange={handleBasicChange("billToPhone")}
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-800">
          <p className="text-xs font-medium text-slate-400">Invoice details</p>
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.invoiceNumber ?? ""}
            onChange={handleBasicChange("invoiceNumber")}
          />
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.issueDate ?? ""}
            onChange={handleBasicChange("issueDate")}
          />
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.dueDate ?? ""}
            onChange={handleBasicChange("dueDate")}
          />
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.paymentTerms ?? ""}
            onChange={handleBasicChange("paymentTerms")}
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-800">
          <p className="text-xs font-medium text-slate-400">First line item</p>
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.description1 ?? ""}
            onChange={handleBasicChange("description1")}
          />
          <textarea
            rows={2}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
            value={invoice.details1 ?? ""}
            onChange={handleBasicChange("details1")}
          />
          <div className="flex gap-2">
            <input
              className="w-1/3 rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
              value={invoice.qty1 ?? ""}
              onChange={handleBasicChange("qty1")}
            />
            <input
              className="w-2/3 rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs outline-none focus:border-cyan-400"
              value={invoice.price1 ?? ""}
              onChange={handleBasicChange("price1")}
            />
          </div>
        </div>
      </div>

      {/* Merge Fields */}
      <div className="border border-slate-800 rounded-lg p-4">
        <h3 className="text-xs font-medium text-slate-400 mb-2">
          Merge Fields
        </h3>
        <p className="text-xs text-slate-500 mb-2">
          Drag & drop or click to insert fields
        </p>
        <div className="flex space-x-1 mb-2 text-xs">
          {Object.keys(mergeFields).map((tab) => (
            <button
              key={tab}
              className={`px-2 py-1 rounded ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="space-y-1">
          {currentFields.map((f, index) => (
            <input
              key={f.value}
              value={f.label}
              onChange={(e) =>
                updateMergeFieldLabel(activeTab, index, e.target.value)
              }
              className="p-2 bg-slate-800/50 border border-slate-700 rounded cursor-grab active:cursor-grabbing text-xs text-slate-300 hover:bg-slate-700 w-full"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", f.value)
              }
              placeholder={f.label}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          46 fields available - Drag to editor
        </p>
      </div>

      {/* Invoice Data */}
      <div className="border border-slate-800 rounded-lg p-4">
        <h3 className="text-xs font-medium text-slate-400 mb-2">
          Invoice Data
        </h3>
        <div className="mb-2">
          <p className="text-xs text-slate-500">Draggable Fields</p>
          <div className="space-y-1 text-xs">
            {dataFields.map((f, index) => (
              <input
                key={f.value}
                value={f.label}
                onChange={(e) => updateDataFieldLabel(index, e.target.value)}
                className="p-2 bg-slate-800/50 border border-slate-700 rounded cursor-grab active:cursor-grabbing text-slate-300 hover:bg-slate-700 w-full"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", f.value)
                }
                placeholder={f.label}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2 text-xs">
          <input
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", invoice.companyName)
            }
            value={invoice.companyName}
            onChange={(e) => handleFieldChange("companyName", e.target.value)}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
            placeholder="Company Name"
          />
          <input
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", invoice.tagline)
            }
            value={invoice.tagline}
            onChange={(e) => handleFieldChange("tagline", e.target.value)}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
            placeholder="Tagline"
          />
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs font-medium text-slate-400 mb-1">Bill To</p>
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.billToName)
              }
              value={invoice.billToName}
              onChange={(e) =>
                handleFieldChange("billToName", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Customer Name"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.billToAddress)
              }
              value={invoice.billToAddress}
              onChange={(e) =>
                handleFieldChange("billToAddress", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Customer Address"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.billToEmail)
              }
              value={invoice.billToEmail}
              onChange={(e) =>
                handleFieldChange("billToEmail", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Customer Email"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.billToPhone)
              }
              value={invoice.billToPhone}
              onChange={(e) =>
                handleFieldChange("billToPhone", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Customer Phone"
            />
          </div>
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs font-medium text-slate-400 mb-1">
              Financial
            </p>
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.invoiceNumber)
              }
              value={invoice.invoiceNumber}
              onChange={(e) =>
                handleFieldChange("invoiceNumber", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Invoice Number"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.issueDate)
              }
              type="date"
              value={invoice.issueDate}
              onChange={(e) =>
                handleFieldChange("issueDate", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.dueDate)
              }
              type="date"
              value={invoice.dueDate}
              onChange={(e) =>
                handleFieldChange("dueDate", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.paymentTerms)
              }
              value={invoice.paymentTerms}
              onChange={(e) =>
                handleFieldChange("paymentTerms", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Payment Terms"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.currency)
              }
              value={invoice.currency}
              onChange={(e) => handleFieldChange("currency", e.target.value)}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Currency"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.taxRate)
              }
              type="number"
              value={invoice.taxRate}
              onChange={(e) => handleFieldChange("taxRate", e.target.value)}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Tax Rate (%)"
            />
            <input
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  invoice.discountPercent
                )
              }
              type="number"
              value={invoice.discountPercent}
              onChange={(e) =>
                handleFieldChange("discountPercent", e.target.value)
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 cursor-grab"
              placeholder="Discount (%)"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", invoice.notes)
              }
              value={invoice.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-orange-400 h-20 resize-none cursor-grab"
              placeholder="Notes"
            />
          </div>
        </div>
      </div>

      {/* Template Text */}
      <div className="border border-slate-800 rounded-lg p-4">
        <h3 className="text-xs font-medium text-slate-400 mb-2">
          Template Text
        </h3>
        <p className="text-xs text-slate-500 mb-2">
          Edit templates and drag merge fields to insert
        </p>
        <div className="space-y-3 text-xs">
          <div>
            <p className="font-medium text-slate-400 mb-1">Header</p>
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  templates.headerCompany
                )
              }
              value={templates.headerCompany}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  headerCompany: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "headerCompany")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-12 resize-none cursor-grab"
              placeholder="Company Name Template"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  templates.headerTagline
                )
              }
              value={templates.headerTagline}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  headerTagline: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "headerTagline")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Tagline Template"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  templates.headerInvoiceBadge
                )
              }
              value={templates.headerInvoiceBadge}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  headerInvoiceBadge: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "headerInvoiceBadge")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Invoice Badge"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  templates.headerInvoiceNumber
                )
              }
              value={templates.headerInvoiceNumber}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  headerInvoiceNumber: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "headerInvoiceNumber")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Invoice Number Template"
            />
          </div>
          <div>
            <p className="font-medium text-slate-400 mb-1">Bill To</p>
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.billToLabel)
              }
              value={templates.billToLabel}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  billToLabel: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "billToLabel")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Bill To Label"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.billToName)
              }
              value={templates.billToName}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  billToName: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "billToName")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Bill To Name Template"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  templates.billToAddress
                )
              }
              value={templates.billToAddress}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  billToAddress: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "billToAddress")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-12 resize-none cursor-grab"
              placeholder="Bill To Address Template"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.billToEmail)
              }
              value={templates.billToEmail}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  billToEmail: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "billToEmail")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Bill To Email Template"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.billToPhone)
              }
              value={templates.billToPhone}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  billToPhone: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "billToPhone")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Bill To Phone Template"
            />
          </div>
          <div>
            <p className="font-medium text-slate-400 mb-1">Details</p>
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.detailsLabel)
              }
              value={templates.detailsLabel}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  detailsLabel: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "detailsLabel")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Details Label"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  templates.issueDateLabel
                )
              }
              value={templates.issueDateLabel}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  issueDateLabel: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "issueDateLabel")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Issue Date Label"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.issueDate)
              }
              value={templates.issueDate}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  issueDate: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "issueDate")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Issue Date Value"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.dueDateLabel)
              }
              value={templates.dueDateLabel}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  dueDateLabel: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "dueDateLabel")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Due Date Label"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.dueDate)
              }
              value={templates.dueDate}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  dueDate: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "dueDate")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Due Date Value"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "text/plain",
                  templates.paymentTermsLabel
                )
              }
              value={templates.paymentTermsLabel}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  paymentTermsLabel: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) =>
                handleInsertField(e, "paymentTermsLabel")
              }
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Payment Terms Label"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.paymentTerms)
              }
              value={templates.paymentTerms}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  paymentTerms: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "paymentTerms")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Payment Terms Value"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.currencyLabel)
              }
              value={templates.currencyLabel}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  currencyLabel: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "currencyLabel")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Currency Label"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.currency)
              }
              value={templates.currency}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  currency: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "currency")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Currency Value"
            />
          </div>
          <div>
            <p className="font-medium text-slate-400 mb-1">Notes</p>
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.notesLabel)
              }
              value={templates.notesLabel}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  notesLabel: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "notesLabel")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-10 resize-none cursor-grab"
              placeholder="Notes Label"
            />
            <textarea
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", templates.notes)
              }
              value={templates.notes}
              onChange={(e) =>
                setTemplates((p) => ({
                  ...p,
                  notes: e.target.value,
                }))
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleInsertField(e, "notes")}
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100 outline-none focus:border-orange-400 h-24 resize-none cursor-grab"
              placeholder="Notes Template"
            />
          </div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <p className="text-xs font-medium text-slate-400">Table Rows</p>
        <div className="space-y-2">
          {invoice.rows.map((row) => (
            <div
              key={row.id}
              className="bg-slate-900/30 rounded p-2 space-y-1"
            >
              <p className="text-[10px] text-slate-500">Row {row.id}</p>
              <input
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", row.description)
                }
                value={row.description}
                onChange={(e) =>
                  updateRowField(row.id, "description", e.target.value)
                }
                className="w-full rounded bg-slate-900 border border-slate-700 px-1 py-0.5 text-[10px] text-slate-100 cursor-grab"
                placeholder="Description"
              />
              <input
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", row.details)
                }
                value={row.details}
                onChange={(e) =>
                  updateRowField(row.id, "details", e.target.value)
                }
                className="w-full rounded bg-slate-900 border border-slate-700 px-1 py-0.5 text-[10px] text-slate-100 cursor-grab"
                placeholder="Details"
              />
              <div className="flex gap-1">
                <input
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", row.qty)
                  }
                  type="number"
                  value={row.qty}
                  onChange={(e) =>
                    updateRowField(row.id, "qty", e.target.value)
                  }
                  className="w-12 rounded bg-slate-900 border border-slate-700 px-1 py-0.5 text-[10px] text-slate-100 cursor-grab"
                  placeholder="Qty"
                />
                <input
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", row.unitPrice)
                  }
                  type="number"
                  step="0.01"
                  value={row.unitPrice}
                  onChange={(e) =>
                    updateRowField(row.id, "unitPrice", e.target.value)
                  }
                  className="flex-1 rounded bg-slate-900 border border-slate-700 px-1 py-0.5 text-[10px] text-slate-100 cursor-grab"
                  placeholder="Unit Price"
                />
              </div>
              {columns
                .filter((c) => c.kind === "extra")
                .map((col) => (
                  <input
                    key={col.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData(
                        "text/plain",
                        row.extras?.[col.id] ?? ""
                      )
                    }
                    value={row.extras?.[col.id] ?? ""}
                    onChange={(e) =>
                      updateRowExtra(row.id, col.id, e.target.value)
                    }
                    className="w-full rounded bg-slate-900 border border-slate-700 px-1 py-0.5 text-[10px] text-slate-100 cursor-grab"
                    placeholder={col.name}
                  />
                ))}
            </div>
          ))}
        </div>
        <button
          onClick={addRow}
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 hover:border-orange-400"
        >
          + Add row
        </button>
      </div>

      {/* Columns */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <p className="text-xs font-medium text-slate-400">Columns</p>
        <div className="space-y-1">
          {columns.map((col) => (
            <div key={col.id} className="flex items-center gap-1">
              <input
                draggable={col.kind !== "fixed"}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", col.name)
                }
                value={col.name}
                onChange={(e) =>
                  setColumns((p) =>
                    p.map((c) =>
                      c.id === col.id ? { ...c, name: e.target.value } : c
                    )
                  )
                }
                className={`flex-1 rounded bg-slate-900 border px-1 py-0.5 text-[10px] text-slate-100 outline-none ${
                  col.kind === "fixed"
                    ? "border-slate-700 opacity-60 cursor-not-allowed"
                    : "border-slate-700 focus:border-orange-400 cursor-grab"
                }`}
                disabled={col.kind === "fixed"}
              />
              {col.kind === "extra" && (
                <button
                  onClick={() => deleteColumn(col.id)}
                  className="px-1 py-0.5 text-[10px] rounded border border-red-600 text-red-400 hover:bg-red-900/40"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addColumn}
          className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 hover:border-orange-400"
        >
          + Add column
        </button>
      </div>
    </div>
  );
}
