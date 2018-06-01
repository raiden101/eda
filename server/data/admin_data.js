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
      data.admin == 1 ? next()
      :res.json({data: null, error: "unauthorized activity!!"});
  })
}


// { token: '.....'}
router.post('/', check_token,  (req, res) => {
  let p1 = morn_exam.find({}).sort('date'),
      p2 = aft_exam.find({}).sort('date');
  Promise.all([p1, p2])
  .then(data => {
    res.json({data: data, error: null})
  })
  .catch(err => res.json({data: null, error: "error while fetching data!!"}));
});


// { token: '.....', faculty_data: {.......} }
router.post('/new_faculty', check_token, (req, res) => {
  new faculty({...req.body.faculty_data})
  .save()
  .then((data) => {
    console.log(data);
    res.json({data: null, error: null})
  })
  .catch((err) => res.json({data: null, error: "error while adding to db!!"}))
});


// { token: '.......' }
router.post('/get_all_faculties', check_token, (req, res) => {
  faculty.find({})
  .then(data => res.json({data: data, error: null}))
  .catch(err => res.json({data: null, error: "error while fetching data!!"}));
});

// { token: '....' }
router.post('/delete_faculties', check_token, (req, res) => {
  faculty.deleteMany({fac_id: {$in: req.body.fac_ids}})
  .then(data => {
    // if number of docs effected(data.n) == 0
    if(data.n == 0) throw "error while deleting the user or users not found";
    else res.json({data: "deletion successful", error: null});
  })  
  .catch(err => res.json({data: null, error: err}));
});

// data should be enclosed within new_slot{date: '..', }
// { token: '....', new_slot: {.....} }
router.post('/slot_creation', check_token, (req, res) => {
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