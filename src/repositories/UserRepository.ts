import { User } from '../types/UserTypes';
import { UserEntity } from '../entities/User';
import { StorageService } from '../services/StorageService';
import { STORAGE_KEYS } from '../utils/constants';

export class UserRepository {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async save(user: UserEntity): Promise<User> {
    const users = await this.findAll();
    const index = users.findIndex(u => u.userId === user.userId);
    
    if (index >= 0) {
      users[index] = user.toJSON();
    } else {
      users.push(user.toJSON());
    }
    
    await this.storageService.save(STORAGE_KEYS.USERS, users);
    return user.toJSON();
  }

  async findById(userId: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(u => u.userId === userId) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(u => u.email === email) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(u => u.username === username) || null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.storageService.get<User[]>(STORAGE_KEYS.USERS);
    return users || [];
  }

  async delete(userId: string): Promise<void> {
    const users = await this.findAll();
    const filtered = users.filter(u => u.userId !== userId);
    await this.storageService.save(STORAGE_KEYS.USERS, filtered);
  }

  async setCurrentUser(user: User): Promise<void> {
    await this.storageService.save(STORAGE_KEYS.CURRENT_USER, user);
  }

  async getCurrentUser(): Promise<User | null> {
    return await this.storageService.get<User>(STORAGE_KEYS.CURRENT_USER);
  }

  async clearCurrentUser(): Promise<void> {
    await this.storageService.remove(STORAGE_KEYS.CURRENT_USER);
  }
}