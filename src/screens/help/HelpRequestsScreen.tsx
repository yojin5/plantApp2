import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { HelpRequestCard } from '../../components/HelpRequestCard';
import { AuthController } from '../../controllers/AuthController';
import { HelpRequestController } from '../../controllers/HelpRequestController';
import { HelpRequest } from '../../types/HelpRequestTypes';

export const HelpRequestsScreen = ({ navigation }: any) => {
  const [myRequests, setMyRequests] = useState<HelpRequest[]>([]);
  const [helpingWith, setHelpingWith] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const authController = new AuthController();
  const helpController = new HelpRequestController();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const user = await authController.getCurrentUser();
    if (user) {
      const requests = await helpController.getMyRequests(user.userId);
      const helping = await helpController.getMyAcceptedHelps(user.userId);
      setMyRequests(requests);
      setHelpingWith(helping);
    }
    setLoading(false);
  };

  const handleAcceptHelper = async (requestId: string, helperId: string) => {
    await helpController.acceptHelper(requestId, helperId);
    loadData();
  };

  const handleComplete = async (requestId: string) => {
    await helpController.completeRequest(requestId);
    loadData();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Help Requests</Text>

        <Text style={styles.sectionTitle}>My Requests ({myRequests.length})</Text>
        {myRequests.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>No help requests</Text>
          </View>
        ) : (
          myRequests.map(request => (
            <HelpRequestCard
              key={request.requestId}
              request={request}
              onPress={() => {}}
              showActions
              onAccept={(helperId) => handleAcceptHelper(request.requestId, helperId)}
              onComplete={() => handleComplete(request.requestId)}
            />
          ))
        )}

        <Text style={styles.sectionTitle}>Helping With ({helpingWith.length})</Text>
        {helpingWith.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>Not helping anyone yet</Text>
          </View>
        ) : (
          helpingWith.map(request => (
            <HelpRequestCard
              key={request.requestId}
              request={request}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});