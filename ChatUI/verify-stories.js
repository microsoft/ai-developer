const { globSync } = require('glob');
const fs = require('fs');
const path = require('path');

console.log('Verifying Storybook stories...');

// Find all story files
const storyFiles = globSync('src/**/*.stories.{jsx,tsx}');
console.log('Story files found:', storyFiles);

if (storyFiles.length === 0) {
  console.error('No story files found!');
  process.exit(1);
}

console.log(`Found ${storyFiles.length} story files.`);

// Check each story file
let errors = 0;

for (const storyFile of storyFiles) {
  try {
    console.log(`\nVerifying ${storyFile}...`);
    const fileContent = fs.readFileSync(storyFile, 'utf-8');
    
    // Check for Meta export
    if (!fileContent.includes('export default')) {
      console.error(`- ERROR: No default export found in ${storyFile}`);
      errors++;
    } else {
      console.log(`- Has default Meta export ✓`);
    }
    
    // Check for Story exports
    const storyExportMatches = fileContent.match(/export const \w+: Story/g) || [];
    if (storyExportMatches.length === 0) {
      console.error(`- ERROR: No Story exports found in ${storyFile}`);
      errors++;
    } else {
      console.log(`- Found ${storyExportMatches.length} Story exports ✓`);
      storyExportMatches.forEach(match => {
        console.log(`  - ${match.replace('export const ', '').replace(': Story', '')}`);
      });
    }
    
  } catch (error) {
    console.error(`Error processing ${storyFile}:`, error);
    errors++;
  }
}

console.log('\n---------------------------------');
if (errors === 0) {
  console.log(`✅ All ${storyFiles.length} story files verified successfully!`);
  process.exit(0);
} else {
  console.error(`❌ Found ${errors} errors in story files.`);
  process.exit(1);
} 