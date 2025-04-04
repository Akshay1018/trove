import { pool } from '../config/database';
import { logger } from '../utils/logger';

export interface Example {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export class ExampleModel {
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS examples (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await pool.query(query);
      logger.info('Examples table created successfully');
    } catch (error) {
      logger.error('Error creating examples table:', error);
      throw error;
    }
  }

  static async create(example: Omit<Example, 'id' | 'created_at' | 'updated_at'>): Promise<Example> {
    const query = `
      INSERT INTO examples (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;

    try {
      const { rows } = await pool.query(query, [example.name, example.description]);
      return rows[0];
    } catch (error) {
      logger.error('Error creating example:', error);
      throw error;
    }
  }

  static async findAll(): Promise<Example[]> {
    const query = 'SELECT * FROM examples ORDER BY created_at DESC;';

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      logger.error('Error finding examples:', error);
      throw error;
    }
  }

  static async findById(id: number): Promise<Example | null> {
    const query = 'SELECT * FROM examples WHERE id = $1;';

    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error('Error finding example by id:', error);
      throw error;
    }
  }

  static async update(id: number, example: Partial<Example>): Promise<Example | null> {
    const fields = Object.keys(example)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE examples
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;

    try {
      const values = [id, ...Object.values(example)];
      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      logger.error('Error updating example:', error);
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM examples WHERE id = $1 RETURNING *;';

    try {
      const { rowCount } = await pool.query(query, [id]);
      return rowCount > 0;
    } catch (error) {
      logger.error('Error deleting example:', error);
      throw error;
    }
  }
} 