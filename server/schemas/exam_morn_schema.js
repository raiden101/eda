let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const exam_morn_schema = new Schema({
    date: Date,
    total_slot: Number,
    selected_members: { type: [String], defaut: [] }
});

const morn_exams = mongoose.model('morn_exam', exam_morn_schema);

module.exports = morn_exams;