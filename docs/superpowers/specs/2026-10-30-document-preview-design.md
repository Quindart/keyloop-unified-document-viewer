# Right-side document preview design

## Intent

Clicking a document card in the VIN results opens a right-side modal with the document's metadata and a preview. The three supplied files are mock samples: every PDF uses `public/files/purchase-pdf.pdf`, every DOCX uses `public/files/purchase-word.docx`, and every Excel document uses `public/files/maintain-excel.xlsx`.

## Goals and constraints

- Keep the user on the vehicle results page and show the selected file in the existing right-side Sheet UI.
- Show the document title, format, type, source, and date alongside its preview.
- Render PDF in the browser, convert DOCX to readable HTML, and display XLSX worksheet data in a table.
- Reuse the matching sample for every document of that format; these are mock previews, not per-record files.
- Use the existing Sheet primitive and ExcelJS dependency. Add a DOCX renderer if the current project cannot render the sample directly.
- Keep the layout usable on narrow screens and support standard dialog close behavior.

## Approaches

1. **Inline format previews (recommended):** PDF iframe, DOCX-to-HTML preview, and XLSX table preview. This matches the unified viewer request and keeps all formats in the modal. DOCX formatting may be approximate and requires a renderer.
2. **Metadata plus open/download links:** smallest implementation, but DOCX and XLSX content would leave the modal or download rather than be viewed there.
3. **Hosted Office viewer:** delegates rendering to an external service and requires publicly reachable files, which does not fit these local mock samples.

## Proposed behavior

Make each document card keyboard-accessible and clickable. Keep the selected document in the VIN results route and open a controlled right-side Sheet. Resolve its preview source from the file format, show loading/error states while reading Office files, and clear the selected item when the Sheet closes. On mobile, the Sheet can occupy the available width.

## Non-goals

Editing documents, fetching real per-document content, changing VIN search behavior, or adding upload and download workflows.

## Open implementation choices

Choose a browser DOCX renderer that converts the supplied sample to a readable preview; keep the conversion client-side and render the XLSX sample with the already installed ExcelJS package.
