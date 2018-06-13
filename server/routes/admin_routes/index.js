const router = require('express').Router();
const check_token = require('./check_token');


router.post('/', check_token, require('./operations/admin_home'));

router.post('/set_designation', check_token, require('./operations/set_designation'));

router.post('/new_faculty', check_token, require('./operations/add_faculty'));

router.post('/get_all_faculties', check_token, require('./operations/get_all_faculties'));

router.post('/delete_faculties', check_token, require('./operations/delete_faculties'));

router.post('/slot_creation', check_token, require('./operations/slot_creation'));

router.post('/delete_slots', check_token, require('./operations/delete_slots'));

router.post('/add_slots', check_token, require('./operations/add_slots'));

router.post('/change_timings', check_token, require('./operations/change_timings'));

router.post('/get_exam_timings', check_token, require('./operations/get_exam_timings'))

router.post('/get_exam_dates', check_token, require('./operations/get_exam_dates'));

router.post('/slot_info', check_token, require('./operations/slot_info'));

router.post('/pending_faculty', check_token, require('./operations/pending_faculty'));


module.exports = router;





