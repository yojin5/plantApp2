import { Location } from './UserTypes';

export interface Post {
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
}

export interface PostDTO {
  plantName: string;
  text: string;
  isHelpRequest: boolean;
  image?: string;
}

export interface Comment {
  commentId: string;
  postId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}