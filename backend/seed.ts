import { DataSource } from 'typeorm';
import { runSeeder } from './src/config/seeder';
import { generateExampleSeeds } from './src/config/seed-generator';
import { database } from './src/config/database.config';
import { findOrCreateDirectory } from './src/utils/findOrCreateDirectory.util';
import path from 'path';

async function main() {
  try {
    // Create seeds directory structure
    const seedsPath = path.join(process.cwd(), 'seeds');
    findOrCreateDirectory(seedsPath);
    findOrCreateDirectory(path.join(seedsPath, 'establishments'));
    findOrCreateDirectory(path.join(seedsPath, 'products'));
    findOrCreateDirectory(path.join(seedsPath, 'accounts'));

    // Initialize the database connection
    const dataSource = await database.initialize();
    console.log('Database connection initialized');

    // Generate example seed files
    console.log('\nGenerating example seed files...');
    await generateExampleSeeds(dataSource);

    // Run the seeder
    console.log('\nRunning seeder...');
    await runSeeder(dataSource);

    // Close the database connection
    await dataSource.destroy();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main(); 