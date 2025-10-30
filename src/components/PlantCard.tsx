import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plant } from '../types/PlantTypes';
import { formatDate, getDaysBetween } from '../utils/dateUtils';
import { getWateringStatus } from '../utils/wateringCalculator';

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
  onWater: () => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onPress, onWater }) => {
  const status = getWateringStatus(plant);
  const needsWater = plant.nextWateringDate && new Date() >= new Date(plant.nextWateringDate);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🌱</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.type}>{plant.plantType}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>
          Last watered: {formatDate(plant.lastWatered)}
        </Text>
        <Text style={[styles.status, needsWater && styles.needsWater]}>
          {status}
        </Text>
      </View>

      <TouchableOpacity style={styles.waterButton} onPress={onWater}>
        <Text style={styles.waterButtonText}>💧 Water Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  type: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  details: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  needsWater: {
    color: '#FF9800',
  },
  waterButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  waterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});