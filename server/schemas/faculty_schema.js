let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const faculty_schema = new Schema({
	fac_id: String,
	fac_name: String,
	fac_des: Number,
	branch: String,
	email: String,
	contact_no: String,
	password: String ,
	morn_selected_slots: { type: [Date], default: [] },
	aft_selected_slots: { type: [Date], default: [] }
});

const faculty = mongoose.model("facultie", faculty_schema);
module.exports = faculty;
