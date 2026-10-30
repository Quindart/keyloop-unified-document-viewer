import vehicleData from '~/mock/data.json';

export type Vehicle = {
  vin: string;
  vehicle_name: string;
  image: string;
  documents: VehicleDocument[];
};

export type VehicleDocument = {
  id: string;
  name: string;
  date: string;
  file_url: string;
  type: string;
  source: 'Sales' | 'Service';
  format: 'PDF' | 'DOCX' | 'XLS';
};

type VehicleMockData = {
  vehicles: Vehicle[];
};

export const vehicleMockData = vehicleData as VehicleMockData;
