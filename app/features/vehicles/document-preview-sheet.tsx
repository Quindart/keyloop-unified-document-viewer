import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { CellValue } from 'exceljs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import type { VehicleDocument } from '~/features/vehicles/document-card';

type DocumentPreviewSheetProps = {
  document: VehicleDocument | null;
  onClose: () => void;
};

type PreviewSample = {
  fileName: string;
  src: string;
  formatLabel: string;
};

const previewSamples: Record<VehicleDocument['format'], PreviewSample> = {
  PDF: {
    fileName: 'purchase-pdf.pdf',
    src: '/files/purchase-pdf.pdf',
    formatLabel: 'PDF document',
  },
  DOCX: {
    fileName: 'purchase-word.docx',
    src: '/files/purchase-word.docx',
    formatLabel: 'Word document (.docx)',
  },
  XLS: {
    fileName: 'maintain-excel.xlsx',
    src: '/files/maintain-excel.xlsx',
    formatLabel: 'Excel workbook (.xlsx)',
  },
};

type LoadState = 'loading' | 'ready' | 'error';

function PreviewMessage({
  children,
  role = 'status',
}: {
  children: ReactNode;
  role?: 'alert' | 'status';
}) {
  return (
    <div
      role={role}
      className="grid min-h-72 place-items-center rounded-lg border border-dashed bg-white px-6 py-10 text-center text-sm text-slate-600"
    >
      {children}
    </div>
  );
}

function PdfPreview({ src, title }: { src: string; title: string }) {
  const [state, setState] = useState<LoadState>('loading');
  const [objectUrl, setObjectUrl] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let createdUrl = '';
    setState('loading');
    setObjectUrl('');

    async function loadPdf() {
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error('PDF sample could not be loaded.');
        const blob = await response.blob();
        if (!active) return;
        createdUrl = URL.createObjectURL(blob);
        setObjectUrl(createdUrl);
        setState('ready');
      } catch {
        if (active && !controller.signal.aborted) setState('error');
      }
    }

    void loadPdf();
    return () => {
      active = false;
      controller.abort();
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [src]);

  if (state === 'loading')
    return <PreviewMessage>Loading PDF preview…</PreviewMessage>;
  if (state === 'error' || !objectUrl) {
    return (
      <PreviewMessage role="alert">
        Could not load the PDF sample preview.
      </PreviewMessage>
    );
  }

  return (
    <iframe
      title={`Preview of ${title}`}
      src={objectUrl}
      className="h-full min-h-72 w-full rounded-lg border bg-white"
    />
  );
}

function DocxPreview({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const controller = new AbortController();
    let active = true;
    setState('loading');

    async function loadDocx() {
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error('DOCX sample could not be loaded.');
        const data = await response.arrayBuffer();
        if (!active) return;
        const { renderAsync } = await import('docx-preview');
        if (!active) return;
        await renderAsync(data, container, undefined, {
          className: 'docx-preview',
          inWrapper: true,
        });
        if (active) setState('ready');
      } catch {
        if (active && !controller.signal.aborted) setState('error');
      }
    }

    void loadDocx();
    return () => {
      active = false;
      controller.abort();
      container.replaceChildren();
    };
  }, [src]);

  return (
    <div className="relative h-full min-h-72 overflow-auto rounded-lg bg-slate-100 p-4 sm:p-6">
      <div
        ref={containerRef}
        className={`min-h-full ${state === 'ready' ? '' : 'invisible'}`}
      />
      {state === 'loading' && (
        <div className="absolute inset-0 p-4 sm:p-6">
          <PreviewMessage>Loading Word preview…</PreviewMessage>
        </div>
      )}
      {state === 'error' && (
        <div className="absolute inset-0 p-4 sm:p-6">
          <PreviewMessage role="alert">
            Could not render the Word sample preview.
          </PreviewMessage>
        </div>
      )}
    </div>
  );
}

type ExcelPreviewState =
  | { status: 'loading' | 'error' | 'empty' }
  | { status: 'ready'; worksheetName: string; rows: string[][] };

function formatCellValue(value: CellValue | undefined): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value !== 'object') return String(value);

  if ('richText' in value) {
    return value.richText.map((fragment) => fragment.text).join('');
  }
  if ('text' in value && typeof value.text === 'string') return value.text;
  if ('result' in value && value.result !== undefined) {
    return formatCellValue(value.result);
  }
  if ('formula' in value && typeof value.formula === 'string') {
    return `=${value.formula}`;
  }
  if ('sharedFormula' in value && typeof value.sharedFormula === 'string') {
    return `=${value.sharedFormula}`;
  }
  if ('error' in value && typeof value.error === 'string') return value.error;
  return '';
}

function columnLabel(columnIndex: number) {
  let index = columnIndex + 1;
  let label = '';
  while (index > 0) {
    const remainder = (index - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    index = Math.floor((index - 1) / 26);
  }
  return label;
}

function ExcelPreview({ src }: { src: string }) {
  const [preview, setPreview] = useState<ExcelPreviewState>({
    status: 'loading',
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setPreview({ status: 'loading' });

    async function loadWorkbook() {
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error('Excel sample could not be loaded.');
        const data = await response.arrayBuffer();
        if (!active) return;

        const { default: ExcelJS } = await import('exceljs');
        if (!active) return;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data);
        if (!active) return;

        const worksheet = workbook.worksheets[0];
        if (
          !worksheet ||
          worksheet.actualRowCount === 0 ||
          worksheet.actualColumnCount === 0
        ) {
          setPreview({ status: 'empty' });
          return;
        }

        const rows = Array.from({ length: worksheet.rowCount }, (_, rowIndex) =>
          Array.from({ length: worksheet.columnCount }, (_, columnIndex) =>
            formatCellValue(
              worksheet.getRow(rowIndex + 1).getCell(columnIndex + 1).value,
            ),
          ),
        );
        setPreview({ status: 'ready', worksheetName: worksheet.name, rows });
      } catch {
        if (active && !controller.signal.aborted) {
          setPreview({ status: 'error' });
        }
      }
    }

    void loadWorkbook();
    return () => {
      active = false;
      controller.abort();
    };
  }, [src]);

  if (preview.status === 'loading') {
    return <PreviewMessage>Loading spreadsheet preview…</PreviewMessage>;
  }
  if (preview.status === 'error') {
    return (
      <PreviewMessage role="alert">
        Could not load the Excel sample preview.
      </PreviewMessage>
    );
  }
  if (preview.status === 'empty') {
    return (
      <PreviewMessage>
        This workbook has no worksheet data to preview.
      </PreviewMessage>
    );
  }

  const columnCount = preview.rows[0]?.length ?? 0;
  return (
    <div className="flex h-full min-h-72 min-w-0 flex-col overflow-hidden rounded-lg border bg-white">
      <p className="shrink-0 border-b px-4 py-3 text-sm font-medium text-slate-700">
        {preview.worksheetName}
      </p>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 text-xs font-semibold text-slate-600">
            <tr>
              <th scope="col" className="border-b border-r px-3 py-2">
                #
              </th>
              {Array.from({ length: columnCount }, (_, columnIndex) => (
                <th
                  key={columnIndex}
                  scope="col"
                  className="border-b border-r px-3 py-2"
                >
                  {columnLabel(columnIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th
                  scope="row"
                  className="border-b border-r bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500"
                >
                  {rowIndex + 1}
                </th>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="max-w-64 whitespace-pre-wrap border-b border-r px-3 py-2 text-slate-800"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DocumentPreviewSheet({
  document,
  onClose,
}: DocumentPreviewSheetProps) {
  const sample = document ? previewSamples[document.format] : null;
  const displayDate = document
    ? new Date(document.date).toLocaleDateString()
    : '';

  return (
    <Sheet
      open={document !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl"
      >
        {document && sample && (
          <>
            <SheetHeader className="shrink-0 border-b px-6 py-5 pr-14">
              <SheetTitle className="break-words">{document.title}</SheetTitle>
              <SheetDescription>
                Previewing the shared mock file {sample.fileName}.
              </SheetDescription>
            </SheetHeader>
            <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] overflow-hidden lg:grid-cols-[minmax(0,1fr)_17rem] lg:grid-rows-1">
              <main className="min-h-0 overflow-hidden bg-slate-100 p-4 sm:p-6">
                {document.format === 'PDF' && (
                  <PdfPreview
                    key={document.id}
                    src={sample.src}
                    title={document.title}
                  />
                )}
                {document.format === 'DOCX' && (
                  <DocxPreview key={document.id} src={sample.src} />
                )}
                {document.format === 'XLS' && (
                  <ExcelPreview key={document.id} src={sample.src} />
                )}
              </main>
              <aside className="min-h-0 overflow-y-auto border-t bg-white p-5 lg:border-l lg:border-t-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  File information
                </h3>
                <dl className="mt-4 divide-y">
                  <MetadataRow label="File name" value={sample.fileName} />
                  <MetadataRow label="Format" value={sample.formatLabel} />
                  <MetadataRow label="Document type" value={document.type} />
                  <MetadataRow label="Source" value={document.source} />
                  <MetadataRow label="Date" value={displayDate} />
                </dl>
                <p className="mt-5 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                  This sample file is used as mock content for all documents in
                  this format.
                </p>
              </aside>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-slate-900">{value}</dd>
    </div>
  );
}
