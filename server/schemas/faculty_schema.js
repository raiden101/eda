let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const faculty_schema = new Schema({
	fac_id: String,
	fac_name: String,
	fac_des: Number,
	branch: String,
	email: String,
	contact_no: { type: String, default: 1111 },
	password: { type: String, default: 1111 }
});

const faculty = mongoose.model("facultie", faculty_schema);
module.exports = faculty;
