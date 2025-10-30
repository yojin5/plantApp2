import { PlantZone, PlantZoneDTO } from '../types/PlantTypes';
import { PlantZoneEntity } from '../entities/PlantZone';
import { PlantZoneRepository } from '../repositories/PlantZoneRepository';
import { PlantRepository } from '../repositories/PlantRepository';
import { WeatherController } from './WeatherController';
import { validateZoneName, validateSurfaceArea } from '../utils/validators';
import { calculateZoneWaterNeeds, calculateWaterDeficit } from '../utils/rainfallCalculator';

export class PlantZoneController {
  private zoneRepository: PlantZoneRepository;
  private plantRepository: PlantRepository;
  private weatherController: WeatherController;

  constructor() {
    this.zoneRepository = new PlantZoneRepository();
    this.plantRepository = new PlantRepository();
    this.weatherController = new WeatherController();
  }

  async createZone(
    zoneData: PlantZoneDTO,
    ownerId: string,
    location: { city: string; state: string; latitude: number; longitude: number }
  ): Promise<{ success: boolean; zone?: PlantZone; error?: string }> {
    try {
      if (!validateZoneName(zoneData.name)) {
        return { success: false, error: 'Zone name is required' };
      }

      if (!validateSurfaceArea(zoneData.surfaceAreaM2)) {
        return { success: false, error: 'Invalid surface area' };
      }

      const zoneEntity = new PlantZoneEntity({
        name: zoneData.name,
        ownerId,
        location,
        surfaceAreaM2: zoneData.surfaceAreaM2,
        exposureType: zoneData.exposureType,
        coverType: zoneData.coverType,
        soilType: zoneData.soilType
      });

      const savedZone = await this.zoneRepository.save(zoneEntity);

      return { success: true, zone: savedZone };
    } catch (error) {
      console.error('Create zone error:', error);
      return { success: false, error: 'Failed to create zone' };
    }
  }

  async getUserZones(userId: string): Promise<PlantZone[]> {
    return await this.zoneRepository.findByOwner(userId);
  }

  async getZone(zoneId: string): Promise<PlantZone | null> {
    return await this.zoneRepository.findById(zoneId);
  }

  async calculateZoneWaterNeeds(zoneId: string): Promise<{
    totalNeedsLiters: number;
    collectedLiters: number;
    deficit: number;
    plantCount: number;
  } | null> {
    try {
      const zone = await this.zoneRepository.findById(zoneId);
      if (!zone) return null;

      const plants = await this.plantRepository.findByZone(zoneId);
      const forecast = await this.weatherController.getForecast(
        { latitude: zone.location.latitude, longitude: zone.location.longitude },
        7
      );

      const totalRainfall = this.weatherController.getTotalRainfall(forecast);
      const zoneEntity = new PlantZoneEntity(zone);
      const collection = zoneEntity.calculateRainfallCollection(totalRainfall);
      
      const totalNeeds = calculateZoneWaterNeeds(plants, 1000);
      const deficit = calculateWaterDeficit(totalNeeds / 1000, collection.collectedLiters);

      return {
        totalNeedsLiters: totalNeeds / 1000,
        collectedLiters: collection.collectedLiters,
        deficit,
        plantCount: plants.length
      };
    } catch (error) {
      console.error('Calculate zone water needs error:', error);
      return null;
    }
  }
}