const operations = require('./operations/operations');
const router = require('express').Router();
const check_token = require('./check_token');

router.post("/", check_token, operations.faculty_home);

router.post("/faculty_info", check_token, operations.faculty_info);

router.post("/update_info", check_token, operations.update_info);

router.post("/selection_info", check_token, operations.selection_info);

router.post('/reserve_slot', check_token, operations.reserve_slot);

module.exports = router;