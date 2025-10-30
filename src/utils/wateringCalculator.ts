import { Plant, WateringSchedule } from '../types/PlantTypes';
import { RAINFALL_THRESHOLD } from './constants';

export const calculateNextWateringDate = (
  lastWatered: Date,
  frequencyDays: number,
  rainfallMm: number = 0
): Date => {
  let daysToAdd = frequencyDays;

  // Adjust based on rainfall
  if (rainfallMm > RAINFALL_THRESHOLD) {
    daysToAdd += 2; // Skip 2 extra days if heavy rain
  }

  const nextDate = new Date(lastWatered);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return nextDate;
};

export const shouldSkipWatering = (
  rainfallProbability: number,
  expectedRainfall: number
): boolean => {
  return rainfallProbability > 60 && expectedRainfall > RAINFALL_THRESHOLD;
};

export const getDaysUntilWatering = (nextWateringDate: Date): number => {
  const now = new Date();
  const diffTime = new Date(nextWateringDate).getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const needsWatering = (nextWateringDate: Date): boolean => {
  return new Date() >= new Date(nextWateringDate);
};

export const getWateringStatus = (plant: Plant): string => {
  const days = getDaysUntilWatering(plant.nextWateringDate);

  if (days < 0) return 'Overdue!';
  if (days === 0) return 'Water today';
  if (days === 1) return 'Water tomorrow';
  return `Water in ${days} days`;
};

export const generateWateringSchedule = (
  plants: Plant[],
  forecast: any[]
): WateringSchedule[] => {
  return plants.map(plant => {
    const days = getDaysUntilWatering(plant.nextWateringDate);
    const tomorrowForecast = forecast[1];
    const skip = shouldSkipWatering(
      tomorrowForecast?.rainfallProbability || 0,
      tomorrowForecast?.rainfall || 0
    );

    return {
      plantId: plant.plantId,
      plantName: plant.name,
      nextWateringDate: plant.nextWateringDate,
      daysUntilWatering: days,
      shouldSkip: skip,
      reason: skip ? 'Heavy rain expected' : undefined,
    };
  });
};