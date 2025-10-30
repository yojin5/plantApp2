import { User, UserDTO, LoginDTO } from '../types/UserTypes';
import { UserEntity } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators';

export class AuthController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: UserDTO): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validate input
      if (!validateEmail(userData.email)) {
        return { success: false, error: 'Invalid email format' };
      }

      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.message };
      }

      const usernameValidation = validateUsername(userData.username);
      if (!usernameValidation.valid) {
        return { success: false, error: usernameValidation.message };
      }

      // Check if user already exists
      const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
      if (existingUserByEmail) {
        return { success: false, error: 'Email already registered' };
      }

      const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
      if (existingUserByUsername) {
        return { success: false, error: 'Username already taken' };
      }

      // Create user
      const userEntity = new UserEntity({
        username: userData.username,
        email: userData.email,
        passwordHash: userData.password, // In production, hash this!
        location: userData.city && userData.state ? {
          city: userData.city,
          state: userData.state,
          latitude: 0,
          longitude: 0
        } : undefined
      });

      const savedUser = await this.userRepository.save(userEntity);
      await this.userRepository.setCurrentUser(savedUser);

      return { success: true, user: savedUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  async login(loginData: LoginDTO): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const user = await this.userRepository.findByEmail(loginData.email);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // In production, compare hashed passwords
      if (user.passwordHash !== loginData.password) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      const userEntity = new UserEntity(user);
      userEntity.lastLogin = new Date();
      await this.userRepository.save(userEntity);

      await this.userRepository.setCurrentUser(userEntity.toJSON());

      return { success: true, user: userEntity.toJSON() };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  async logout(): Promise<void> {
    await this.userRepository.clearCurrentUser();
  }

  async getCurrentUser(): Promise<User | null> {
    return await this.userRepository.getCurrentUser();
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const userEntity = new UserEntity(user);
      userEntity.updateProfile(updates);

      const savedUser = await this.userRepository.save(userEntity);
      await this.userRepository.setCurrentUser(savedUser);

      return { success: true, user: savedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }
}