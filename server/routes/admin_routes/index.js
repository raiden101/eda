const router = require('express').Router();
const operations = require('./operations/operations');
const check_token = require('./check_token');
const fileUpload = require('express-fileupload');
router.use(fileUpload());

router.post('/', check_token, operations.admin_home);

router.post('/set_designation', check_token, operations.set_designation);

router.post('/new_faculty', check_token, operations.add_faculty);

router.post('/get_all_faculties', check_token, operations.get_all_faculties);

router.post('/delete_faculties', check_token, operations.delete_faculties);

router.post('/slot_creation', check_token, operations.slot_creation);

router.post('/delete_slots', check_token, operations.delete_slots);

router.post('/add_slots', check_token, operations.add_slots);

router.post('/change_timings', check_token, operations.change_timings);

router.post('/get_exam_timings', check_token, operations.get_exam_timings)

router.post('/get_exam_dates', check_token, operations.get_exam_dates);

router.post('/slot_info', check_token, operations.slot_info);

router.post('/pending_faculty', check_token, operations.pending_faculties);

router.post('/send_mails', check_token, operations.send_mails);

router.post('/upload_faculties', check_token, operations.add_faculties);

module.exports = router;





