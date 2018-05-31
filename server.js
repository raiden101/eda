const express = require('express');
const app = express();
const port = 5000;

let Schema = require('./server/schemas/schemas.js')



app.listen(port, () => {
  console.log('listening to port ' + port);
})