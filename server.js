const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');

const port = 5000;

const { username, password, url } = require("./credentials/credentials");

mongoose
	.connect(`mongodb://${username}:${password}${url}`)
	.then(data => console.log("connected to db."))
	.catch(err => console.log("couldnt connect to the db."));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/auth", require("./server/auth/auth"));

app.use("/api/faculty", require("./server/routes/faculty_routes"));

app.use("/api/admin", require("./server/routes/admin_routes"));

app.use(express.static(path.join(__dirname, './build')));

///////////////////////////////
app.listen(port, () => console.log("listening to port " + port));
