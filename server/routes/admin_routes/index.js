const router = require('express').Router();
const check_token = require('./check_token'),
      admin_home = require('./operations/admin_home'),
      set_designation = require('./operations/others/set_designation'),
      add_faculty = require('./operations/faculty_db_ops/add_faculty'),
      get_all_faculties = require('./operations/faculty_db_ops/get_all_faculties'),
      delete_faculties = require('./operations/faculty_db_ops/delete_faculties'),
      slot_creation = require('./operations/slot_db_ops/slot_creation'),
      delete_slots = require('./operations/slot_db_ops/delete_slots'),
      add_slots = require('./operations/slot_db_ops/add_slots'),
      change_timings = require('./operations/date_and_time_ops/change_timings'),
      get_exam_timings = require('./operations/date_and_time_ops/get_exam_timings'),
      get_exam_dates = require('./operations/date_and_time_ops/get_exam_dates'),
      pending_faculties = require('./operations/faculty_db_ops/pending_faculty'),
      slot_info = require('./operations/slot_db_ops/slot_info');


router.post('/', check_token, admin_home);

router.post('/set_designation', check_token, set_designation);

router.post('/new_faculty', check_token, add_faculty);

router.post('/get_all_faculties', check_token, get_all_faculties);

router.post('/delete_faculties', check_token, delete_faculties);

router.post('/slot_creation', check_token, slot_creation);

router.post('/delete_slots', check_token, delete_slots);

router.post('/add_slots', check_token, add_slots);

router.post('/change_timings', check_token, change_timings);

router.post('/get_exam_timings', check_token, get_exam_timings)

router.post('/get_exam_dates', check_token, get_exam_dates);

router.post('/slot_info', check_token, slot_info);

router.post('/pending_faculty', check_token, pending_faculties);


module.exports = router;





