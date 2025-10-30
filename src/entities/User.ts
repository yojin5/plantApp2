import { User, Location } from '../types/UserTypes';

export class UserEntity implements User {
  userId: string;
  username: string;
  email: string;
  passwordHash: string;
  location?: Location;
  following: string[];
  profilePicture?: string;
  createdAt: Date;
  lastLogin?: Date;

  constructor(data: Partial<User>) {
    this.userId = data.userId || `user_${Date.now()}`;
    this.username = data.username || '';
    this.email = data.email || '';
    this.passwordHash = data.passwordHash || '';
    this.location = data.location;
    this.following = data.following || [];
    this.profilePicture = data.profilePicture;
    this.createdAt = data.createdAt || new Date();
    this.lastLogin = data.lastLogin;
  }

  follow(userId: string): void {
    if (!this.following.includes(userId)) {
      this.following.push(userId);
    }
  }

  unfollow(userId: string): void {
    this.following = this.following.filter(id => id !== userId);
  }

  isFollowing(userId: string): boolean {
    return this.following.includes(userId);
  }

  updateProfile(data: Partial<User>): void {
    if (data.username) this.username = data.username;
    if (data.email) this.email = data.email;
    if (data.location) this.location = data.location;
    if (data.profilePicture) this.profilePicture = data.profilePicture;
  }

  toJSON(): User {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      passwordHash: this.passwordHash,
      location: this.location,
      following: this.following,
      profilePicture: this.profilePicture,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }
}