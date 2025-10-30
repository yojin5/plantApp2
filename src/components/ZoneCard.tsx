import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PlantZone } from '../types/PlantTypes';

interface ZoneCardProps {
  zone: PlantZone;
  plantCount: number;
  onPress: () => void;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ zone, plantCount, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🏡</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{zone.name}</Text>
          <Text style={styles.details}>
            {zone.surfaceAreaM2}m² • {zone.exposureType}
          </Text>
          <Text style={styles.plants}>
            {plantCount} {plantCount === 1 ? 'plant' : 'plants'}
          </Text>
        </View>
      </View>
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
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  plants: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
  },
});