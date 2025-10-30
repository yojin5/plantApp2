import { Plant } from '../types/PlantTypes';
import { HealthStatus } from '../enums/HealthStatus';
import { calculateNextWateringDate } from '../utils/wateringCalculator';

export class PlantEntity implements Plant {
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

  constructor(data: Partial<Plant>) {
    this.plantId = data.plantId || `plant_${Date.now()}`;
    this.name = data.name || '';
    this.plantType = data.plantType || '';
    this.ownerId = data.ownerId || '';
    this.zoneId = data.zoneId;
    this.lastWatered = data.lastWatered || new Date();
    this.nextWateringDate = data.nextWateringDate || new Date();
    this.wateringFrequencyDays = data.wateringFrequencyDays || 7;
    this.imageUrl = data.imageUrl;
    this.healthStatus = data.healthStatus || HealthStatus.GOOD;
    this.notes = data.notes;
    this.createdAt = data.createdAt || new Date();
  }

  water(waterAmountMl: number = 0): void {
    this.lastWatered = new Date();
    this.calculateNextWatering();
  }

  calculateNextWatering(rainfallMm: number = 0): void {
    this.nextWateringDate = calculateNextWateringDate(
      this.lastWatered,
      this.wateringFrequencyDays,
      rainfallMm
    );
  }

  needsWatering(): boolean {
    return new Date() >= this.nextWateringDate;
  }

  getDaysUntilWatering(): number {
    const now = new Date();
    const diffTime = this.nextWateringDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  toJSON(): Plant {
    return {
      plantId: this.plantId,
      name: this.name,
      plantType: this.plantType,
      ownerId: this.ownerId,
      zoneId: this.zoneId,
      lastWatered: this.lastWatered,
      nextWateringDate: this.nextWateringDate,
      wateringFrequencyDays: this.wateringFrequencyDays,
      imageUrl: this.imageUrl,
      healthStatus: this.healthStatus,
      notes: this.notes,
      createdAt: this.createdAt
    };
  }
}