import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AuthController } from '../../controllers/AuthController';
import { CommunityController } from '../../controllers/CommunityController';

export const CreatePostScreen = ({ navigation }: any) => {
  const [plantName, setPlantName] = useState('');
  const [text, setText] = useState('');
  const [isHelpRequest, setIsHelpRequest] = useState(false);
  const [loading, setLoading] = useState(false);

  const authController = new AuthController();
  const communityController = new CommunityController();

  const handlePost = async () => {
    if (!plantName || !text) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const user = await authController.getCurrentUser();
    if (!user) return;

    setLoading(true);
    const result = await communityController.createPost(
      {
        plantName,
        text,
        isHelpRequest,
      },
      user.userId
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Post created!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to create post');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Post</Text>

        <Input
          label="Plant Name"
          value={plantName}
          onChangeText={setPlantName}
          placeholder="What plant is this about?"
        />

        <Input
          label="Your Message"
          value={text}
          onChangeText={setText}
          placeholder="Share your thoughts..."
          multiline
          numberOfLines={6}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>This is a help request</Text>
          <Switch
            value={isHelpRequest}
            onValueChange={setIsHelpRequest}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
          />
        </View>

        {isHelpRequest && (
          <View style={styles.helpInfo}>
            <Text style={styles.helpInfoText}>
              🤝 Help requests will be visible to users near you
            </Text>
          </View>
        )}

        <Button
          title="Post"
          onPress={handlePost}
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  helpInfo: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  helpInfoText: {
    color: '#F57C00',
    fontSize: 14,
  },
});