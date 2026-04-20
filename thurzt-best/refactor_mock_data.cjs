const fs = require('fs');
let content = fs.readFileSync('./services/mockData.ts', 'utf8');

// Replace culturalIdentities with heritage
content = content.replace(/culturalIdentities/g, 'heritage');

// Replace intentions with goals
content = content.replace(/intentions/g, 'goals');

// Replace type: "individual" with type: "single"
content = content.replace(/type:\s*"individual"/g, 'type: "single"');
content = content.replace(/type:\s*'individual'/g, "type: 'single'");

// Replace plan and imCreditsBalance with entitlements
content = content.replace(/plan:\s*("FREE"|"PLUS"|"PRO"|'FREE'|'PLUS'|'PRO'),?/g, (match, p1) => {
  return `entitlements: { plan: ${p1}, imCredits: 0, ghostMode: false, privatePhotos: false },`;
});

content = content.replace(/imCreditsBalance:\s*\d+,?/g, '');

fs.writeFileSync('./services/mockData.ts', content, 'utf8');
