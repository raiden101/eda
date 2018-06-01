const router = require('express').Router();
const { aft_exam, morn_exam, faculty } = require('../schemas/collections')
const jwt = require('jsonwebtoken');
const { key } = require('../../credentials/credentials');

// response will be an array of 2 arrays ie [[],[]]
// 1st array will have all info about morning exams.
// 2nd array """""""""""""""""""""""" aft exams.
const check_token = (req, res, next) => {
  jwt.verify(req.body.token, key, (err, data) => {
    if(err)
      res.json({data: null, error: "error while fetching data!!"});
    else
      if(data.admin == 1)
        next();
  })
}
router.post('/', check_token,  (req, res) => {
  let p1 = morn_exam.find({}),
      p2 = aft_exam.find({});
  Promise.all([p1, p2])
  .then(data => {
    res.json({data: data, error: null})
  })
  .catch(err => res.json({data: null, error: "error while fetching data!!"}));
});

router.post('/new_faculty', (req, res) => {
  new faculty({...req.body.faculty_data})
  .save()
  .then((data) => {
    console.log(data);
    res.json({data: null, error: null})
  })
  .catch((err) => res.json({data: null, error: "error while adding to db!!"}))
});

router.post('/get_all_faculties', check_token, (req, res) => {
  faculty.find({})
  .then(data => res.json({data: data, error: null}))
  .catch(err => res.json({data: null, error: "error while fetching data!!"}));
});

router.delete('/delete_faculty/:fac_id', (req, res) => {
  faculty.deleteOne({fac_id: req.params.fac_id})
  .then(data => {
    // if number of docs effected(data.n) == 0
    if(data.n == 0) throw "error while deleting the user";
    else res.json({data: "deletion successful", error: null});
  })  
  .catch(err => res.json({data: null, error: err}));
});

// data should be enclosed within new_slot{date: '..', }
router.post('/slot_creation', (req, res) => {
  let newSlot = {
    total_slot: req.body.new_slot.total_slot,
    remaining_slot: req.body.new_slot.total_slot,
    date: req.body.new_slot.date
  }
  let p = req.body.new_slot.session === 'morning' ?
  new morn_exam(newSlot).save()
  : new aft_exam(newSlot).save();

  p.then(data => res.json({data: null, error: null}))
  .catch(err => res.json({data: null, error: err}));

});

module.exports = router;