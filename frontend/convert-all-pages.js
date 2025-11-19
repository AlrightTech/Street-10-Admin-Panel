// This script converts all Next.js pages to React Router pages
// Run with: node convert-all-pages.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Remove 'use client'
  if (content.includes("'use client'") || content.includes('"use client"')) {
    content = content.replace(/'use client'\s*\n\s*\n?/g, '');
    content = content.replace(/"use client"\s*\n\s*\n?/g, '');
    changed = true;
  }

  // Replace Next.js imports
  if (content.includes("from 'next/navigation'") || content.includes('from "next/navigation"')) {
    content = content.replace(/import\s+{\s*useRouter\s*}\s+from\s+['"]next\/navigation['"]/g, 
      "import { useNavigate } from 'react-router-dom'");
    content = content.replace(/import\s+{\s*useParams\s*}\s+from\s+['"]next\/navigation['"]/g, 
      "import { useParams } from 'react-router-dom'");
    content = content.replace(/import\s+{\s*useRouter,\s*useParams\s*}\s+from\s+['"]next\/navigation['"]/g, 
      "import { useNavigate, useParams } from 'react-router-dom'");
    changed = true;
  }

  if (content.includes("from 'next/link'") || content.includes('from "next/link"')) {
    content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"]/g, 
      "import { Link } from 'react-router-dom'");
    changed = true;
  }

  // Replace router usage
  if (content.includes('useRouter()')) {
    content = content.replace(/const\s+router\s*=\s*useRouter\(\)/g, 'const navigate = useNavigate()');
    changed = true;
  }

  if (content.includes('router.push') || content.includes('router.back')) {
    content = content.replace(/router\.push\(/g, 'navigate(');
    content = content.replace(/router\.back\(\)/g, 'navigate(-1)');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Find all page.tsx files
function findPages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findPages(filePath, fileList);
    } else if (file === 'page.tsx') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const appDir = path.join(__dirname, 'src', 'app');
const pages = findPages(appDir);

console.log(`Found ${pages.length} page files to convert...`);

let converted = 0;
pages.forEach(page => {
  if (convertFile(page)) {
    converted++;
    console.log(`✓ Converted: ${path.relative(__dirname, page)}`);
  }
});

console.log(`\n✅ Converted ${converted} files!`);

