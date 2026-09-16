const fs = require('fs');
let c = fs.readFileSync('client/pages/CreateRegistry.tsx', 'utf8');
c = c.replace(/partner_1/g, 'bride');
c = c.replace(/partner_2/g, 'groom');
c = c.replace(/Bride \/ Partner 1/g, 'Bride');
c = c.replace(/Groom \/ Partner 2/g, 'Groom');
c = c.replace(/Partner 1 name is required/g, 'Bride name is required');
c = c.replace(/Partner 2 name is required/g, 'Groom name is required');
fs.writeFileSync('client/pages/CreateRegistry.tsx', c);