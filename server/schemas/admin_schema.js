let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const admin_schema = new Schema({
	name: String,
	branch: String,
	email: String,
	contact_no: String,
	username: String,
	password: String
});

const admin = mongoose.model("administrator", admin_schema);
module.exports = admin;
