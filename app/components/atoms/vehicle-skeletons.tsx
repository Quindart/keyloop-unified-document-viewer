import { Skeleton } from '~/components/ui/skeleton';

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
