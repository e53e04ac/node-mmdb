# node-mmdb

## Requirements

- Node.js (v15)
- MMDB database file (v2.0)

## Installation

~~~~~ sh
npm install e53e04ac/node-mmdb
~~~~~

## Example

~~~~~ js
const { MMDB } = require('node-mmdb');
const mmdb = MMDB({ mmdbFilePath: 'path/to/database.mmdb' });
await mmdb.load();
const data = await mmdb.lookup({ address: '8.8.8.8' });
console.dir({ data }, { depth: Infinity });
await mmdb.unload();
~~~~~
