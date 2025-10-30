import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AuthController } from '../../controllers/AuthController';
import { User } from '../../types/UserTypes';

export const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);

  const authController = new AuthController();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await authController.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setCity(currentUser.location?.city || '');
      setState(currentUser.location?.state || '');
    }
  };

  const handleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    const result = await authController.updateProfile(user.userId, {
      username,
      email,
      location: {
        city,
        state,
        latitude: user.location?.latitude || 0,
        longitude: user.location?.longitude || 0,
      },
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully!');
      loadUser();
    } else {
      Alert.alert('Update Failed', result.error || 'Please try again');
    }
  };

  const handleLogout = async () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authController.logout();
          Alert.alert('Success', 'Logged out successfully!');
          // The AppNavigator will detect this within 2 seconds
        },
      },
    ]
  );
};

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Input
          label="City"
          value={city}
          onChangeText={setCity}
        />

        <Input
          label="State"
          value={state}
          onChangeText={setState}
        />

        <Text style={styles.info}>
          Following: {user.following.length} users
        </Text>
        <Text style={styles.info}>
          Member since: {new Date(user.createdAt).toLocaleDateString()}
        </Text>

        <Button
          title="Update Profile"
          onPress={handleUpdate}
          loading={loading}
        />

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
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
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
});