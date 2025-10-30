import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { PlantCard } from '../../components/PlantCard';
import { Button } from '../../components/Button';
import { AuthController } from '../../controllers/AuthController';
import { PlantManagementController } from '../../controllers/PlantManagementController';
import { WateringController } from '../../controllers/WateringController';
import { Plant } from '../../types/PlantTypes';

export const MyPlantsScreen = ({ navigation }: any) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);

  const authController = new AuthController();
  const plantController = new PlantManagementController();
  const wateringController = new WateringController();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPlants();
    });
    return unsubscribe;
  }, [navigation]);

  const loadPlants = async () => {
    setLoading(true);
    const user = await authController.getCurrentUser();
    if (user) {
      const userPlants = await plantController.getUserPlants(user.userId);
      setPlants(userPlants);
    }
    setLoading(false);
  };

  const handleWater = async (plantId: string) => {
    await wateringController.waterPlant(plantId);
    loadPlants();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadPlants} />
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Plants ({plants.length})</Text>
          <Button
            title="Add Plant"
            onPress={() => navigation.navigate('AddPlant')}
          />
        </View>

        {plants.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  empty: {
    padding: 60,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
  },
});