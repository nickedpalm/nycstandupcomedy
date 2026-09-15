// Load keys from an env file when they are not already in the environment.
// Looks at ENV_FILE, then Mazzie's profile env inside her container. Never prints values.
'use strict';
const fs = require('fs');
module.exports = function loadEnv(keys) {
  if (keys.every((k) => process.env[k])) return;
  for (const file of [process.env.ENV_FILE, '/opt/data/profiles/comedy/.env'].filter(Boolean)) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/); if (!m || !keys.includes(m[1]) || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
    if (keys.every((k) => process.env[k])) return;
  }
};
