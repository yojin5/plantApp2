import { Post } from '../types/PostTypes';
import { Location } from '../types/UserTypes';

export class PostEntity implements Post {
  postId: string;
  userId: string;
  username: string;
  plantName: string;
  image?: string;
  text: string;
  location?: Location;
  likes: number;
  likedBy: string[];
  comments: number;
  isHelpRequest: boolean;
  timestamp: string;
  createdAt: Date;

  constructor(data: Partial<Post>) {
    this.postId = data.postId || `post_${Date.now()}`;
    this.userId = data.userId || '';
    this.username = data.username || '';
    this.plantName = data.plantName || '';
    this.image = data.image;
    this.text = data.text || '';
    this.location = data.location;
    this.likes = data.likes || 0;
    this.likedBy = data.likedBy || [];
    this.comments = data.comments || 0;
    this.isHelpRequest = data.isHelpRequest || false;
    this.timestamp = data.timestamp || 'Just now';
    this.createdAt = data.createdAt || new Date();
  }

  addLike(userId: string): void {
    if (!this.likedBy.includes(userId)) {
      this.likedBy.push(userId);
      this.likes++;
    }
  }

  removeLike(userId: string): void {
    if (this.likedBy.includes(userId)) {
      this.likedBy = this.likedBy.filter(id => id !== userId);
      this.likes--;
    }
  }

  isLikedBy(userId: string): boolean {
    return this.likedBy.includes(userId);
  }

  toJSON(): Post {
    return {
      postId: this.postId,
      userId: this.userId,
      username: this.username,
      plantName: this.plantName,
      image: this.image,
      text: this.text,
      location: this.location,
      likes: this.likes,
      likedBy: this.likedBy,
      comments: this.comments,
      isHelpRequest: this.isHelpRequest,
      timestamp: this.timestamp,
      createdAt: this.createdAt
    };
  }
}