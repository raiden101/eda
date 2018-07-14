const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');

const port = 5000;

const check_token_gen = require('./server/utils/check_token');
const admin_check_token = check_token_gen(admin_flag = true);
const faculty_check_token = check_token_gen(admin_flag = false);

const { username, password } = require("./credentials/credentials");

mongoose
	.connect(`mongodb://${username}:${password}@ds143070.mlab.com:43070/eda`)
	.then(data => console.log("connected to db."))
	.catch(err => console.log("couldnt connect to the db."));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/auth", require("./server/auth/auth"));

app.use(
	"/api/faculty", 
	faculty_check_token,
	require("./server/routes/faculty_routes")
);

app.use(
	"/api/admin", 
	admin_check_token,
	require("./server/routes/admin_routes"));

app.use(express.static(path.join(__dirname, './build')));

///////////////////////////////
app.listen(port, () => console.log("listening to port " + port));
