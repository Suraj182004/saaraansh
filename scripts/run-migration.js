const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the SQL file
const sqlFilePath = path.join(__dirname, 'update-schema-clerk.sql');

// Check if the SQL file exists
if (!fs.existsSync(sqlFilePath)) {
  console.error('SQL file not found at:', sqlFilePath);
  process.exit(1);
}

// Read SQL content
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
console.log('SQL content loaded from:', sqlFilePath);

try {
  console.log('Running migration to update schema for Clerk user IDs...');
  
  // Get database URL from .env files
  require('dotenv').config({ path: path.join(__dirname, '.env') });
  
  // If not found, try parent directory .env.local
  if (!process.env.DATABASE_URL) {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
  }
  
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('DATABASE_URL not found in environment variables');
    console.error('Please create a .env file in the scripts directory with DATABASE_URL');
    process.exit(1);
  }
  
  console.log('Database URL found!');
  
  // If running on Windows, we need special handling
  if (process.platform === 'win32') {
    console.log('Using Windows-specific command...');
    // Create a temporary SQL file to run
    const tempSqlFile = path.join(__dirname, 'temp-migration.sql');
    fs.writeFileSync(tempSqlFile, sqlContent);
    
    // Run psql command
    try {
      execSync(`npx -p postgres-client psql "${dbUrl}" -f "${tempSqlFile}"`, { 
        stdio: 'inherit'
      });
      console.log('Migration successfully applied!');
    } catch (error) {
      console.error('Migration failed:', error.message);
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempSqlFile)) {
        fs.unlinkSync(tempSqlFile);
      }
    }
  } else {
    // For non-Windows, we can pipe the SQL content directly
    console.log('Using non-Windows command...');
    execSync(`echo "${sqlContent}" | npx -p postgres-client psql "${dbUrl}"`, { 
      stdio: 'inherit' 
    });
    console.log('Migration successfully applied!');
  }
} catch (error) {
  console.error('Error executing migration:', error.message);
  process.exit(1);
} 