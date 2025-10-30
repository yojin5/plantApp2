import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { WeatherWidget } from '../components/WeatherWidget';
import { PlantCard } from '../components/PlantCard';
import { Button } from '../components/Button';
import { AuthController } from '../controllers/AuthController';
import { PlantManagementController } from '../controllers/PlantManagementController';
import { WateringController } from '../controllers/WateringController';
import { WeatherController } from '../controllers/WeatherController';
import { Plant } from '../types/PlantTypes';
import { WeatherData } from '../services/WeatherService';

export const DashboardScreen = ({ navigation }: any) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  const authController = new AuthController();
  const plantController = new PlantManagementController();
  const wateringController = new WateringController();
  const weatherController = new WeatherController();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const user = await authController.getCurrentUser();
    if (user) {
      setUsername(user.username);
      const userPlants = await plantController.getUserPlants(user.userId);
      setPlants(userPlants);

      const location = user.location || { latitude: 40.7128, longitude: -74.0060 };
      const weatherData = await weatherController.getForecast(location, 3);
      setForecast(weatherData);
    }
    setLoading(false);
  };

  const handleWater = async (plantId: string) => {
    await wateringController.waterPlant(plantId);
    loadData();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>🌱 Plant Care Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, {username}!</Text>

        {forecast.length > 0 && <WeatherWidget forecast={forecast} />}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Plants ({plants.length})</Text>
            <Button
              title="+ Add"
              onPress={() => navigation.navigate('PlantsTab', { 
  screen: 'AddPlant' 
})}
            />
          </View>

          {plants.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No plants yet!</Text>
              <Text style={styles.emptySubtext}>Add your first plant to get started</Text>
            </View>
          ) : (
            plants.map(plant => (
              <PlantCard
                key={plant.plantId}
                plant={plant}
                onPress={() => navigation.navigate('PlantDetails', { plantId: plant.plantId })}
                onWater={() => handleWater(plant.plantId)}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});