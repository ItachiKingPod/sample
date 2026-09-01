const fs = require('fs');

fs.writeFileSync('./values.json', JSON.stringify(process.env, null, 2));