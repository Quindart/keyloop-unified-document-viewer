import salesData from '~/mock/sales-documents.json';
import serviceData from '~/mock/service-documents.json';
import type { VehicleDocument } from './vehicle-types';

type MockDocumentResponse = Omit<VehicleDocument, 'source'> & { vin: string };

const salesDocuments = salesData.documents as MockDocumentResponse[];
const serviceDocuments = serviceData.documents as MockDocumentResponse[];

function simulateNetworkDelay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function getSalesDocumentsByVin(
  vin: string,
): Promise<VehicleDocument[]> {
  await simulateNetworkDelay(350);
  return salesDocuments
    .filter((document) => document.vin === vin)
    .map(({ vin: _vin, ...document }) => ({
      ...document,
      source: 'Sales' as const,
    }));
}

export async function getServiceDocumentsByVin(
  vin: string,
): Promise<VehicleDocument[]> {
  await simulateNetworkDelay(650);
  return serviceDocuments
    .filter((document) => document.vin === vin)
    .map(({ vin: _vin, ...document }) => ({
      ...document,
      source: 'Service' as const,
    }));
}
