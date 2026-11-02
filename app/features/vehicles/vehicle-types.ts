import vehicleData from '~/mock/vehicles.json';

export type Vehicle = {
  vin: string;
  vehicle_name: string;
  image: string;
};

export type VehicleDocument = {
  id: string;
  name: string;
  date: string;
  file_url: string;
  type: string;
  source: VehicleDocumentSource;
  format: 'PDF' | 'DOCX' | 'XLS';
};

export type VehicleDocumentSource = 'Sales' | 'Service';

type VehicleMockData = {
  vehicles: Vehicle[];
};

export const vehicleMockData = vehicleData as VehicleMockData;
