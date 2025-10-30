import { Plant, PlantDTO } from '../types/PlantTypes';
import { PlantEntity } from '../entities/Plant';
import { PlantRepository } from '../repositories/PlantRepository';
import { PlantZoneRepository } from '../repositories/PlantZoneRepository';
import { WateringController } from './WateringController';
import { validatePlantName, validateWateringFrequency } from '../utils/validators';

export class PlantManagementController {
  private plantRepository: PlantRepository;
  private zoneRepository: PlantZoneRepository;
  private wateringController: WateringController;

  constructor() {
    this.plantRepository = new PlantRepository();
    this.zoneRepository = new PlantZoneRepository();
    this.wateringController = new WateringController();
  }

  async createPlant(plantData: PlantDTO, ownerId: string): Promise<{ success: boolean; plant?: Plant; error?: string }> {
    try {
      if (!validatePlantName(plantData.name)) {
        return { success: false, error: 'Plant name is required' };
      }

      if (!validateWateringFrequency(plantData.wateringFrequencyDays)) {
        return { success: false, error: 'Invalid watering frequency' };
      }

      const plantEntity = new PlantEntity({
        name: plantData.name,
        plantType: plantData.plantType,
        ownerId,
        wateringFrequencyDays: plantData.wateringFrequencyDays,
        zoneId: plantData.zoneId,
        notes: plantData.notes,
        lastWatered: new Date()
      });

      // Calculate initial watering schedule
      plantEntity.calculateNextWatering();

      const savedPlant = await this.plantRepository.save(plantEntity);

      // If plant is assigned to a zone, add it to the zone
      if (plantData.zoneId) {
        const zone = await this.zoneRepository.findById(plantData.zoneId);
        if (zone) {
          const zoneEntity = new (await import('../entities/PlantZone')).PlantZoneEntity(zone);
          zoneEntity.addPlant(savedPlant.plantId);
          await this.zoneRepository.save(zoneEntity);
        }
      }

      return { success: true, plant: savedPlant };
    } catch (error) {
      console.error('Create plant error:', error);
      return { success: false, error: 'Failed to create plant' };
    }
  }

  async updatePlant(plantId: string, updates: Partial<Plant>): Promise<{ success: boolean; plant?: Plant; error?: string }> {
    try {
      const plant = await this.plantRepository.findById(plantId);
      if (!plant) {
        return { success: false, error: 'Plant not found' };
      }

      const plantEntity = new PlantEntity({ ...plant, ...updates });
      const savedPlant = await this.plantRepository.save(plantEntity);

      return { success: true, plant: savedPlant };
    } catch (error) {
      console.error('Update plant error:', error);
      return { success: false, error: 'Failed to update plant' };
    }
  }

  async deletePlant(plantId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.plantRepository.delete(plantId);
      return { success: true };
    } catch (error) {
      console.error('Delete plant error:', error);
      return { success: false, error: 'Failed to delete plant' };
    }
  }

  async getUserPlants(userId: string): Promise<Plant[]> {
    return await this.plantRepository.findByOwner(userId);
  }

  async getPlant(plantId: string): Promise<Plant | null> {
    return await this.plantRepository.findById(plantId);
  }
}