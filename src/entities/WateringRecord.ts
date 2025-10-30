import { WateringRecord } from '../types/PlantTypes';
import { WateringMethod } from '../enums/WateringMethod';

export class WateringRecordEntity implements WateringRecord {
  recordId: string;
  plantId: string;
  wateredAt: Date;
  waterAmountMl: number;
  wateredBy: string;
  method: string;
  notes?: string;

  constructor(data: Partial<WateringRecord>) {
    this.recordId = data.recordId || `record_${Date.now()}`;
    this.plantId = data.plantId || '';
    this.wateredAt = data.wateredAt || new Date();
    this.waterAmountMl = data.waterAmountMl || 1000;
    this.wateredBy = data.wateredBy || '';
    this.method = data.method || WateringMethod.MANUAL;
    this.notes = data.notes;
  }

  toJSON(): WateringRecord {
    return {
      recordId: this.recordId,
      plantId: this.plantId,
      wateredAt: this.wateredAt,
      waterAmountMl: this.waterAmountMl,
      wateredBy: this.wateredBy,
      method: this.method,
      notes: this.notes
    };
  }
}