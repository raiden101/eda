const router = require('express').Router();
const operations = require('./operations/operations');

router.post('/', operations.admin_home);

router.post('/set_designation', operations.set_designation);

router.post('/new_faculty', operations.add_faculty);

router.post('/get_all_faculties', operations.get_all_faculties);

router.post('/delete_faculties', operations.delete_faculties);

router.post('/slot_creation', operations.slot_creation);

router.post('/delete_slots', operations.delete_slots);

router.post('/add_slots', operations.add_slots);

router.post('/get_exam_dates', operations.get_exam_dates);

router.post('/slot_info', operations.slot_info);

router.post('/pending_faculty', operations.pending_faculties);

router.post('/send_mails', operations.send_mails);

router.post('/upload_faculties', operations.add_faculties);

router.post('/upload_slots', operations.add_slots_via_excel);

router.post('/auto_allocation', operations.auto_allocation);

module.exports = router;





