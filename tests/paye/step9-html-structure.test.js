const fs = require("fs");

const html = fs.readFileSync("paye-calculator.html", "utf8");

// Helper to count opening and closing tags
function countTags(html, tagName) {
  const openRegex = new RegExp("<" + tagName + "(?:\\s|>|/)", "gi");
  const closeRegex = new RegExp("</" + tagName + ">", "gi");
  const opens = (html.match(openRegex) || []).length;
  const closes = (html.match(closeRegex) || []).length;
  return { opens, closes };
}

const tags = ["form", "div", "details", "section", "table", "fieldset"];
for (const tag of tags) {
  const { opens, closes } = countTags(html, tag);
  if (opens !== closes) {
    throw new Error(`Tag mismatch for <${tag}>: ${opens} opening, ${closes} closing`);
  }
  console.log(`  <${tag}>: ${opens} opening, ${closes} closing - OK`);
}

// Check that #pcForm does not contain .pc-output
const formStart = html.indexOf('<form class="pc-form" id="pcForm"');
if (formStart === -1) {
  throw new Error("Could not find <form id=\"pcForm\">");
}
const formEnd = html.indexOf("</form>", formStart);
if (formEnd === -1) {
  throw new Error("Could not find closing </form> for #pcForm");
}
const formContent = html.substring(formStart, formEnd);
if (formContent.includes("pc-output")) {
  throw new Error("#pcForm contains .pc-output (form not properly closed before pc-output)");
}

console.log("Step 9 HTML structure test passed.");