export interface Location {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  passwordHash: string;
  location?: Location;
  following: string[];
  profilePicture?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserDTO {
  username: string;
  email: string;
  password: string;
  city?: string;
  state?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}