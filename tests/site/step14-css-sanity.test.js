const fs = require("fs");

function checkBraces(css, filename) {
    let depth = 0;
    const errors = [];
    for (let i = 0; i < css.length; i++) {
        if (css[i] === "{") depth++;
        else if (css[i] === "}") depth--;
        if (depth < 0) {
            errors.push(`Unmatched } at position ${i}`);
            break;
        }
    }
    if (depth !== 0) {
        errors.push(`Unbalanced braces: ${depth} unclosed {`);
    }
    return errors;
}

// Test (a): braces are balanced in css/tools.css and css/paye-calculator.css
const toolsCss = fs.readFileSync("css/tools.css", "utf8");
const payeCss = fs.readFileSync("css/paye-calculator.css", "utf8");

const toolsBraceErrors = checkBraces(toolsCss, "tools.css");
if (toolsBraceErrors.length > 0) {
    throw new Error(`css/tools.css: ${toolsBraceErrors.join(", ")}`);
}
console.log("  css/tools.css: braces balanced");

const payeBraceErrors = checkBraces(payeCss, "paye-calculator.css");
if (payeBraceErrors.length > 0) {
    throw new Error(`css/paye-calculator.css: ${payeBraceErrors.join(", ")}`);
}
console.log("  css/paye-calculator.css: braces balanced");

// Test (b): css/tools.css contains no content: attr( and no pseudo-element content with letters
if (toolsCss.includes("content: attr(")) {
    throw new Error("css/tools.css contains content: attr(");
}
console.log("  css/tools.css: no content: attr(");

// Check for pseudo-element content with letters (not just empty string "")
const contentMatches = toolsCss.match(/content:\s*["']([^"']*)["']/g) || [];
for (const match of contentMatches) {
    if (match.includes("content:") && !match.includes('content: ""') && !match.includes("content: ''")) {
        throw new Error(`css/tools.css has pseudo-element content with text: ${match}`);
    }
}
console.log("  css/tools.css: no pseudo-element content with letters");

// Test (c): tools.html has anchor with text "Open the calculator" and href paye-calculator.html
const html = fs.readFileSync("tools.html", "utf8");
if (!html.includes('href="paye-calculator.html"')) {
    throw new Error("tools.html missing href=\"paye-calculator.html\"");
}
if (!html.includes("Open the calculator")) {
    throw new Error("tools.html missing text \"Open the calculator\"");
}
if (!html.includes('href="contact.html"')) {
    throw new Error("tools.html missing href=\"contact.html\"");
}
if (!html.includes("Contact APSIS")) {
    throw new Error("tools.html missing text \"Contact APSIS\"");
}
console.log("  tools.html: has correct anchors with correct text and hrefs");

// Test (d): .pc-notes has a border rule and padding in the CSS (main block, not media query)
// Find all .pc-notes blocks and check the main one (not in @media)
const pcNotesBlocks = [...payeCss.matchAll(/\.pc-notes\s*\{[\s\S]*?\}/g)];
if (pcNotesBlocks.length === 0) {
    throw new Error("css/paye-calculator.css: .pc-notes rule not found");
}
// Find the main block (not inside @media) - it should have border and padding
let foundMainBlock = false;
for (const match of pcNotesBlocks) {
    const block = match[0];
    // Skip media query blocks (they only have padding, no border)
    if (block.includes("border:") && block.includes("padding:")) {
        foundMainBlock = true;
        break;
    }
}
if (!foundMainBlock) {
    throw new Error("css/paye-calculator.css: .pc-notes main block missing border or padding");
}
console.log("  css/paye-calculator.css: .pc-notes main block has border and padding");

console.log("Step 14 CSS sanity test passed.");