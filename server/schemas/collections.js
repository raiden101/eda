let slot_limitation = require('./slot_lim_schema.js');
let faculty = require('./faculty_schema.js');
let morn_exam  = require('./exam_morn_schema.js');
let aft_exam  = require('./exam_aft_schema.js');
let admin  = require('./admin_schema.js');
let exam_timing = require('./exam_timings');

module.exports = {
  slot_limitation,
  faculty,
  morn_exam,
  aft_exam,
  admin,
  exam_timing
}
