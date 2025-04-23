const fs = require('fs');
const path = require('path');

const contentDirs = [
  path.join(__dirname, 'src', 'content', 'pages'),
  path.join(__dirname, 'src', 'content', 'posts')
];

function parsePelicanFrontmatter(content) {
  const lines = content.split('\n');
  const frontmatter = {};
  let contentStartIndex = 0;
  let inFrontmatter = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' && i > 0) { // Stop at the first blank line after potential frontmatter
        // Check if the previous line was actually frontmatter or just content start
        if (Object.keys(frontmatter).length > 0) {
           contentStartIndex = i + 1;
           break;
        } else {
            // No frontmatter detected before blank line, treat as content start
            contentStartIndex = 0;
            inFrontmatter = false; // Signal that no frontmatter was found
            break;
        }
    }

    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)/);
    if (match) {
      const key = match[1].toLowerCase(); // Convert keys to lowercase for consistency
      let value = match[2].trim();

      // Attempt to parse date into ISO format
      if (key === 'date') {
        try {
          // Handle common date format YYYY-MM-DD HH:MM
          const dateValue = new Date(value.replace(' ', 'T') + 'Z'); // Assume UTC
          if (!isNaN(dateValue)) {
            value = dateValue.toISOString();
          } else {
             console.warn(`  - Could not parse date "${value}". Keeping original.`);
          }
        } catch (e) {
          console.warn(`  - Error parsing date "${value}": ${e}. Keeping original.`);
        }
      }
      frontmatter[key] = value;
    } else {
      // If we encounter a line that doesn't match Key: Value format *before* a blank line,
      // assume frontmatter (if any) has ended or wasn't there.
      if (Object.keys(frontmatter).length > 0) {
           contentStartIndex = i; // Content starts here
           break;
      } else {
          // No frontmatter detected, content starts at the beginning
          contentStartIndex = 0;
          inFrontmatter = false; // Signal that no frontmatter was found
          break;
      }
    }
     // If loop finishes without breaking, content starts after the last line processed
     if (i === lines.length - 1) {
        contentStartIndex = lines.length;
     }
  }

  const mainContent = lines.slice(contentStartIndex).join('\n').trim();
  return { frontmatter, mainContent, frontmatterFound: inFrontmatter && Object.keys(frontmatter).length > 0 };
}

function convertFile(filePath) {
  console.log(`Processing ${path.basename(filePath)}...`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, mainContent, frontmatterFound } = parsePelicanFrontmatter(content);

  if (!frontmatterFound) {
      console.log(`  - No valid frontmatter found. Skipping conversion.`);
      return;
  }

  if (Object.keys(frontmatter).length === 0) {
      console.log(`  - Empty frontmatter after parsing. Original content might not be standard Pelican. Skipping.`);
      return;
  }


  let yamlFrontmatter = '---\n';
  for (const key in frontmatter) {
    // Basic YAML formatting: handle potential quotes if value contains ':' or starts/ends with space
    let value = frontmatter[key];
    if (typeof value === 'string' && (value.includes(':') || value.trim() !== value)) {
        // Crude check for needing quotes. Proper YAML might need more complex handling.
        value = `"${value.replace(/"/g, '\"')}"`; // Escape existing quotes
    }
    yamlFrontmatter += `${key}: ${value}\n`;
  }
  yamlFrontmatter += '---\n\n';

  const newContent = yamlFrontmatter + mainContent;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`  - Converted successfully.`);
}

contentDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}. Skipping.`);
    return;
  }
  console.log(`
Scanning directory: ${dir}`);
  fs.readdirSync(dir).forEach(file => {
    if (path.extname(file).toLowerCase() === '.md') {
      convertFile(path.join(dir, file));
    }
  });
});

console.log('\nConversion process finished.'); 