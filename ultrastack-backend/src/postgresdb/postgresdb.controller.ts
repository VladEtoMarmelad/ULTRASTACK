import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostgresdbService } from './postgresdb.service';

@Controller('postgresdb')
export class PostgresdbController {
  constructor(private readonly postgresdbService: PostgresdbService) {}

  // The target table name in the PostgreSQL database
  private readonly tableName = 'items';

  // Endpoint to create a record in the items table
  @Post()
  async create(@Body() data: unknown) {
    // Passes the specific 'items' table name to the service
    return await this.postgresdbService.create(this.tableName, data);
  }

  // Endpoint to retrieve all records from the items table
  @Get()
  async findAll() {
    // Fetches all rows from the target items table
    return await this.postgresdbService.findAll(this.tableName);
  }

  // Endpoint to retrieve a single record by ID from the items table
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Locates a specific record within the items table using its unique ID
    return await this.postgresdbService.findOne(this.tableName, id);
  }

  // Endpoint to update a record by ID in the items table
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: unknown,
  ) {
    // Applies updates to columns in the items table record
    return await this.postgresdbService.update(this.tableName, id, data);
  }

  // Endpoint to delete a record by ID from the items table
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Permanently removes a record from the items table
    return await this.postgresdbService.remove(this.tableName, id);
  }
}