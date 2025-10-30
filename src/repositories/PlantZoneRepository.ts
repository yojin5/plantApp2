import { PlantZone } from '../types/PlantTypes';
import { PlantZoneEntity } from '../entities/PlantZone';
import { StorageService } from '../services/StorageService';
import { STORAGE_KEYS } from '../utils/constants';

export class PlantZoneRepository {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async save(zone: PlantZoneEntity): Promise<PlantZone> {
    const zones = await this.findAll();
    const index = zones.findIndex(z => z.zoneId === zone.zoneId);
    
    if (index >= 0) {
      zones[index] = zone.toJSON();
    } else {
      zones.push(zone.toJSON());
    }
    
    await this.storageService.save(STORAGE_KEYS.ZONES, zones);
    return zone.toJSON();
  }

  async findById(zoneId: string): Promise<PlantZone | null> {
    const zones = await this.findAll();
    return zones.find(z => z.zoneId === zoneId) || null;
  }

  async findByOwner(ownerId: string): Promise<PlantZone[]> {
    const zones = await this.findAll();
    return zones.filter(z => z.ownerId === ownerId);
  }

  async findAll(): Promise<PlantZone[]> {
    const zones = await this.storageService.get<PlantZone[]>(STORAGE_KEYS.ZONES);
    return zones || [];
  }

  async delete(zoneId: string): Promise<void> {
    const zones = await this.findAll();
    const filtered = zones.filter(z => z.zoneId !== zoneId);
    await this.storageService.save(STORAGE_KEYS.ZONES, filtered);
  }
}