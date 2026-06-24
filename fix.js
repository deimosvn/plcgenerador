const fs = require('fs');
const files = ['src/components/landing-page.tsx', 'src/components/plc-generator-page.tsx'];
files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/const fadeInUp = \{/g, 'const fadeInUp: any = {');
  code = code.replace(/const staggerContainer = \{/g, 'const staggerContainer: any = {');
  fs.writeFileSync(f, code);
  console.log('Fixed', f);
});
