import { PlantZone } from '../types/PlantTypes';
import { ExposureType } from '../enums/ExposureType';
import { CoverType } from '../enums/CoverType';
import { calculateRainfallCollection, RainfallCollection } from '../utils/rainfallCalculator';

export class PlantZoneEntity implements PlantZone {
  zoneId: string;
  name: string;
  ownerId: string;
  location: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  surfaceAreaM2: number;
  exposureType: string;
  coverType: string;
  soilType?: string;
  plantIds: string[];
  createdAt: Date;

  constructor(data: Partial<PlantZone>) {
    this.zoneId = data.zoneId || `zone_${Date.now()}`;
    this.name = data.name || '';
    this.ownerId = data.ownerId || '';
    this.location = data.location || { city: '', state: '', latitude: 0, longitude: 0 };
    this.surfaceAreaM2 = data.surfaceAreaM2 || 0;
    this.exposureType = data.exposureType || ExposureType.FULL_SUN;
    this.coverType = data.coverType || CoverType.UNCOVERED;
    this.soilType = data.soilType;
    this.plantIds = data.plantIds || [];
    this.createdAt = data.createdAt || new Date();
  }

  addPlant(plantId: string): void {
    if (!this.plantIds.includes(plantId)) {
      this.plantIds.push(plantId);
    }
  }

  removePlant(plantId: string): void {
    this.plantIds = this.plantIds.filter(id => id !== plantId);
  }

  calculateRainfallCollection(rainfallMm: number): RainfallCollection {
    return calculateRainfallCollection(this.surfaceAreaM2, rainfallMm, this.coverType);
  }

  toJSON(): PlantZone {
    return {
      zoneId: this.zoneId,
      name: this.name,
      ownerId: this.ownerId,
      location: this.location,
      surfaceAreaM2: this.surfaceAreaM2,
      exposureType: this.exposureType,
      coverType: this.coverType,
      soilType: this.soilType,
      plantIds: this.plantIds,
      createdAt: this.createdAt
    };
  }
}