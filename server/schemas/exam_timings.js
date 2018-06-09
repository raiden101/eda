const mongoose = require("mongoose");
const schema = mongoose.Schema;

const exam_timings_schema = new schema({
	morning: {
		start: Date,
		end: Date
	},
	afternoon: {
		start: Date,
		end: Date
	}
});

module.exports = mongoose.model("exam_timing", exam_timings_schema);
