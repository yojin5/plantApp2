import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AuthController } from '../../controllers/AuthController';
import { PlantManagementController } from '../../controllers/PlantManagementController';
import { HelpRequestController } from '../../controllers/HelpRequestController';
import { Plant } from '../../types/PlantTypes';

export const CreateHelpRequestScreen = ({ navigation }: any) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const authController = new AuthController();
  const plantController = new PlantManagementController();
  const helpController = new HelpRequestController();

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    const user = await authController.getCurrentUser();
    if (user) {
      const userPlants = await plantController.getUserPlants(user.userId);
      setPlants(userPlants);
    }
  };

  const handleCreate = async () => {
    if (selectedPlants.length === 0 || !startDate || !endDate || !instructions) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const user = await authController.getCurrentUser();
    if (!user) return;

    setLoading(true);
    const result = await helpController.createHelpRequest(
      {
        plantIds: selectedPlants,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        instructions,
      },
      user.userId,
      `post_${Date.now()}`
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Help request created!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to create help request');
    }
  };

  const togglePlant = (plantId: string) => {
    setSelectedPlants(prev =>
      prev.includes(plantId)
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Request Help</Text>
        <Text style={styles.subtitle}>
          Ask nearby gardeners to help care for your plants
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Plants</Text>
          {plants.length === 0 ? (
            <View style={styles.emptyPlants}>
              <Text style={styles.emptyText}>No plants added yet</Text>
              <Text style={styles.emptySubtext}>Add plants first to request help</Text>
            </View>
          ) : (
            plants.map(plant => (
              <View key={plant.plantId} style={styles.plantItem}>
                <View style={styles.plantInfo}>
                  <Text style={styles.plantEmoji}>🌱</Text>
                  <View>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <Text style={styles.plantType}>{plant.plantType}</Text>
                  </View>
                </View>
                <Button
                  title={selectedPlants.includes(plant.plantId) ? '✓ Selected' : '+ Select'}
                  onPress={() => togglePlant(plant.plantId)}
                  variant={selectedPlants.includes(plant.plantId) ? 'primary' : 'secondary'}
                />
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          
          <Input
            label="Start Date"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD (e.g., 2025-11-01)"
          />

          <Input
            label="End Date"
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD (e.g., 2025-11-10)"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Instructions</Text>
          
          <Input
            label="Instructions for Helper"
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Please water daily in the morning, keep in shade, avoid overwatering..."
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoEmoji}>ℹ️</Text>
          <Text style={styles.infoText}>
            Your request will be visible to plant care enthusiasts near you
          </Text>
        </View>

        <Button
          title="Create Request"
          onPress={handleCreate}
          loading={loading}
        />

        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
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
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  plantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  plantEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  plantType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyPlants: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
  },
});