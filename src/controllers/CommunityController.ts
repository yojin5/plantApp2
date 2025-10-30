import { Post, PostDTO } from '../types/PostTypes';
import { PostEntity } from '../entities/Post';
import { PostRepository } from '../repositories/PostRepository';
import { UserRepository } from '../repositories/UserRepository';

export class CommunityController {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  async createPost(postData: PostDTO, userId: string): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const postEntity = new PostEntity({
        userId,
        username: user.username,
        plantName: postData.plantName,
        text: postData.text,
        isHelpRequest: postData.isHelpRequest,
        image: postData.image,
        location: postData.isHelpRequest ? user.location : undefined
      });

      const savedPost = await this.postRepository.save(postEntity);

      return { success: true, post: savedPost };
    } catch (error) {
      console.error('Create post error:', error);
      return { success: false, error: 'Failed to create post' };
    }
  }

  async likePost(postId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const post = await this.postRepository.findById(postId);
      if (!post) {
        return { success: false, error: 'Post not found' };
      }

      const postEntity = new PostEntity(post);
      
      if (postEntity.isLikedBy(userId)) {
        postEntity.removeLike(userId);
      } else {
        postEntity.addLike(userId);
      }

      await this.postRepository.save(postEntity);

      return { success: true };
    } catch (error) {
      console.error('Like post error:', error);
      return { success: false, error: 'Failed to like post' };
    }
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }

  async getFollowedPosts(userId: string): Promise<Post[]> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) return [];

      const followedUserIds = [userId, ...user.following];
      const allPosts = await this.postRepository.findAll();

      return allPosts.filter(post => followedUserIds.includes(post.userId));
    } catch (error) {
      console.error('Get followed posts error:', error);
      return [];
    }
  }

  async getRecommendedPosts(userId: string): Promise<Post[]> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user || !user.location) return [];

      const allPosts = await this.postRepository.findAll();
      const followedUserIds = [userId, ...user.following];

      return allPosts.filter(post => {
        if (followedUserIds.includes(post.userId)) return false;
        if (post.location && post.location.city === user.location?.city) return true;
        return false;
      });
    } catch (error) {
      console.error('Get recommended posts error:', error);
      return [];
    }
  }
}