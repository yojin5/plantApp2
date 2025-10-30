import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { PlantManagementController } from '../../controllers/PlantManagementController';
import { WateringController } from '../../controllers/WateringController';
import { Plant } from '../../types/PlantTypes';
import { formatDate } from '../../utils/dateUtils';
import { getWateringStatus } from '../../utils/wateringCalculator';

export const PlantDetailsScreen = ({ route, navigation }: any) => {
  const { plantId } = route.params;
  const [plant, setPlant] = useState<Plant | null>(null);

  const plantController = new PlantManagementController();
  const wateringController = new WateringController();

  useEffect(() => {
    loadPlant();
  }, []);

  const loadPlant = async () => {
    const plantData = await plantController.getPlant(plantId);
    setPlant(plantData);
  };

  const handleWater = async () => {
    await wateringController.waterPlant(plantId);
    loadPlant();
    Alert.alert('Success', 'Plant watered successfully!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Plant',
      'Are you sure you want to delete this plant?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await plantController.deletePlant(plantId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🌱</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{plant.name}</Text>
            <Text style={styles.type}>{plant.plantType}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Watering Schedule</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Last watered:</Text>
            <Text style={styles.value}>{formatDate(plant.lastWatered)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Next watering:</Text>
            <Text style={styles.value}>{formatDate(plant.nextWateringDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, styles.status]}>
              {getWateringStatus(plant)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Frequency:</Text>
            <Text style={styles.value}>Every {plant.wateringFrequencyDays} days</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Plant Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Health:</Text>
            <Text style={styles.value}>{plant.healthStatus}</Text>
          </View>
          {plant.notes && (
            <View style={styles.row}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{plant.notes}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Added:</Text>
            <Text style={styles.value}>{formatDate(plant.createdAt)}</Text>
          </View>
        </View>

        <Button title="💧 Water Now" onPress={handleWater} />
        <Button title="Delete Plant" onPress={handleDelete} variant="danger" />
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
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 60,
    marginRight: 20,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  type: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  status: {
    color: '#4CAF50',
  },
});