const express = require("express");
const app = express();
const mongoose = require("mongoose");

const port = 5000;

const { username, password } = require("./credentials/credentials");

mongoose
	.connect(`mongodb://${username}:${password}@ds143070.mlab.com:43070/eda`)
	.then(data => console.log("connected to db."))
	.catch(err => console.log("error connecting to the db."));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let Schema = require("./server/schemas/collections.js");

app.use("/api/auth", require("./server/auth/auth"));

app.use("/api/faculty", require("./server/routes/faculty_routes"));

app.use("/api/admin", require("./server/routes/admin_routes/index"));

///////////////////////////////
app.listen(port, () => {
	console.log("listening to port " + port);
});
