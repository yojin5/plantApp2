import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../services/WeatherService';
import { WeatherService } from '../services/WeatherService';

interface WeatherWidgetProps {
  forecast: WeatherData[];
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ forecast }) => {
  const weatherService = WeatherService.getInstance();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3-Day Forecast</Text>
      <View style={styles.days}>
        {forecast.map((day, index) => (
          <View key={index} style={styles.day}>
            <Text style={styles.dayLabel}>
              {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Day After'}
            </Text>
            <Text style={styles.emoji}>{weatherService.getWeatherEmoji(day.condition)}</Text>
            <Text style={styles.temp}>{Math.round(day.temperature)}°</Text>
            <Text style={styles.rain}>{day.rainfallProbability}% rain</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  days: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  day: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  temp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  rain: {
    fontSize: 12,
    color: '#999',
  },
});