const vehicleImages = [
  '/images/cars/car-1.png',
  '/images/cars/car-2.png',
  '/images/cars/car-3.png',
  '/images/cars/car-4.png',
  '/images/cars/car-5.png',
  '/images/cars/car-6.png',
  '/images/cars/car-7.png',
  '/images/cars/car-8.webp',
  '/images/cars/car-9.webp',
  '/images/cars/car-10.png',
] as const;

export function getVehicleImage(vin: string) {
  let hash = 0;
  for (const character of vin) {
    hash = Math.imul(hash, 31) + character.charCodeAt(0);
  }
  return vehicleImages[(hash >>> 0) % vehicleImages.length];
}
