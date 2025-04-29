import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { DataSource } from 'typeorm';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

interface FieldInfo {
  name: string;
  type: string;
  isNullable: boolean;
  isArray: boolean;
  defaultValue?: any;
}

export class SeedGenerator {
  private dataSource: DataSource;
  private seedsPath: string;

  constructor(dataSource: DataSource, seedsPath: string) {
    this.dataSource = dataSource;
    this.seedsPath = seedsPath;
  }

  private getFieldInfo(entity: any): FieldInfo[] {
    const fields: FieldInfo[] = [];
    const metadata = this.dataSource.getMetadata(entity);

    for (const column of metadata.columns) {
      fields.push({
        name: column.propertyName,
        type: column.type.toString(),
        isNullable: column.isNullable,
        isArray: column.isArray,
        defaultValue: column.default
      });
    }

    return fields;
  }

  private generateExampleValue(field: FieldInfo): any {
    if (field.isArray) {
      return [];
    }

    switch (field.type.toLowerCase()) {
      case 'string':
        return field.name === 'id' ? 'example-id' : `Example ${field.name}`;
      case 'number':
      case 'int':
      case 'integer':
        return 0;
      case 'decimal':
      case 'float':
        return 0.0;
      case 'boolean':
        return true;
      case 'date':
        return new Date().toISOString();
      case 'text':
        return `This is an example ${field.name} text.`;
      default:
        return null;
    }
  }

  private generateExampleData(entity: any): any {
    const fields = this.getFieldInfo(entity);
    const data: any = {};

    for (const field of fields) {
      if (field.name !== 'id') { // Skip id as it will be set by filename
        data[field.name] = this.generateExampleValue(field);
      }
    }

    return data;
  }

  public async generateExampleSeeds() {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const entityName = entity.name.toLowerCase();
      const entityPath = path.join(this.seedsPath, entityName);

      // Create directory if it doesn't exist
      try {
        await mkdir(entityPath, { recursive: true });
      } catch (error: any) {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      }

      // Generate example data
      const exampleData = this.generateExampleData(entity.target);
      const fileName = path.join(entityPath, 'example.json');

      await writeFile(
        fileName,
        JSON.stringify(exampleData, null, 2),
        'utf8'
      );

      console.log(`Generated example seed for ${entityName}`);
    }
  }
}

// Example usage:
export async function generateExampleSeeds(dataSource: DataSource) {
  const generator = new SeedGenerator(
    dataSource,
    path.join(process.cwd(), 'seeds')
  );

  await generator.generateExampleSeeds();
  console.log('Example seed files generated successfully!');
} 