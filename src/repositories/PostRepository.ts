import { Post } from '../types/PostTypes';
import { PostEntity } from '../entities/Post';
import { StorageService } from '../services/StorageService';
import { STORAGE_KEYS } from '../utils/constants';

export class PostRepository {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async save(post: PostEntity): Promise<Post> {
    const posts = await this.findAll();
    const index = posts.findIndex(p => p.postId === post.postId);
    
    if (index >= 0) {
      posts[index] = post.toJSON();
    } else {
      posts.unshift(post.toJSON()); // Add to beginning
    }
    
    await this.storageService.save(STORAGE_KEYS.POSTS, posts);
    return post.toJSON();
  }

  async findById(postId: string): Promise<Post | null> {
    const posts = await this.findAll();
    return posts.find(p => p.postId === postId) || null;
  }

  async findByUser(userId: string): Promise<Post[]> {
    const posts = await this.findAll();
    return posts.filter(p => p.userId === userId);
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.storageService.get<Post[]>(STORAGE_KEYS.POSTS);
    return posts || [];
  }

  async delete(postId: string): Promise<void> {
    const posts = await this.findAll();
    const filtered = posts.filter(p => p.postId !== postId);
    await this.storageService.save(STORAGE_KEYS.POSTS, filtered);
  }
}