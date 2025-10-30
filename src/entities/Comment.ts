import { Comment } from '../types/PostTypes';

export class CommentEntity implements Comment {
  commentId: string;
  postId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;

  constructor(data: Partial<Comment>) {
    this.commentId = data.commentId || `comment_${Date.now()}`;
    this.postId = data.postId || '';
    this.userId = data.userId || '';
    this.username = data.username || '';
    this.text = data.text || '';
    this.createdAt = data.createdAt || new Date();
  }

  toJSON(): Comment {
    return {
      commentId: this.commentId,
      postId: this.postId,
      userId: this.userId,
      username: this.username,
      text: this.text,
      createdAt: this.createdAt
    };
  }
}