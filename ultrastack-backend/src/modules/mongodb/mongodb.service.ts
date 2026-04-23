import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, Collection, ObjectId, Document, UpdateResult, DeleteResult, InsertOneResult } from 'mongodb';

@Injectable()
export class MongodbService implements OnModuleInit, OnModuleDestroy {
  private client!: MongoClient;
  private db!: Db;

  constructor(private readonly configService: ConfigService) {}

  // Lifecycle hook: connects to MongoDB when the module initializes
  async onModuleInit() {
    const user = this.configService.get<string>('MONGODB_USER');
    const password = this.configService.get<string>('MONGODB_PASSWORD');
    const dbName = this.configService.get<string>('MONGODB_NAME');

    // Constructing MongoDB Atlas connection string
    // Note: Ensure your environment also provides the cluster URL if it's not part of the logic
    const uri = `mongodb+srv://${user}:${password}@cluster0.j3o0frw.mongodb.net/?appName=Cluster0`

    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db(dbName);
  }

  // Lifecycle hook: closes connection when the application shuts down
  async onModuleDestroy() {
    await this.client.close();
  }

  // Helper method to access a specific collection
  private getCollection(collectionName: string): Collection<Document> { // Returns a typed MongoDB collection
    return this.db.collection(collectionName);
  }

  // Create a new document
  async create(collection: string, data: Document): Promise<InsertOneResult<Document>> { // Returns insertion metadata
    return await this.getCollection(collection).insertOne(data);
  }

  // Find all documents in a collection
  async findAll(collection: string): Promise<Document[]> { // Returns an array of database documents
    return await this.getCollection(collection).find().toArray();
  }

  // Find one document by its hex string ID
  async findOne(collection: string, id: string): Promise<Document | null> { // Returns a single document or null if not found
    return await this.getCollection(collection).findOne({ _id: new ObjectId(id) });
  }

  // Update a document by ID using $set operator
  async update(collection: string, id: string, data: Document): Promise<UpdateResult<Document>> { // Returns update metadata
    return await this.getCollection(collection).updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  // Delete a document by ID
  async remove(collection: string, id: string): Promise<DeleteResult> { // Returns deletion metadata
    return await this.getCollection(collection).deleteOne({ _id: new ObjectId(id) });
  }
}