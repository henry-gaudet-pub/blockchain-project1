## Overview
A simple blockchain implementation for managing stars for an observatory

## Dependencies:
```
node.js v10.19.0
```

## Launch the server
`node app.js`

## API
```
/validate    // GET to validate the chain
/blocks/:address    // GET to request stars registered by an owner
/block/:hash     // GET to retrieve of a block by hash
/submitstar    // POST  to submit a star
/requestValidation    // POST to request ownership of a wallet address
/block/:height    // GET a block by height
```
## Testing
`node test/test.js`

