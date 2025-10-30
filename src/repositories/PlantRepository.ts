import { Plant } from '../types/PlantTypes';
import { PlantEntity } from '../entities/Plant';
import { StorageService } from '../services/StorageService';
import { STORAGE_KEYS } from '../utils/constants';

export class PlantRepository {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async save(plant: PlantEntity): Promise<Plant> {
    const plants = await this.findAll();
    const index = plants.findIndex(p => p.plantId === plant.plantId);
    
    if (index >= 0) {
      plants[index] = plant.toJSON();
    } else {
      plants.push(plant.toJSON());
    }
    
    await this.storageService.save(STORAGE_KEYS.PLANTS, plants);
    return plant.toJSON();
  }

  async findById(plantId: string): Promise<Plant | null> {
    const plants = await this.findAll();
    return plants.find(p => p.plantId === plantId) || null;
  }

  async findByOwner(ownerId: string): Promise<Plant[]> {
    const plants = await this.findAll();
    return plants.filter(p => p.ownerId === ownerId);
  }

  async findByZone(zoneId: string): Promise<Plant[]> {
    const plants = await this.findAll();
    return plants.filter(p => p.zoneId === zoneId);
  }

  async findAll(): Promise<Plant[]> {
    const plants = await this.storageService.get<Plant[]>(STORAGE_KEYS.PLANTS);
    return plants || [];
  }

  async delete(plantId: string): Promise<void> {
    const plants = await this.findAll();
    const filtered = plants.filter(p => p.plantId !== plantId);
    await this.storageService.save(STORAGE_KEYS.PLANTS, filtered);
  }
}