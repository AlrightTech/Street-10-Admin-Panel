const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files
const files = glob.sync('src/app/**/page.tsx', { cwd: __dirname });

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove 'use client' directive
  content = content.replace(/'use client'\s*\n\s*\n?/g, '');
  content = content.replace(/"use client"\s*\n\s*\n?/g, '');
  
  // Replace Next.js imports with React Router
  content = content.replace(/import\s+{\s*useRouter\s*}\s+from\s+['"]next\/navigation['"]/g, 
    "import { useNavigate } from 'react-router-dom'");
  content = content.replace(/import\s+{\s*useParams\s*}\s+from\s+['"]next\/navigation['"]/g, 
    "import { useParams } from 'react-router-dom'");
  content = content.replace(/import\s+{\s*useRouter,\s*useParams\s*}\s+from\s+['"]next\/navigation['"]/g, 
    "import { useNavigate, useParams } from 'react-router-dom'");
  content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"]/g, 
    "import { Link } from 'react-router-dom'");
  
  // Replace router usage
  content = content.replace(/const\s+router\s*=\s*useRouter\(\)/g, 'const navigate = useNavigate()');
  content = content.replace(/router\.push\(/g, 'navigate(');
  content = content.replace(/router\.back\(\)/g, 'navigate(-1)');
  content = content.replace(/router\.replace\(/g, 'navigate(..., { replace: true })');
  
  // Fix navigate with replace
  content = content.replace(/navigate\(([^,]+),\s*{\s*replace:\s*true\s*}\)/, 'navigate($1, { replace: true })');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Converted: ${file}`);
});

console.log(`\nConverted ${files.length} files!`);

