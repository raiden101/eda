let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const exam_aft_schema = new Schema({
    date: Date,
    total_slot: Number,
    remaining_slot: Number,
    selected_slot: Number,
    selected_members: [String]
});

const aft_exams = mongoose.model('aft_exam', exam_aft_schema);
module.exports = aft_exams;