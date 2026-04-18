import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../storage/storage.service';
import { User } from '../../types/User';
import * as path from 'path';

@Injectable()
export class UsersService {
  private readonly filePath = path.resolve(process.cwd(), 'src/authTech', 'users.json');

  constructor(private readonly storageService: StorageService) {
    this.storageService.ensureFileExists<User[]>(this.filePath, []);
  }

  findAll(): User[] {
    return this.storageService.readJson<User[]>(this.filePath);
  }

  // Helper to find a user by email for authentication and duplicate checks
  findByEmail(email: string): User | undefined {
    return this.findAll().find((u) => u.email === email);
  }

  findOne(id: number): User {
    const users = this.findAll();
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(data: Partial<User>): User {
    const users = this.findAll();
    const newUser: User = {
      id: Date.now(),
      name: data.name || 'New User',
      email: data.email || '',
      password: data.password, // This should be already hashed by AuthService
      provider: data.provider || 'local',
      externalId: data.externalId,
      avatarUrl: data.avatarUrl,
      createdAt: new Date(),
    };
    
    users.push(newUser);
    this.storageService.writeJson(this.filePath, users);
    return newUser;
  }

  update(id: number, data: Partial<User>): User {
    const users = this.findAll();
    const index = users.findIndex((u) => u.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    users[index] = { ...users[index], ...data, updatedAt: new Date() };
    this.storageService.writeJson(this.filePath, users);
    return users[index];
  }

  remove(id: number): void {
    const users = this.findAll();
    const filteredUsers = users.filter((u) => u.id !== id);
    
    if (users.length === filteredUsers.length) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.storageService.writeJson(this.filePath, filteredUsers);
  }
}