import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HelpRequest } from '../types/HelpRequestTypes';
import { formatDate } from '../utils/dateUtils';

interface HelpRequestCardProps {
  request: HelpRequest;
  onPress: () => void;
  showActions?: boolean;
  onAccept?: (helperId: string) => void;
  onComplete?: () => void;
}

export const HelpRequestCard: React.FC<HelpRequestCardProps> = ({
  request,
  onPress,
  showActions = false,
  onAccept,
  onComplete,
}) => {
  const getStatusColor = () => {
    switch (request.status) {
      case 'OPEN': return '#2196F3';
      case 'ACCEPTED': return '#4CAF50';
      case 'COMPLETED': return '#9E9E9E';
      default: return '#666';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{request.plantNames.join(', ')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{request.status}</Text>
        </View>
      </View>

      <Text style={styles.dates}>
        {formatDate(request.startDate)} - {formatDate(request.endDate)}
      </Text>
      <Text style={styles.instructions}>{request.instructions}</Text>
      <Text style={styles.location}>
        📍 {request.location.city}, {request.location.state}
      </Text>

      {request.responses.length > 0 && (
        <Text style={styles.responses}>
          {request.responses.length} {request.responses.length === 1 ? 'response' : 'responses'}
        </Text>
      )}

      {showActions && request.status === 'ACCEPTED' && onComplete && (
        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
          <Text style={styles.completeButtonText}>Mark as Completed</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#FF9800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  responses: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});