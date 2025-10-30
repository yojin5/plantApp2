import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { ZoneCard } from '../../components/ZoneCard';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Picker } from '@react-native-picker/picker';
import { AuthController } from '../../controllers/AuthController';
import { PlantZoneController } from '../../controllers/PlantZoneController';
import { PlantManagementController } from '../../controllers/PlantManagementController';
import { PlantZone } from '../../types/PlantTypes';
import { ExposureType } from '../../enums/ExposureType';
import { CoverType } from '../../enums/CoverType';

export const PlantZonesScreen = ({ navigation }: any) => {
  const [zones, setZones] = useState<PlantZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [surfaceArea, setSurfaceArea] = useState('10');
  const [exposureType, setExposureType] = useState(ExposureType.FULL_SUN);
  const [coverType, setCoverType] = useState(CoverType.UNCOVERED);

  const authController = new AuthController();
  const zoneController = new PlantZoneController();
  const plantController = new PlantManagementController();

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    setLoading(true);
    const user = await authController.getCurrentUser();
    if (user) {
      const userZones = await zoneController.getUserZones(user.userId);
      setZones(userZones);
    }
    setLoading(false);
  };

  const handleAddZone = async () => {
    if (!zoneName) {
      Alert.alert('Error', 'Please enter a zone name');
      return;
    }

    const user = await authController.getCurrentUser();
    if (!user || !user.location) {
      Alert.alert('Error', 'Please set your location in profile');
      return;
    }

    const result = await zoneController.createZone(
      {
        name: zoneName,
        surfaceAreaM2: parseFloat(surfaceArea),
        exposureType,
        coverType,
      },
      user.userId,
      user.location
    );

    if (result.success) {
      Alert.alert('Success', 'Zone created successfully!');
      setShowAddZone(false);
      setZoneName('');
      setSurfaceArea('10');
      loadZones();
    } else {
      Alert.alert('Error', result.error || 'Failed to create zone');
    }
  };

  const getPlantCount = async (zoneId: string): Promise<number> => {
    const plants = await plantController.getUserPlants('');
    return plants.filter(p => p.zoneId === zoneId).length;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadZones} />}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Plant Zones</Text>
          <Button
            title={showAddZone ? 'Cancel' : '+ Add Zone'}
            onPress={() => setShowAddZone(!showAddZone)}
            variant={showAddZone ? 'secondary' : 'primary'}
          />
        </View>

        {showAddZone && (
          <View style={styles.addZoneCard}>
            <Text style={styles.cardTitle}>Create New Zone</Text>

            <Input
              label="Zone Name"
              value={zoneName}
              onChangeText={setZoneName}
              placeholder="e.g., Backyard Garden"
            />

            <Input
              label="Surface Area (m²)"
              value={surfaceArea}
              onChangeText={setSurfaceArea}
              keyboardType="numeric"
              placeholder="10"
            />

            <Text style={styles.label}>Exposure Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={exposureType}
                onValueChange={setExposureType}
              >
                <Picker.Item label="Full Sun" value={ExposureType.FULL_SUN} />
                <Picker.Item label="Partial Shade" value={ExposureType.PARTIAL_SHADE} />
                <Picker.Item label="Full Shade" value={ExposureType.FULL_SHADE} />
                <Picker.Item label="Indoor" value={ExposureType.INDOOR} />
              </Picker>
            </View>

            <Text style={styles.label}>Cover Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={coverType}
                onValueChange={setCoverType}
              >
                <Picker.Item label="Uncovered" value={CoverType.UNCOVERED} />
                <Picker.Item label="Partial Cover" value={CoverType.PARTIAL_COVER} />
                <Picker.Item label="Full Cover" value={CoverType.FULL_COVER} />
              </Picker>
            </View>

            <Button title="Create Zone" onPress={handleAddZone} />
          </View>
        )}

        {zones.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🏡</Text>
            <Text style={styles.emptyText}>No zones yet!</Text>
            <Text style={styles.emptySubtext}>Create zones to manage multiple plants together</Text>
          </View>
        ) : (
          zones.map(zone => (
            <ZoneCard
              key={zone.zoneId}
              zone={zone}
              plantCount={zone.plantIds.length}
              onPress={() => {}}
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
  addZoneCard: {
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
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
    textAlign: 'center',
  },
});