import { useState, type FormEvent } from 'react';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { VehicleCard } from '~/features/vehicles/vehicle-card';
import { getVehicleImage } from '~/features/vehicles/vehicle-images';
import {
  DocumentCard,
  type VehicleDocument,
} from '~/features/vehicles/document-card';
import { DocumentPreviewSheet } from '~/features/vehicles/document-preview-sheet';

const vinStartingCharacters = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ';
const mockVinsPerStartingCharacter = 7;
const generatedVehicleVins = Array.from(vinStartingCharacters).flatMap(
  (firstCharacter, characterIndex) =>
    Array.from({ length: mockVinsPerStartingCharacter }, (_, sequenceIndex) => {
      const serial = String(
        characterIndex * mockVinsPerStartingCharacter + sequenceIndex + 1,
      ).padStart(7, '0');
      return `${firstCharacter}HGCM82633${serial}`;
    }),
);
const vehicleVins = [
  '1HGCM82633A004352',
  '1FTFW1E50NFA12345',
  'WBA3A5C50DF123456',
  'JHMCM56557C404453',
  '5YJ3E1EA7KF317890',
  'WVWZZZ1JZXW000001',
  ...generatedVehicleVins,
];

const salesDocuments: VehicleDocument[] = [
  {
    id: 's1',
    title: 'Purchase Agreement',
    type: 'Contract',
    date: '2025-03-12T10:30:00Z',
    source: 'Sales',
    format: 'PDF',
  },
  {
    id: 's2',
    title: 'Deposit Receipt',
    type: 'Receipt',
    date: '2025-03-10T08:15:00Z',
    source: 'Sales',
    format: 'PDF',
  },
  {
    id: 's3',
    title: 'Payment Invoice',
    type: 'Invoice',
    date: '2025-03-12T09:00:00Z',
    source: 'Sales',
    format: 'DOCX',
  },
];
const serviceDocuments: VehicleDocument[] = [
  {
    id: 'v1',
    title: 'Pre-Delivery Inspection',
    type: 'Inspection',
    date: '2025-03-13T11:00:00Z',
    source: 'Service',
    format: 'PDF',
  },
  {
    id: 'v2',
    title: 'Workshop Repair Schedule',
    type: 'Repair',
    date: '2025-02-20T14:00:00Z',
    source: 'Service',
    format: 'DOCX',
  },
  {
    id: 'v3',
    title: 'Maintenance History',
    type: 'Maintenance',
    date: '2025-01-18T09:30:00Z',
    source: 'Service',
    format: 'XLS',
  },
];

async function fetchSalesDocuments(_vin: string) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return salesDocuments;
}
async function fetchServiceDocuments(_vin: string) {
  await new Promise((resolve) => setTimeout(resolve, 650));
  return serviceDocuments;
}

export function meta() {
  return [{ title: 'Unified Document Viewer' }];
}
export const handle = { breadcrumbKey: 'home.label' };

export default function Home() {
  const { t } = useTranslation();
  const [vin, setVin] = useState('');
  const [previousVehicleQuery, setPreviousVehicleQuery] = useState('');
  const [searchedVin, setSearchedVin] = useState('');
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<VehicleDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sourceErrors, setSourceErrors] = useState<string[]>([]);
  const [showVehicleResults, setShowVehicleResults] = useState(false);
  const [currentVehiclePage, setCurrentVehiclePage] = useState(1);
  const [vehiclesPerPage, setVehiclesPerPage] = useState(5);
  const suggestions =
    vin.length > 0
      ? vehicleVins.filter((item) => item.startsWith(vin.trim().toUpperCase()))
      : [];
  const pageCount = Math.max(
    1,
    Math.ceil(suggestions.length / vehiclesPerPage),
  );
  const firstVehicleIndex = (currentVehiclePage - 1) * vehiclesPerPage;
  const visibleSuggestions = suggestions.slice(
    firstVehicleIndex,
    firstVehicleIndex + vehiclesPerPage,
  );
  const isDocumentView = Boolean(searchedVin && !loading && !error);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentVehiclePage(1);
    const normalizedVin = vin.trim().toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalizedVin)) {
      setError('Enter a valid 17-character VIN.');
      setDocuments([]);
      setSearchedVin('');
      return;
    }
    setError('');
    setSourceErrors([]);
    setDocuments([]);
    setSelectedDocument(null);
    setSearchedVin('');
    setShowVehicleResults(true);
  }

  async function selectVehicle(normalizedVin: string) {
    setPreviousVehicleQuery(vin.trim());
    setVin(normalizedVin);
    setShowVehicleResults(false);
    setError('');
    setSourceErrors([]);
    setSelectedDocument(null);
    setLoading(true);
    setSearchedVin(normalizedVin);
    const results = await Promise.allSettled([
      fetchSalesDocuments(normalizedVin),
      fetchServiceDocuments(normalizedVin),
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
    if (failures.length === 2)
      setError('Both systems are unavailable. Please try again.');
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
          Unified Document Viewer
        </h1>
        <p className="max-w-2xl text-slate-600">
          Search a vehicle to see its sales and service documents together.
        </p>
      </header>
      {!isDocumentView && (
        <form
          onSubmit={search}
          className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:p-5"
        >
          <label className="sr-only" htmlFor="vin">
            Vehicle Identification Number
          </label>
          <div className="relative flex-1">
            <Input
              id="vin"
              value={vin}
              disabled={loading}
              onChange={(event) => {
                setVin(event.target.value.toUpperCase());
                setCurrentVehiclePage(1);
                setShowVehicleResults(true);
                setSearchedVin('');
                setDocuments([]);
                setSelectedDocument(null);
                setError('');
              }}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              autoComplete="off"
              className="h-11 w-full font-mono uppercase"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11 gap-2">
            <Search className="size-4" />
            {loading ? 'Searching…' : 'Search'}
          </Button>
        </form>
      )}
      {showVehicleResults && vin.trim().length > 0 && (
        <div className="mt-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Matching vehicles{' '}
            <span className="text-sm font-normal text-slate-500">
              ({suggestions.length})
            </span>
          </h2>
          {suggestions.length === 0 ? (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">
              No vehicles match this VIN. Try another search.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p aria-live="polite" className="text-sm text-slate-500">
                  Showing {firstVehicleIndex + 1}–
                  {Math.min(
                    firstVehicleIndex + vehiclesPerPage,
                    suggestions.length,
                  )}{' '}
                  of {suggestions.length} vehicles
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="vehicles-per-page"
                    className="text-sm text-slate-600"
                  >
                    Per page
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
                    aria-label="Vehicle result pages"
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
                      Previous
                    </Button>
                    <span
                      aria-live="polite"
                      className="min-w-20 text-center text-sm text-slate-600"
                    >
                      Page {currentVehiclePage} of {pageCount}
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
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {visibleSuggestions.map((suggestion, index) => (
                  <li key={suggestion} className="w-full min-w-0">
                    <VehicleCard
                      vin={suggestion}
                      index={firstVehicleIndex + index}
                      onSelect={(selectedVin) =>
                        void selectVehicle(selectedVin)
                      }
                    />
                  </li>
                ))}
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
          {error}
        </p>
      )}
      {sourceErrors.length > 0 && sourceErrors.length < 2 && (
        <p role="status" className="text-sm text-amber-700">
          {sourceErrors.join(', ')} System is unavailable; showing available
          documents.
        </p>
      )}
      {loading && (
        <p role="status" className="text-sm text-slate-500">
          Loading documents from Sales and Service…
        </p>
      )}
      {searchedVin && !loading && !error && (
        <div className="mt-10 w-full">
          <div className="mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center ">
              <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl p-2">
                <img
                  src={getVehicleImage(searchedVin)}
                  alt=""
                  className="size-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Documents for</p>
                <h2 className="break-all font-mono text-lg font-semibold">
                  {searchedVin}
                </h2>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-sm text-slate-500">
                {documents.length} documents
              </span>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={goBackToVehicleResults}
              >
                <ArrowLeft />
                Go back
              </Button>
            </div>
          </div>
          {documents.length === 0 ? (
            <p className="rounded-xl border border-dashed py-10 text-center text-slate-500">
              No documents found for this vehicle.
            </p>
          ) : (
            <ol className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onSelect={setSelectedDocument}
                />
              ))}
            </ol>
          )}
        </div>
      )}
      {!searchedVin && !error && !showVehicleResults && (
        <div className="rounded-xl border border-dashed bg-slate-50/60 px-6 py-14 text-center">
          <Search className="mx-auto size-8 text-slate-400" />
          <p className="mt-3 font-medium text-slate-700">
            Start with a VIN search
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Matching vehicles will appear here.
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
