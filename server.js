const express = require('express');
const app = express();
const port = 5000;

const { username, password } = require('./credentials/credentials');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://${username}:${password}@ds143070.mlab.com:43070/eda`)
mongoose.connection.once('error', () => console.log('error connecting to db'))
app.use(require('cors')());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let Schema = require('./server/schemas/collections.js');



app.use('/api/auth', require('./server/auth/auth'));

////////////////////
app.use('/api/faculty', require('./server/data/faculty_data'));
//  /api/faculty/:fac_id    will give data for faculty home page.

//////////////////////////
app.use('/api/admin', require('./server/data/admin_data'));
//  /api/admin/    will give data for admin home page.


///////////////////////////////
app.listen(port, () => {
  console.log('listening to port ' + port);
})