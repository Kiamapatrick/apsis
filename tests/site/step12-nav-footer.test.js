const fs = require("fs");
const path = require("path");
const { checkLinks } = require("./helpers/linkcheck.js");

// Find all HTML files
function findHtmlFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findHtmlFiles(fullPath));
        } else if (entry.name.endsWith(".html")) {
            files.push(fullPath);
        }
    }
    return files;
}

const repoRoot = path.resolve(".");
const htmlFiles = findHtmlFiles(repoRoot);
const navFiles = htmlFiles.filter(f => fs.readFileSync(f, "utf8").includes('id="mainNav"'));

console.log(`Checking ${navFiles.length} files with navbar...`);

let allPassed = true;
const errors = [];

for (const file of navFiles) {
    const content = fs.readFileSync(file, "utf8");
    const relPath = path.relative(repoRoot, file);
    
    // Determine nav prefix based on file location
    const isRootLevel = !relPath.includes(path.sep) || relPath === "tools.html" || relPath === "paye-calculator.html";
    const isContentLevel1 = relPath.startsWith("content") && !relPath.includes("content" + path.sep + "blogs") && !relPath.includes("content" + path.sep + "insights");
    const isContentLevel2 = relPath.includes("content" + path.sep + "blogs") || relPath.includes("content" + path.sep + "insights");
    
    let navPrefix = "";
    if (isRootLevel) {
        navPrefix = "";
    } else if (isContentLevel1) {
        navPrefix = "../";
    } else if (isContentLevel2) {
        navPrefix = "../../";
    } else {
        navPrefix = "../";
    }

    const expectedToolsHref = `${navPrefix}tools.html`;
    const expectedPayeHref = `${navPrefix}paye-calculator.html`;

    const isToolsPage = relPath === "tools.html";
    const isPayePage = relPath === "paye-calculator.html";

    // Check navbar Tools link
    const navSection = content.split('id="mainNav"')[1]?.split("</nav>")[0] || "";
    const toolsNavLink = navSection.match(new RegExp(`<li class="nav-item"><a class="nav-link(?: active)?" href="${expectedToolsHref.replace(/\./g, "\\.")}">Tools</a></li>`));
    
    if (!toolsNavLink) {
        errors.push(`${relPath}: Missing or incorrect navbar Tools link (expected href="${expectedToolsHref}")`);
        allPassed = false;
    } else {
        // Check active class on tools.html and paye-calculator.html
        const hasActive = toolsNavLink[0].includes('class="nav-link active"');
        if ((isToolsPage || isPayePage) && !hasActive) {
            errors.push(`${relPath}: Navbar Tools link missing active class`);
            allPassed = false;
        } else if (!isToolsPage && !isPayePage && hasActive) {
            errors.push(`${relPath}: Navbar Tools link should not have active class`);
            allPassed = false;
        }
    }

    // Check footer Company column Tools link
    const companySection = content.split('aria-label="Company"')[1]?.split("</nav>")[0] || "";
    const toolsFooterLink = companySection.match(/<li><a href="\/tools\.html">Tools<\/a><\/li>/);
    if (!toolsFooterLink) {
        errors.push(`${relPath}: Missing footer Company column Tools link`);
        allPassed = false;
    }

    // Check footer Services column PAYE Calculator link
    const servicesSection = content.split('aria-label="Services"')[1]?.split("</nav>")[0] || "";
    const payeFooterLink = servicesSection.match(/<li><a href="\/paye-calculator\.html">PAYE Calculator<\/a><\/li>/);
    if (!payeFooterLink) {
        errors.push(`${relPath}: Missing footer Services column PAYE Calculator link`);
        allPassed = false;
    }

    // Linkcheck on nav and footer links
    const broken = checkLinks(file, repoRoot);
    const navFooterBroken = broken.filter(b => {
        const href = b.original;
        return href === expectedToolsHref || href === expectedPayeHref || href === "/tools.html" || href === "/paye-calculator.html";
    });
    if (navFooterBroken.length > 0) {
        errors.push(`${relPath}: Broken nav/footer links: ${JSON.stringify(navFooterBroken)}`);
        allPassed = false;
    }
}

if (!allPassed) {
    console.error("FAILED:");
    for (const e of errors) {
        console.error("  " + e);
    }
    throw new Error("Navbar/footer link checks failed");
}

console.log("Step 12 nav-footer test passed.");