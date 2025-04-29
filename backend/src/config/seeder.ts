import { DataSource } from 'typeorm';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

interface SeederConfig {
  dataSource: DataSource;
  seedsPath: string;
}

interface SeedResult {
  entity: string;
  inserted: number;
  skipped: number;
}

export class Seeder {
  private dataSource: DataSource;
  private seedsPath: string;

  constructor(config: SeederConfig) {
    this.dataSource = config.dataSource;
    this.seedsPath = config.seedsPath;
  }

  private async readJsonFile(filePath: string): Promise<any> {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  }

  private async scanSeedDirectory(entityName: string): Promise<string[]> {
    const entityPath = path.join(this.seedsPath, entityName);
    try {
      const files = await readdir(entityPath);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.warn(`No seed directory found for entity: ${entityName}`);
      return [];
    }
  }

  private async processSeedFile(entityName: string, fileName: string): Promise<boolean> {
    const filePath = path.join(this.seedsPath, entityName, fileName);
    const id = fileName.replace('.json', '');
    
    try {
      const data = await this.readJsonFile(filePath);
      
      // Set the id if not present in the JSON
      if (!data.id) {
        data.id = id;
      }

      const repository = this.dataSource.getRepository(entityName);
      
      // Check if record exists
      const existing = await repository.findOneBy({ id });
      if (existing) {
        console.log(`Skipping ${entityName} with id ${id} - already exists`);
        return false;
      }

      // Insert new record
      await repository.save(data);
      console.log(`Inserted ${entityName} with id ${id}`);
      return true;
    } catch (error) {
      console.error(`Error processing seed file ${filePath}:`, error);
      return false;
    }
  }

  public async seed(): Promise<SeedResult[]> {
    const results: SeedResult[] = [];
    
    try {
      // Get all entity directories
      const entities = await readdir(this.seedsPath);
      
      for (const entityName of entities) {
        const entityPath = path.join(this.seedsPath, entityName);
        const stats = await stat(entityPath);
        
        if (stats.isDirectory()) {
          const seedFiles = await this.scanSeedDirectory(entityName);
          let inserted = 0;
          let skipped = 0;

          for (const file of seedFiles) {
            const wasInserted = await this.processSeedFile(entityName, file);
            if (wasInserted) {
              inserted++;
            } else {
              skipped++;
            }
          }

          results.push({ entity: entityName, inserted, skipped });
        }
      }
    } catch (error) {
      console.error('Error during seeding:', error);
    }

    return results;
  }
}

// Example usage:
export async function runSeeder(dataSource: DataSource) {
  const seeder = new Seeder({
    dataSource,
    seedsPath: path.join(process.cwd(), 'seeds')
  });

  const results = await seeder.seed();
  
  console.log('\nSeeding Results:');
  results.forEach(result => {
    console.log(`${result.entity}:`);
    console.log(`  Inserted: ${result.inserted}`);
    console.log(`  Skipped: ${result.skipped}`);
  });
} 