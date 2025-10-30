import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../types/UserTypes';

interface UserCardProps {
  user: User;
  postCount: number;
  isNearby: boolean;
  onFollow: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, postCount, isNearby, onFollow }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>👤</Text>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.username}>{user.username}</Text>
            {isNearby && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Near you</Text>
              </View>
            )}
          </View>
          <Text style={styles.location}>
            {user.location?.city}, {user.location?.state}
          </Text>
          <Text style={styles.posts}>
            {postCount} {postCount === 1 ? 'post' : 'posts'}
          </Text>
        </View>
        <TouchableOpacity style={styles.followButton} onPress={onFollow}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    color: '#2E7D32',
    fontSize: 10,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  posts: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  followButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});