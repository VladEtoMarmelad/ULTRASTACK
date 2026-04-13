import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface representing the internal structure of our data.
 */
export interface IGraphqlItem {
  id: number;
  name: string;
  description?: string;
}

@Injectable()
export class GraphqlService {
  // Define the path to the JSON file in the project root directory
  private readonly filePath = path.join(`${process.cwd()}/src/graphql`, 'items.json');

  constructor() {
    // Ensure the data file exists upon service initialization
    this.initializeStorage();
  }

  /**
   * Checks if the JSON file exists; if not, creates it with initial seed data.
   */
  private initializeStorage(): void {
    if (!fs.existsSync(this.filePath)) {
      const initialData: IGraphqlItem[] = [
        { id: 1, name: 'Initial Item', description: 'Code-first GraphQL resource' }
      ];
      // Create the file with formatting for readability
      fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  }

  /**
   * Reads and parses data from the JSON file.
   */
  private readItems(): IGraphqlItem[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Serializes and saves data to the JSON file.
   */
  private writeItems(items: IGraphqlItem[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
  }

  findAll(): IGraphqlItem[] {
    return this.readItems();
  }

  findOneById(id: number): IGraphqlItem {
    const items = this.readItems();
    /**
     * Explicitly cast ID to Number to ensure strict comparison works 
     * when the ID is passed as a string from the GraphQL layer.
     */
    const numericId = Number(id);
    const item = items.find(item => item.id === numericId);
    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);
    return item;
  }

  create(name: string, description?: string): IGraphqlItem {
    const items = this.readItems();
    const newItem = {
      id: Date.now(), // Simple ID generation
      name,
      description
    };
    items.push(newItem);
    this.writeItems(items);
    return newItem;
  }

  update(id: number, name?: string, description?: string): IGraphqlItem {
    const items = this.readItems();
    /**
     * Convert the incoming ID to a Number. GraphQL ID types often arrive 
     * as strings, which causes 'findIndex' to fail against numeric IDs.
     */
    const numericId = Number(id);
    const index = items.findIndex(item => item.id === numericId);

    if (index === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    if (name) items[index].name = name;
    if (description) items[index].description = description;

    this.writeItems(items);
    return items[index];
  }

  remove(id: number): boolean {
    const items = this.readItems();
    const initialLength = items.length;
    /**
     * Ensure numeric comparison for the filter logic to correctly 
     * identify the item to be removed.
     */
    const numericId = Number(id);
    const filteredItems = items.filter(item => item.id !== numericId);

    // Save the new array only if the length has changed
    if (filteredItems.length < initialLength) {
      this.writeItems(filteredItems);
      return true;
    }
    return false;
  }
}