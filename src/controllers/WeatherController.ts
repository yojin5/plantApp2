import { WeatherService, WeatherData } from '../services/WeatherService';

export class WeatherController {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = WeatherService.getInstance();
  }

  async getForecast(location: { latitude: number; longitude: number }, days: number = 3): Promise<WeatherData[]> {
    try {
      return await this.weatherService.getForecast(location, days);
    } catch (error) {
      console.error('Get forecast error:', error);
      return [];
    }
  }

  async getCurrentWeather(location: { latitude: number; longitude: number }): Promise<WeatherData | null> {
    try {
      return await this.weatherService.getCurrentWeather(location);
    } catch (error) {
      console.error('Get current weather error:', error);
      return null;
    }
  }

  getTotalRainfall(forecast: WeatherData[]): number {
    return forecast.reduce((total, day) => total + day.rainfall, 0);
  }
}