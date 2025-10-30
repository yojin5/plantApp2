import { HealthStatus } from '../enums/HealthStatus';

export interface Plant {
  plantId: string;
  name: string;
  plantType: string;
  ownerId: string;
  zoneId?: string;
  lastWatered: Date;
  nextWateringDate: Date;
  wateringFrequencyDays: number;
  imageUrl?: string;
  healthStatus: HealthStatus;
  notes?: string;
  createdAt: Date;
}

export interface PlantDTO {
  name: string;
  plantType: string;
  wateringFrequencyDays: number;
  zoneId?: string;
  notes?: string;
}

export interface WateringSchedule {
  plantId: string;
  plantName: string;
  nextWateringDate: Date;
  daysUntilWatering: number;
  shouldSkip: boolean;
  reason?: string;
}

export interface PlantZone {
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
}

export interface PlantZoneDTO {
  name: string;
  surfaceAreaM2: number;
  exposureType: string;
  coverType: string;
  soilType?: string;
}

export interface WateringRecord {
  recordId: string;
  plantId: string;
  wateredAt: Date;
  waterAmountMl: number;
  wateredBy: string;
  method: string;
  notes?: string;
}