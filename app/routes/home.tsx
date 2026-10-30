import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Search, AlertCircle, CarFront } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '~/i18n/i18n';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';
import { AnimatePresence } from 'motion/react';
import {
  DocumentGridSkeleton,
  VehicleGridSkeleton,
  VehicleInformationSkeleton,
} from '~/components/atoms/vehicle-skeletons';
import { AnimatedListItem } from '~/components/atoms/animated-list-item';
import { VehicleCard } from '~/features/vehicles/vehicle-card';
import { DocumentCard } from '~/features/vehicles/document-card';
import { DocumentPreviewSheet } from '~/features/vehicles/document-preview-sheet';
import {
  vehicleMockData,
  type Vehicle,
  type VehicleDocument,
} from '~/features/vehicles/vehicle-types';

const mockVehicles = vehicleMockData.vehicles;

async function fetchSalesDocuments(vehicle: Vehicle) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return vehicle.documents.filter((document) => document.source === 'Sales');
}
async function fetchServiceDocuments(vehicle: Vehicle) {
  await new Promise((resolve) => setTimeout(resolve, 650));
  return vehicle.documents.filter((document) => document.source === 'Service');
}

export function meta() {
  return [{ title: i18n.t('home.title') }];
}
export const handle = { breadcrumbKey: 'home.label' };

export default function Home() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('home.title');
  }, [t]);
  const [vin, setVin] = useState('');
  const [previousVehicleQuery, setPreviousVehicleQuery] = useState('');
  const [searchedVin, setSearchedVin] = useState('');
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<VehicleDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [sourceErrors, setSourceErrors] = useState<string[]>([]);
  const [showVehicleResults, setShowVehicleResults] = useState(false);
  const [currentVehiclePage, setCurrentVehiclePage] = useState(1);
  const [vehiclesPerPage, setVehiclesPerPage] = useState(5);
  const suggestions =
    vin.length > 0
      ? mockVehicles.filter((vehicle) =>
          vehicle.vin.startsWith(vin.trim().toUpperCase()),
        )
      : [];
  const selectedVehicle = mockVehicles.find(
    (vehicle) => vehicle.vin === searchedVin,
  );
  const pageCount = Math.max(
    1,
    Math.ceil(suggestions.length / vehiclesPerPage),
  );
  const firstVehicleIndex = (currentVehiclePage - 1) * vehiclesPerPage;
  const visibleSuggestions = suggestions.slice(
    firstVehicleIndex,
    firstVehicleIndex + vehiclesPerPage,
  );
  const isDocumentView = Boolean(searchedVin && !error);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentVehiclePage(1);
    const normalizedVin = vin.trim().toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalizedVin)) {
      setSearching(false);
      setError('home.invalidVin');
      setDocuments([]);
      setSearchedVin('');
      return;
    }
    setError('');
    setSourceErrors([]);
    setDocuments([]);
    setSelectedDocument(null);
    setSearchedVin('');
    setShowVehicleResults(false);
    setSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setSearching(false);
    setShowVehicleResults(true);
  }

  async function selectVehicle(vehicle: Vehicle) {
    const normalizedVin = vehicle.vin;
    setPreviousVehicleQuery(vin.trim());
    setVin(normalizedVin);
    setShowVehicleResults(false);
    setError('');
    setSourceErrors([]);
    setSelectedDocument(null);
    setLoading(true);
    setSearchedVin(normalizedVin);
    const results = await Promise.allSettled([
      fetchSalesDocuments(vehicle),
      fetchServiceDocuments(vehicle),
    ]);
    const next: VehicleDocument[] = [];
    const failures: string[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') next.push(...result.value);
      else failures.push(index === 0 ? 'Sales' : 'Service');
    });
    next.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    setDocuments(next);
    setSourceErrors(failures);
    setLoading(false);
    if (failures.length === 2) setError('home.systemsUnavailable');
  }

  function goBackToVehicleResults() {
    setVin(previousVehicleQuery);
    setShowVehicleResults(true);
    setSearchedVin('');
    setDocuments([]);
    setSelectedDocument(null);
    setSourceErrors([]);
    setError('');
  }

  return (
    <section
      aria-label={t('home.label')}
      className="mx-auto w-full max-w-330 flex-1 space-y-8"
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t('home.title')}
        </h1>
        <p className="max-w-2xl text-slate-600">{t('home.description')}</p>
      </header>
      {!isDocumentView && (
        <form
          onSubmit={search}
          className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:p-5"
        >
          <label className="sr-only" htmlFor="vin">
            {t('home.vinLabel')}
          </label>
          <div className="relative flex-1">
            <Input
              id="vin"
              value={vin}
              disabled={loading || searching}
              onChange={(event) => {
                setVin(event.target.value.toUpperCase());
                setCurrentVehiclePage(1);
                setSearching(false);
                setShowVehicleResults(true);
                setSearchedVin('');
                setDocuments([]);
                setSelectedDocument(null);
                setError('');
              }}
              placeholder={t('home.vinPlaceholder')}
              maxLength={17}
              autoComplete="off"
              className="h-11 w-full font-mono uppercase"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || searching}
            className="h-11 gap-2"
          >
            <Search className="size-4" />
            {searching ? t('home.searching') : t('home.search')}
          </Button>
        </form>
      )}
      {searching && <VehicleGridSkeleton />}
      {!searching && showVehicleResults && vin.trim().length > 0 && (
        <div className="mt-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {t('home.matchingVehicles')}{' '}
            <span className="text-sm font-normal text-slate-500">
              ({suggestions.length})
            </span>
          </h2>
          {suggestions.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <CarFront
                aria-hidden="true"
                className="mx-auto mb-3 size-8 text-slate-400"
              />
              <p className="text-sm text-slate-500">{t('home.noVehicles')}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p aria-live="polite" className="text-sm text-slate-500">
                  {t('home.showingVehicles', {
                    from: firstVehicleIndex + 1,
                    to: Math.min(
                      firstVehicleIndex + vehiclesPerPage,
                      suggestions.length,
                    ),
                    count: suggestions.length,
                  })}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="vehicles-per-page"
                    className="text-sm text-slate-600"
                  >
                    {t('home.perPage')}
                  </label>
                  <select
                    id="vehicles-per-page"
                    value={vehiclesPerPage}
                    onChange={(event) => {
                      setVehiclesPerPage(Number(event.target.value));
                      setCurrentVehiclePage(1);
                    }}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {[5, 10, 15, 20].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                  <nav
                    aria-label={t('home.resultPages')}
                    className="flex items-center gap-2"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentVehiclePage === 1}
                      onClick={() =>
                        setCurrentVehiclePage((page) => Math.max(1, page - 1))
                      }
                    >
                      {t('home.previous')}
                    </Button>
                    <span
                      aria-live="polite"
                      className="min-w-20 text-center text-sm text-slate-600"
                    >
                      {t('home.pageOf', {
                        page: currentVehiclePage,
                        count: pageCount,
                      })}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentVehiclePage >= pageCount}
                      onClick={() =>
                        setCurrentVehiclePage((page) =>
                          Math.min(pageCount, page + 1),
                        )
                      }
                    >
                      {t('home.next')}
                    </Button>
                  </nav>
                </div>
              </div>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence>
                  {visibleSuggestions.map((suggestion, index) => (
                    <AnimatedListItem
                      key={suggestion.vin}
                      index={index}
                      className="w-full min-w-0"
                    >
                      <VehicleCard
                        vehicle={suggestion}
                        onSelect={(selectedVehicle) =>
                          void selectVehicle(selectedVehicle)
                        }
                      />
                    </AnimatedListItem>
                  ))}
                </AnimatePresence>
              </ul>
            </>
          )}
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 text-sm text-red-700"
        >
          <AlertCircle className="size-4" />
          {t(error)}
        </p>
      )}
      {sourceErrors.length > 0 && sourceErrors.length < 2 && (
        <p role="status" className="text-sm text-amber-700">
          {t('home.partialFailure', {
            sources: sourceErrors
              .map((source) =>
                t(
                  source === 'Sales'
                    ? 'documents.sourceSales'
                    : 'documents.sourceService',
                ),
              )
              .join(', '),
          })}
        </p>
      )}
      {loading && searchedVin && (
        <div
          role="status"
          aria-label={t('home.loadingDocuments')}
          className="mt-10 w-full"
        >
          <span className="sr-only">{t('home.loadingDocuments')}</span>
          <div className="mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <VehicleInformationSkeleton />
            <div aria-hidden="true" className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
          <DocumentGridSkeleton />
        </div>
      )}
      {searchedVin && !loading && !error && (
        <div className="mt-10 w-full">
          <div className="mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center ">
              <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl p-2">
                <img
                  src={selectedVehicle?.image ?? '/images/cars/car-1.png'}
                  alt=""
                  className="size-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">
                  {t('home.documentsFor')}
                </p>
                <h2 className="text-lg font-semibold">
                  {selectedVehicle?.vehicle_name ?? t('home.vehicle')}
                </h2>
                <p className="break-all font-mono text-sm text-slate-600">
                  {searchedVin}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-sm text-slate-500">
                {t('home.documentCount', { count: documents.length })}
              </span>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={goBackToVehicleResults}
              >
                <ArrowLeft />
                {t('home.goBack')}
              </Button>
            </div>
          </div>
          {documents.length === 0 ? (
            <p className="rounded-xl border border-dashed py-10 text-center text-slate-500">
              {t('home.noDocuments')}
            </p>
          ) : (
            <ol className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
              <AnimatePresence>
                {documents.map((document, index) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    index={index}
                    onSelect={setSelectedDocument}
                  />
                ))}
              </AnimatePresence>
            </ol>
          )}
        </div>
      )}
      {!searchedVin && !error && !showVehicleResults && !searching && (
        <div className="rounded-xl border border-dashed bg-slate-50/60 px-6 py-14 text-center">
          <CarFront className="mx-auto size-8 text-slate-400" />
          <p className="mt-3 font-medium text-slate-700">
            {t('home.startSearch')}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {t('home.matchingVehiclesWillAppear')}
          </p>
        </div>
      )}
      <DocumentPreviewSheet
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </section>
  );
}
