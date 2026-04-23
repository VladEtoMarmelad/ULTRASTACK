import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class PostgresdbService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;

  constructor(private readonly configService: ConfigService) {}

  // Lifecycle hook: initializes the PostgreSQL connection pool
  async onModuleInit() {
    this.pool = new Pool({
      host: this.configService.get<string>('POSTGRESDB_HOST'),
      port: this.configService.get<number>('POSTGRESDB_PORT'),
      user: this.configService.get<string>('POSTGRESDB_USER'),
      password: this.configService.get<string>('POSTGRESDB_PASSWORD'),
      database: this.configService.get<string>('POSTGRESDB_NAME'),
    });

    // Verifies the connection to the database
    await this.pool.connect();
  }

  // Lifecycle hook: shuts down the connection pool when the application closes
  async onModuleDestroy() {
    await this.pool.end();
  }

  // Create a new record by dynamically mapping keys to columns
  async create(table: string, data: Record<string, unknown>): Promise<QueryResultRow> { // Returns the newly inserted row
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${table} (${keys.join(', ')}) 
      VALUES (${placeholders}) 
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // Find all records from the specified table
  async findAll(table: string): Promise<QueryResultRow[]> { // Returns an array of database rows
    const query = `SELECT * FROM ${table};`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  // Find one record by its ID
  async findOne(table: string, id: string): Promise<QueryResultRow | undefined> { // Returns a single row or undefined if not found
    const query = `SELECT * FROM ${table} WHERE id = $1;`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  // Update a record by ID by dynamically building the SET clause
  async update(table: string, id: string, data: Record<string, unknown>): Promise<QueryResultRow | undefined> { // Returns the updated row
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    // Maps keys to "key = $index" format for SQL
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE ${table} 
      SET ${setClause} 
      WHERE id = $${keys.length + 1} 
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, [...values, id]);
    return result.rows[0];
  }

  // Delete a record by ID
  async remove(table: string, id: string): Promise<QueryResultRow | undefined> { // Returns the row that was deleted
    const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *;`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}