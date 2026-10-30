import { getVehicleImage } from './vehicle-images';

type VehicleCardProps = {
  vin: string;
  index: number;
  onSelect: (vin: string) => void;
};

export function VehicleCard({ vin, index, onSelect }: VehicleCardProps) {
  const image = getVehicleImage(vin);

  return (
    <button
      type="button"
      onClick={() => onSelect(vin)}
      className="group flex w-full min-h-40 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <span className="flex h-36 w-full shrink-0 items-center justify-center bg-slate-50 px-4 py-3">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="size-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="inline-flex mt-2 items-center gap-2 border-b-2 pb-2 text-[16px] font-semibold tracking-wide text-slate-600">
          Vehicle {String(index + 1).padStart(2, '0')}
        </span>
        <span className="mt-4 gap-2 items-center flex text-sm  text-slate-700">
          VIN:{' '}
          <span className=" block break-all font-mono text-sm leading-6 text-slate-900">
            {vin}
          </span>
        </span>

        <span className="mt-auto flex w-full items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
          <span>View documents</span>
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
