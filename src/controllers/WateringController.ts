import { Plant, WateringSchedule } from '../types/PlantTypes';
import { PlantEntity } from '../entities/Plant';
import { PlantRepository } from '../repositories/PlantRepository';
import { WeatherService } from '../services/WeatherService';
import { NotificationService } from '../services/NotificationService';
import { generateWateringSchedule, shouldSkipWatering } from '../utils/wateringCalculator';

export class WateringController {
  private plantRepository: PlantRepository;
  private weatherService: WeatherService;
  private notificationService: NotificationService;

  constructor() {
    this.plantRepository = new PlantRepository();
    this.weatherService = WeatherService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  async waterPlant(plantId: string): Promise<{ success: boolean; plant?: Plant; error?: string }> {
    try {
      const plant = await this.plantRepository.findById(plantId);
      if (!plant) {
        return { success: false, error: 'Plant not found' };
      }

      const plantEntity = new PlantEntity(plant);
      plantEntity.water();

      const savedPlant = await this.plantRepository.save(plantEntity);

      // Schedule next watering notification
      await this.notificationService.scheduleWateringReminder(
        savedPlant.name,
        savedPlant.nextWateringDate
      );

      return { success: true, plant: savedPlant };
    } catch (error) {
      console.error('Water plant error:', error);
      return { success: false, error: 'Failed to water plant' };
    }
  }

  async getWateringSchedule(userId: string, location: { latitude: number; longitude: number }): Promise<WateringSchedule[]> {
    try {
      const plants = await this.plantRepository.findByOwner(userId);
      const forecast = await this.weatherService.getForecast(location, 3);

      return generateWateringSchedule(plants, forecast);
    } catch (error) {
      console.error('Get watering schedule error:', error);
      return [];
    }
  }

  async checkWateringAlerts(userId: string): Promise<Plant[]> {
    try {
      const plants = await this.plantRepository.findByOwner(userId);
      const plantsNeedingWater = plants.filter(plant => {
        const plantEntity = new PlantEntity(plant);
        return plantEntity.needsWatering();
      });

      return plantsNeedingWater;
    } catch (error) {
      console.error('Check watering alerts error:', error);
      return [];
    }
  }
}