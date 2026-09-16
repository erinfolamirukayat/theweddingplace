const fs = require('fs');
let c = fs.readFileSync('client/components/ContributionForm.tsx', 'utf8');

c = c.replace(/email: formData\.email\.trim\(\),/g, 'email: formData.email.trim() || \'anonymous@celebron.co\',');

fs.writeFileSync('client/components/ContributionForm.tsx', c);