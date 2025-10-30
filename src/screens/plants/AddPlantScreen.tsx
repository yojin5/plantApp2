import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AuthController } from '../../controllers/AuthController';
import { PlantManagementController } from '../../controllers/PlantManagementController';
import { PlantZoneController } from '../../controllers/PlantZoneController';
import { PLANT_TYPES } from '../../utils/constants';
import { PlantZone } from '../../types/PlantTypes';

export const AddPlantScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [plantType, setPlantType] = useState(PLANT_TYPES[0]);
  const [wateringFrequency, setWateringFrequency] = useState('7');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [zones, setZones] = useState<PlantZone[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const authController = new AuthController();
  const plantController = new PlantManagementController();
  const zoneController = new PlantZoneController();

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    const user = await authController.getCurrentUser();
    if (user) {
      const userZones = await zoneController.getUserZones(user.userId);
      setZones(userZones);
    }
  };

  const handleAdd = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a plant name');
      return;
    }

    const user = await authController.getCurrentUser();
    if (!user) return;

    setLoading(true);
    const result = await plantController.createPlant(
      {
        name,
        plantType,
        wateringFrequencyDays: parseInt(wateringFrequency),
        zoneId: selectedZone || undefined,
        notes,
      },
      user.userId
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Plant added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to add plant');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Plant</Text>

        <Input
          label="Plant Name *"
          value={name}
          onChangeText={setName}
          placeholder="e.g., My Monstera"
        />

        <Text style={styles.label}>Plant Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={plantType}
            onValueChange={setPlantType}
            style={styles.picker}
          >
            {PLANT_TYPES.map(type => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <Input
          label="Watering Frequency (days)"
          value={wateringFrequency}
          onChangeText={setWateringFrequency}
          keyboardType="numeric"
          placeholder="7"
        />

        {zones.length > 0 && (
          <>
            <Text style={styles.label}>Assign to Zone (Optional)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedZone}
                onValueChange={setSelectedZone}
                style={styles.picker}
              >
                <Picker.Item label="No Zone" value="" />
                {zones.map(zone => (
                  <Picker.Item key={zone.zoneId} label={zone.name} value={zone.zoneId} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special care instructions..."
          multiline
          numberOfLines={4}
        />

        <Button
          title="Add Plant"
          onPress={handleAdd}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 8,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
});