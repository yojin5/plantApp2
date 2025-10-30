import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { UserCard } from '../../components/UserCard';
import { AuthController } from '../../controllers/AuthController';
import { CommunityController } from '../../controllers/CommunityController';
import { UserRepository } from '../../repositories/UserRepository';
import { PostRepository } from '../../repositories/PostRepository';
import { User } from '../../types/UserTypes';
import { UserEntity } from '../../entities/User';

export const DiscoverUsersScreen = ({ navigation }: any) => {
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const authController = new AuthController();
  const communityController = new CommunityController();
  const userRepository = new UserRepository();
  const postRepository = new PostRepository();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const user = await authController.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      
      // Get recommended users using the community controller
      const recommended = await communityController.getRecommendedUsers(user.userId);
      setRecommendedUsers(recommended);
      
      // Get all users in same city
      const allUsers = await userRepository.findAll();
      const sameCityUsers = allUsers.filter(u => 
        u.userId !== user.userId && 
        u.location?.city === user.location?.city &&
        !recommended.some(rec => rec.userId === u.userId) // Don't show in both sections
      );
      setNearbyUsers(sameCityUsers);
    }
    setLoading(false);
  };

  const handleFollowToggle = async (userId: string) => {
    if (!currentUser) return;
    
    const userEntity = new UserEntity(currentUser);
    
    // Toggle follow/unfollow
    if (currentUser.following.includes(userId)) {
      // Unfollow
      userEntity.following = userEntity.following.filter(id => id !== userId);
    } else {
      // Follow
      userEntity.follow(userId);
    }
    
    const updatedUser = await userRepository.save(userEntity);
    await userRepository.setCurrentUser(updatedUser);
    
    // Refresh to update button states
    loadUsers();
  };

  const isFollowing = (userId: string): boolean => {
    return currentUser?.following.includes(userId) || false;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadUsers} />}
    >
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Discover Users</Text>

        {/* Recommended Section */}
        {recommendedUsers.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Recommended for You</Text>
              <Text style={styles.sectionSubtitle}>
                Based on mutual connections and interests
              </Text>
            </View>
            {recommendedUsers.map(user => (
              <UserCard
                key={user.userId}
                user={user}
                postCount={0}
                isNearby={currentUser?.location?.city === user.location?.city}
                isFollowing={isFollowing(user.userId)}
                onFollow={() => handleFollowToggle(user.userId)}
              />
            ))}
          </>
        )}

        {/* Nearby Users Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            📍 Users in {currentUser?.location?.city || 'Your City'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            Connect with local plant enthusiasts
          </Text>
        </View>

        {nearbyUsers.length === 0 && recommendedUsers.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <Text style={styles.emptyText}>No users in your city yet</Text>
            <Text style={styles.emptySubtext}>
              {currentUser?.location?.city 
                ? `Be the first plant enthusiast in ${currentUser.location.city}!`
                : 'Set your location in profile to find nearby users'}
            </Text>
          </View>
        ) : nearbyUsers.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptySectionText}>
              No more users in your city
            </Text>
          </View>
        ) : (
          nearbyUsers.map(user => (
            <UserCard
              key={user.userId}
              user={user}
              postCount={0}
              isNearby={true}
              isFollowing={isFollowing(user.userId)}
              onFollow={() => handleFollowToggle(user.userId)}
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
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 25,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
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
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  emptySection: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginTop: 10,
  },
  emptySectionText: {
    fontSize: 16,
    color: '#999',
  },
});