import os
import re

folder = r'c:\Users\ADMIN\Downloads\new work\apsis-new\content'

html_files = []
for root, dirs, files in os.walk(folder):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="hubHamburger"' in content:
        continue

    # Insert hamburger button
    hamburger_html = '''
          <button class="hub-hamburger" id="hubHamburger" aria-label="Toggle menu">
              <i class="bi bi-list"></i>
          </button>'''
          
    content = re.sub(r'(<a href="[^"]*?contact\.html" class="hub-cta-btn">.*?</a>)', r'\1' + hamburger_html, content, flags=re.DOTALL)
    
    # Insert JS
    js_code = '''
    const hubHamburger = document.getElementById('hubHamburger');
    const hubTabs = document.querySelector('.hub-tabs');
    if (hubHamburger && hubTabs) {
        hubHamburger.addEventListener('click', () => {
            hubTabs.classList.toggle('open');
            hubHamburger.classList.toggle('active');
        });
    }'''
    
    content = content.replace('</script>\n</body>', js_code + '\n  </script>\n</body>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Updated HTML files.')
