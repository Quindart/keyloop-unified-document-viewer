# Right-side Document Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open a right-side document modal from each document card and preview the matching mock PDF, DOCX, or XLSX sample with the document's metadata.

**Architecture:** Keep selection state on the VIN results route and pass the selected document into a controlled Sheet. Resolve one static sample path by document format; render PDF in an iframe, DOCX with `docx-preview`, and the first XLSX worksheet as an HTML table using ExcelJS.

**Tech Stack:** React 19, TypeScript, React Router, existing Radix Sheet primitive, Tailwind CSS, `docx-preview`, and existing `exceljs`.

**Spec:** `docs/superpowers/specs/2026-10-30-document-preview-design.md`

## Global Constraints

- Every PDF uses `public/files/purchase-pdf.pdf`, every DOCX uses `public/files/purchase-word.docx`, and every Excel document uses `public/files/maintain-excel.xlsx`.
- These samples are mock previews shared by every document of the matching format, not per-record files.
- Use the existing Sheet primitive and ExcelJS dependency; add a DOCX renderer.
- Keep the modal usable on narrow screens and preserve standard dialog close behavior.
- Do not create or run automated tests unless the user explicitly requests them.

## Review Focus

- A sample fetch fails: leave metadata visible and show an inline preview error rather than a blank panel. (Task 2)
- A DOCX cannot be parsed: clear any previous rendered document and show the current file's error. (Task 2)
- The XLSX has no worksheet or has an empty sheet: show a clear empty-preview state. (Task 2)
- A user closes or switches documents while a preview is loading: prevent the old request from replacing the current preview. (Task 2)
- Excel cells contain dates, rich text, formulas, or hyperlinks: render readable cell text rather than `[object Object]`. (Task 2)

---

### Task 1: Add the browser DOCX renderer

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces: the `docx-preview` package for the DOCX preview component in Task 2.

- [ ] **Step 1: Add `docx-preview`**

Run: `pnpm add docx-preview`

Expected: `docx-preview` appears in `package.json` and the lockfile resolves its runtime dependencies.

---

### Task 2: Build the right-side preview Sheet

**Files:**
- Create: `app/features/vehicles/document-preview-sheet.tsx`
- Consume: `app/features/vehicles/document-card.tsx` (`VehicleDocument` type)
- Consume: `app/components/ui/sheet.tsx`

**Interfaces:**
- Produces: `DocumentPreviewSheetProps = { document: VehicleDocument | null; onClose: () => void }` and `DocumentPreviewSheet`.
- Resolves mock samples by format: `PDF -> /files/purchase-pdf.pdf`, `DOCX -> /files/purchase-word.docx`, `XLS -> /files/maintain-excel.xlsx`.

- [ ] **Step 1: Add the controlled Sheet and metadata section**

Use `document !== null` as the open state. Show title, sample filename, format, document type, source, and date. Call `onClose` when Radix reports the Sheet closed. Use full width on small screens and a wide capped panel on desktop.

- [ ] **Step 2: Add PDF preview**

Render the mapped PDF sample in a titled, scrollable iframe. Keep the document metadata and Sheet controls outside the iframe.

- [ ] **Step 3: Add DOCX preview**

Fetch the mapped DOCX sample as an `ArrayBuffer` and pass it to `docx-preview`'s `renderAsync` inside a referenced container. Track loading and failure states, and clear rendered DOM and stale async work when the selected document changes or the Sheet closes.

- [ ] **Step 4: Add XLSX preview**

Fetch the mapped workbook as an `ArrayBuffer`, load it with `ExcelJS.Workbook.xlsx.load`, and render the first worksheet into a horizontally scrollable HTML table. Format primitive values directly and handle dates, rich-text values, formula results, and hyperlink display text. Show loading, failure, and empty-sheet states.

---

### Task 3: Open the preview from document cards

**Files:**
- Modify: `app/features/vehicles/document-card.tsx`
- Modify: `app/routes/home.tsx`

**Interfaces:**
- `DocumentCardProps` gains `onSelect: (document: VehicleDocument) => void`.
- `Home` owns `selectedDocument: VehicleDocument | null` and passes it to `DocumentPreviewSheet`.

- [ ] **Step 1: Make each card keyboard-accessible and selectable**

Keep the ordered-list item as the `<li>` and put the card content in a full-width, left-aligned `<button>` with visible focus styling. Invoke `onSelect(document)` on activation.

- [ ] **Step 2: Connect selection and close behavior in `Home`**

Set the selected document from each card, mount `DocumentPreviewSheet`, and clear selection when it closes or the VIN results are reset. Preserve existing document sorting and card metadata.

---

## Execution notes

This is a three-task feature with adjacent interfaces and no independent subsystems. The implementation can run natively in this session; no subagent delegation is needed. Automated tests and verification commands are intentionally omitted unless requested.
