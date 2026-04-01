import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MongodbService } from './mongodb.service';

@Controller('mongodb')
export class MongodbController {
  constructor(private readonly mongodbService: MongodbService) {}

  // The target collection name in the ULTRASTACK database
  private readonly collectionName = 'items';

  // Endpoint to create a document in the items collection
  @Post()
  async create(@Body() data: any) {
    // Passes the specific 'items' collection name to the service
    return await this.mongodbService.create(this.collectionName, data);
  }

  // Endpoint to retrieve all documents from the items collection
  @Get()
  async findAll() {
    // Fetches all records from the target items collection
    return await this.mongodbService.findAll(this.collectionName);
  }

  // Endpoint to retrieve a single document by ID from the items collection
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Locates a specific document within the items collection using its unique ID
    return await this.mongodbService.findOne(this.collectionName, id);
  }

  // Endpoint to update a document by ID in the items collection
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    // Applies partial updates to a document in the items collection
    return await this.mongodbService.update(this.collectionName, id, data);
  }

  // Endpoint to delete a document by ID from the items collection
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Permanently removes a document from the items collection
    return await this.mongodbService.remove(this.collectionName, id);
  }
}