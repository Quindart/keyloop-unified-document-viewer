import { Clock3 } from 'lucide-react';

export type VehicleDocument = {
  id: string;
  title: string;
  date: string;
  type: string;
  source: 'Sales' | 'Service';
  format: 'PDF' | 'DOCX' | 'XLS';
};

type DocumentCardProps = {
  document: VehicleDocument;
  onSelect: (document: VehicleDocument) => void;
};

export function DocumentCard({ document, onSelect }: DocumentCardProps) {
  return (
    <li className="w-full min-w-0">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => onSelect(document)}
        className="flex min-h-36 w-full flex-col justify-between gap-5 rounded-xl border bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:p-5"
      >
        <span className="flex items-start gap-3">
          <img
            src={`/images/document-types/${document.format.toLowerCase()}.png`}
            alt={`${document.format} file`}
            width={48}
            height={48}
            loading="lazy"
            className="size-12 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span
              role="heading"
              aria-level={3}
              className="block font-medium text-slate-900"
            >
              {document.title}
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              {document.type}
            </span>
          </span>
        </span>
        <span className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${document.source === 'Sales' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}
          >
            {document.source}
          </span>
          <time
            dateTime={document.date}
            className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:text-sm"
          >
            <Clock3 className="size-4" />
            {new Date(document.date).toLocaleDateString()}
          </time>
        </span>
      </button>
    </li>
  );
}
