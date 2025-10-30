import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TextInput } from 'react-native';
import { PostCard } from '../../components/PostCard';
import { Button } from '../../components/Button';
import { AuthController } from '../../controllers/AuthController';
import { CommunityController } from '../../controllers/CommunityController';
import { PostRepository } from '../../repositories/PostRepository';
import { PostEntity } from '../../entities/Post';
import { Post, Comment } from '../../types/PostTypes';

export const CommunityScreen = ({ navigation }: any) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const authController = new AuthController();
  const communityController = new CommunityController();
  const postRepository = new PostRepository();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const user = await authController.getCurrentUser();
    if (user) {
      setCurrentUserId(user.userId);
      
      // Get ALL posts instead of just followed posts
      const allPosts = await postRepository.findAll();
      
      // Sort by newest first
      const sortedPosts = allPosts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPosts(sortedPosts);
    }
    setLoading(false);
  };

  const handleLike = async (postId: string) => {
    await communityController.likePost(postId, currentUserId);
    loadData();
  };

  const handleComment = (postId: string) => {
    setCommentingOn(postId);
    setCommentText('');
  };

  const handleSubmitComment = async (postId: string) => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      // Get the post
      const post = await postRepository.findById(postId);
      if (!post) {
        Alert.alert('Error', 'Post not found');
        return;
      }

      // Create post entity and add comment
      const postEntity = new PostEntity(post);
      const newComment: Comment = {
        commentId: `comment_${Date.now()}`,
        userId: currentUserId,
        text: commentText.trim(),
        createdAt: new Date(),
      };
      
      postEntity.comments.push(newComment);
      
      // Save the updated post
      await postRepository.save(postEntity);
      
      setCommentingOn(null);
      setCommentText('');
      loadData();
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleCancelComment = () => {
    setCommentingOn(null);
    setCommentText('');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Community Feed</Text>
          <Button
            title="+ Post"
            onPress={() => navigation.navigate('CreatePost')}
          />
        </View>

        <View style={styles.navButtons}>
          <Button
            title="👥 Discover Users"
            onPress={() => navigation.navigate('DiscoverUsers')}
            variant="secondary"
          />
        </View>

        {posts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No posts yet!</Text>
            <Text style={styles.emptySubtext}>Be the first to share your plant journey</Text>
          </View>
        ) : (
          posts.map(post => (
            <View key={post.postId}>
              <PostCard
                post={post}
                onLike={() => handleLike(post.postId)}
                onComment={() => handleComment(post.postId)}
                isLiked={post.likedBy.includes(currentUserId)}
              />
              
              {/* Comment Input */}
              {commentingOn === post.postId && (
                <View style={styles.commentBox}>
                  <TextInput
                    style={styles.commentInput}
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder="Write a comment..."
                    multiline
                    autoFocus
                  />
                  <View style={styles.commentActions}>
                    <Button
                      title="Cancel"
                      onPress={handleCancelComment}
                      variant="secondary"
                    />
                    <Button
                      title="Post Comment"
                      onPress={() => handleSubmitComment(post.postId)}
                    />
                  </View>
                </View>
              )}
            </View>
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
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  navButtons: {
    marginBottom: 20,
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
  commentBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 15,
    borderTopWidth: 0,
  },
  commentInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 60,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});