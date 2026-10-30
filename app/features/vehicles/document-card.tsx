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
};

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <li className="flex w-full min-w-0 min-h-36 flex-col justify-between gap-5 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <img
          src={`/images/document-types/${document.format.toLowerCase()}.png`}
          alt={`${document.format} file`}
          width={48}
          height={48}
          loading="lazy"
          className="size-12 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <h3 className="font-medium text-slate-900">{document.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{document.type}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${document.source === 'Sales' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {document.source}
        </span>
        <time dateTime={document.date} className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
          <Clock3 className="size-4" />
          {new Date(document.date).toLocaleDateString()}
        </time>
      </div>
    </li>
  );
}
