export interface WeatherData {
  date: Date;
  temperature: number;
  humidity: number;
  rainfall: number;
  rainfallProbability: number;
  condition: string;
}

export class WeatherService {
  private static instance: WeatherService;

  private constructor() {}

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  // Mock weather data - In production, integrate with OpenWeatherMap API
  async getForecast(location: { latitude: number; longitude: number }, days: number = 3): Promise<WeatherData[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const forecast: WeatherData[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      forecast.push({
        date,
        temperature: 20 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        rainfall: Math.random() * 20,
        rainfallProbability: Math.floor(Math.random() * 100),
        condition: this.getRandomCondition()
      });
    }

    return forecast;
  }

  private getRandomCondition(): string {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Stormy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  async getCurrentWeather(location: { latitude: number; longitude: number }): Promise<WeatherData> {
    const forecast = await this.getForecast(location, 1);
    return forecast[0];
  }

  getWeatherEmoji(condition: string): string {
    const emojiMap: { [key: string]: string } = {
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Partly Cloudy': '⛅',
      'Stormy': '⛈️'
    };
    return emojiMap[condition] || '🌤️';
  }
}