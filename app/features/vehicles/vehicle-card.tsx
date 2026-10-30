import type { Vehicle } from './vehicle-types';
import { useTranslation } from 'react-i18next';

type VehicleCardProps = {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
};

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => onSelect(vehicle)}
      className="group flex w-full min-h-40 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-left shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <span className="flex h-36 w-full shrink-0 items-center justify-center bg-slate-50 px-4 py-3">
        <img
          src={vehicle.image}
          alt=""
          loading="lazy"
          className="size-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="mt-2 line-clamp-1 border-b-2 pb-2 text-base font-semibold tracking-wide text-slate-700">
          {vehicle.vehicle_name}
        </span>
        <span className="mt-4 flex items-center gap-2 text-sm text-slate-700">
          VIN:{' '}
          <span className="block break-all font-mono text-sm leading-6 text-slate-900">
            {vehicle.vin}
          </span>
        </span>

        <span className="mt-auto flex w-full items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
          <span>{t('documents.view')}</span>
          <span
            aria-hidden="true"
            className="text-lg transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </span>
    </button>
  );
}
