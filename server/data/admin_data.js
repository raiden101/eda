const router = require('express').Router();
const { aft_exam, morn_exam, faculty } = require('../schemas/collections')


// response will be an array of 2 arrays ie [[],[]]
// 1st array will have all info about morning exams.
// 2nd array """""""""""""""""""""""" aft exams.
router.get('/', (req, res) => {
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

router.get('/get_all_faculties', (req, res) => {
  faculty.find({})
  .then(data => res.json({data: data, error: null}))
  .catch(err => res.json({data: null, error: "error while getting data!!"}));
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