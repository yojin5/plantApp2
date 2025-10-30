import { COVERAGE_FACTORS } from './constants';

export interface RainfallCollection {
  rainfallMm: number;
  surfaceAreaM2: number;
  coverageFactor: number;
  collectedLiters: number;
}

export const calculateRainfallCollection = (
  surfaceAreaM2: number,
  rainfallMm: number,
  coverType: string
): RainfallCollection => {
  const coverageFactor = getCoverageFactor(coverType);

  // Formula: Surface Area (m²) × Rainfall (mm) × Coverage Factor
  // 1mm of rain on 1m² = 1 liter
  const collectedLiters = surfaceAreaM2 * rainfallMm * coverageFactor;

  return {
    rainfallMm,
    surfaceAreaM2,
    coverageFactor,
    collectedLiters: parseFloat(collectedLiters.toFixed(2)),
  };
};

const getCoverageFactor = (coverType: string): number => {
  const normalized = coverType.toUpperCase().replace(/\s+/g, '_');
  return (COVERAGE_FACTORS as any)[normalized] || 1.0;
};

export const calculateZoneWaterNeeds = (
  plants: any[],
  plantWaterRequirementMl: number = 1000
): number => {
  // Default: 1L per plant if not specified
  return plants.reduce((total, plant) => {
    return total + (plant.waterRequirementMl || plantWaterRequirementMl);
  }, 0);
};

export const calculateWaterDeficit = (
  totalNeedsLiters: number,
  collectedLiters: number
): number => {
  const deficit = totalNeedsLiters - collectedLiters;
  return Math.max(0, deficit);
};

export const canSkipWatering = (
  collectedLiters: number,
  plantWaterNeedsLiters: number
): boolean => {
  return collectedLiters >= plantWaterNeedsLiters;
};

export const getTotalRainfall = (forecast: any[]): number => {
  return forecast.reduce((total, day) => total + (day.rainfall || 0), 0);
};