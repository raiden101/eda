const operations = require('./operations/operations');
const router = require('express').Router();

router.post("/", operations.faculty_home);

router.post("/faculty_info", operations.faculty_info);

router.post("/update_info", operations.update_info);

router.post("/selection_info", operations.selection_info);

router.post('/reserve_slot', operations.reserve_slot);

module.exports = router;