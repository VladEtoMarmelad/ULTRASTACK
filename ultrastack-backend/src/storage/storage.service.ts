import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  /**
   * Ensures the directory exists and creates the file with initial data if it doesn't.
   */
  ensureFileExists<T>(fullPath: string, initialData: T): void {
    try {
      const directory = path.dirname(fullPath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      if (!fs.existsSync(fullPath)) {
        this.writeJson(fullPath, initialData);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Failed to initialize storage at ${fullPath}`);
    }
  }

  /**
   * Reads and parses a JSON file from the provided path.
   */
  readJson<T>(fullPath: string): T {
    try {
      const data = fs.readFileSync(fullPath, 'utf-8');
      return JSON.parse(data) as T;
    } catch (error) {
      throw new InternalServerErrorException(`Could not read file at ${fullPath}`);
    }
  }

  /**
   * Serializes and writes data to a specific file path.
   */
  writeJson<T>(fullPath: string, data: T): void {
    try {
      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(fullPath, content, 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException(`Could not write file at ${fullPath}`);
    }
  }
}