const fs = require("fs");
const path = require("path");

const distDir = path.resolve("dist");

function fixFileImports(filePath) {
  let code = fs.readFileSync(filePath, "utf8");

  // Match: import ... from './...'
  code = code.replace(
    /((?:import|export)\s.*?from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
    (match, start, importPath, end) => {
      if (importPath.endsWith(".js") || importPath.endsWith(".json")) {
        return match;
      }
      return `${start}${importPath}.js${end}`;
    }
  );

  // Also handle dynamic imports: await import('./file')
  code = code.replace(
    /(import\(\s*['"])(\.{1,2}\/[^'"]+)(['"]\s*\))/g,
    (match, start, importPath, end) => {
      if (importPath.endsWith(".js") || importPath.endsWith(".json")) {
        return match;
      }
      return `${start}${importPath}.js${end}`;
    }
  );

  fs.writeFileSync(filePath, code, "utf8");
}

function walkDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".js")) {
      fixFileImports(fullPath);
    }
  }
}

walkDir(distDir);
console.log("✅ Fixed ESM import paths with .js extensions.");
