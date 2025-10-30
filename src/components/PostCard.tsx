import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Post } from '../types/PostTypes';
import { getTimeAgo } from '../utils/dateUtils';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  isLiked: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, isLiked }) => {
  return (
    <View style={[styles.card, post.isHelpRequest && styles.helpRequest]}>
      {post.isHelpRequest && (
        <View style={styles.helpBadge}>
          <Text style={styles.helpBadgeText}>🤝 HELP REQUESTED</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.emoji}>👤</Text>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.plantName}>{post.plantName}</Text>
          {post.location && (
            <Text style={styles.location}>
              📍 {post.location.city}, {post.location.state}
            </Text>
          )}
        </View>
        <Text style={styles.time}>{post.timestamp}</Text>
      </View>

      <Text style={styles.text}>{post.text}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Text style={styles.actionText}>
            {isLiked ? '❤️' : '🤍'} {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Text style={styles.actionText}>💬 {post.comments}</Text>
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
  helpRequest: {
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  helpBadge: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  helpBadgeText: {
    color: '#F57C00',
    fontWeight: 'bold',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  plantName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
});