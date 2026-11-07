const fs = require("fs");
const path = require("path");

/**
 * Extract all href and src attributes from an HTML file that are not external URLs,
 * mailto:, tel:, #, or javascript:.
 * Resolve them relative to the file's directory (for relative paths) or from the repo root (for root-relative paths).
 * Return a list of paths that do not exist as files.
 * 
 * @param {string} htmlFilePath - Path to the HTML file to check
 * @param {string} repoRoot - Root directory of the repository
 * @returns {string[]} - Array of broken link paths
 */
function checkLinks(htmlFilePath, repoRoot) {
  const html = fs.readFileSync(htmlFilePath, "utf8");
  const fileDir = path.dirname(htmlFilePath);
  
  // Regex to find href and src attributes
  const attrRegex = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  const brokenLinks = [];
  
  let match;
  while ((match = attrRegex.exec(html)) !== null) {
    const url = match[1].trim();
    
    // Skip external URLs, mailto:, tel:, #, javascript:, data:
    if (url.startsWith("http://") || 
        url.startsWith("https://") || 
        url.startsWith("mailto:") || 
        url.startsWith("tel:") || 
        url.startsWith("#") || 
        url.startsWith("javascript:") ||
        url.startsWith("data:")) {
      continue;
    }
    
    // Remove query string and fragment
    const cleanUrl = url.split("?")[0].split("#")[0];
    
    if (!cleanUrl) continue;
    
    let resolvedPath;
    if (cleanUrl.startsWith("/")) {
      // Root-relative path - resolve from repo root
      resolvedPath = path.join(repoRoot, cleanUrl.slice(1));
    } else {
      // Relative path - resolve from file's directory
      resolvedPath = path.join(fileDir, cleanUrl);
    }
    
    // Normalize the path
    resolvedPath = path.normalize(resolvedPath);
    
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      brokenLinks.push({
        original: url,
        resolved: resolvedPath,
        fromFile: htmlFilePath
      });
    }
  }
  
  return brokenLinks;
}

module.exports = { checkLinks };