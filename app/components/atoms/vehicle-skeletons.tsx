import { Skeleton } from '~/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export function VehicleGridSkeleton() {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-label={t('home.loadingVehicles')}
      className="space-y-4"
    >
      <p className="text-sm font-medium text-slate-600">
        {t('home.searching')}
      </p>
      <span className="sr-only">{t('home.loadingVehicles')}</span>
      <ul
        aria-hidden="true"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <li
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <Skeleton className="h-36 w-full rounded-none" />
            <div className="space-y-4 p-5 sm:p-6">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-8 h-4 w-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VehicleInformationSkeleton() {
  return (
    <div aria-hidden="true" className="flex min-w-0 items-center gap-4">
      <Skeleton className="h-24 w-36 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-40 max-w-full" />
        <Skeleton className="h-4 w-56 max-w-full" />
      </div>
    </div>
  );
}

export function DocumentGridSkeleton() {
  return (
    <ol
      aria-hidden="true"
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <li
          key={index}
          className="flex min-h-36 flex-col justify-between gap-5 rounded-xl border bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="size-12 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </li>
      ))}
    </ol>
  );
}
