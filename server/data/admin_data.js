const router = require('express').Router();
const { aft_exam, morn_exam, faculty, exam_timing } = require('../schemas/collections')
const jwt = require('jsonwebtoken');
const { key } = require('../../credentials/credentials');

const check_token = (req, res, next) => {
  try {
    let decoded_data = jwt.verify(req.body.token, key);
    decoded_data.admin == 1 ? next()
    :res.json({data: null, error: "unauthorized activity!!"});
  }catch(err) {
      res.json({data: null, error: "error while fetching data!!"});    
  }
}

// response will be an array of 2 arrays ie [[],[]]
// 1st array will have all info about morning exams.
// 2nd array """""""""""""""""""""""" aft exams.
// { token: '.....'}
router.post('/', check_token,  (req, res) => {
  let p1 = morn_exam.aggregate([
    { $project: {
        _id: 1,
        date: 1,
        selected_members: 1, 
        total_slot: 1,
        selected_slot: {$size: "$selected_members"},
        remaining_slot: { 
          $subtract: ["$total_slot", {$size: "$selected_members"}]
        } 
      },
    },
    { $sort: { "date": 1 } }
  ]),

  p2 = aft_exam.aggregate([
    { 
      $project: {
        _id: 1,
        date: 1,
        selected_members: 1, 
        total_slot: 1
      } 
    },
    { 
      $addFields: {
        selected_slot: {$size: "$selected_members"},
        remaining_slot: { 
          $subtract: ["$total_slot",  {$size: "$selected_members"}]
      } 
    },
  },
  { $sort: { "date": 1 } }    
  ]);
  Promise.all([p1, p2])
  .then(data => {
    res.json({data: data, error: null})
  })
  .catch(err => res.json({data: null, error: "error while fetching data!!"}));
});

// related to faculty db operaions
////////////////////////////////////////////////////////////////
// { token: '.....', faculty_data: {.......} }
router.post('/new_faculty', check_token, (req, res) => {
  faculty.find({fac_id: req.body.faculty_data.fac_id})
  .then(data => {
    if(data == null)
      return  new faculty(req.body.faculty_data).save();
    return Promise.resolve(-1);
  })
  .then((data) => {
    if(data === -1)
      res.json({data: null, error: "cant add user, duplicate exists!"})
    else 
      res.json({data: "uploading faculty data successful", error: null})
  })
  .catch((err) => res.json({data: null, error: "error while adding to db!!"}))
});


// { token: '.......' }
router.post('/get_all_faculties', check_token, (req, res) => {
  faculty.find({}, "-password")
  .then(data => res.json({data: data, error: null}))
  .catch(err => res.json({data: null, error: "error while fetching data!!"}));
});

// { token: '....', fac_ids: ['id1', 'id2'...] }
router.post('/delete_faculties', check_token, (req, res) => {
  faculty.deleteMany({fac_id: {$in: req.body.fac_ids}})
  .then(data => {
    // if number of docs effected(data.n) == 0
    if(data.n == 0) 
      throw "error while deleting the user or users not found";
    else {
      let p1 = morn_exam.updateMany(
        { selected_members: {$in: req.body.fac_ids} },
        { $pullAll: {selected_members: req.body.fac_ids} });
      let p2 = aft_exam.updateMany(
        { selected_members: {$in: req.body.fac_ids} },
        { $pullAll: {selected_members: req.body.fac_ids} });
      Promise.all([p1, p2])
      .then(data => res.json({data: "deletion successful", error: null}))
      .catch(err => { throw "error while deleting!!"});
    }
  })
  .catch(err => res.json({data: null, error: err}));
});


// related to slots / exam schedule
/////////////////////////////////////////////////////////////////
// data should be enclosed within new_slot{date: '..', }
// { token: '....', 
// new_slot: {"session": "morning/afternoon", 
// total_slot: "...", date: "..."} 
// }
router.post('/slot_creation', check_token, (req, res) => {
  let _collection = req.body.new_slot.session === 'morning' ? morn_exam : aft_exam;
  _collection.find({date: req.body.new_slot.date})
  .then(data => {
    if(data === null) 
      res.json({error: "this slot already exists!", data: null})
    else {
      new _collection({
        total_slot: req.body.new_slot.total_slot,
        date: req.body.new_slot.date
      })
      .save()
      .then(data => res.json({data: "slot creation successful", error: null}))
      .catch(err => res.json({data: null, error: "error while creating new slot"}));
    }
  })
});


// { token: '.....', 
// slots_to_delete: ['_id1', '_id2', ...], 
// session: "morning/afternoon"}
router.post('/delete_slots', check_token, (req, res) => {
  let _collection = req.body.session === "morning" ? morn_exam : aft_exam;
  _collection.deleteMany({_id: {$in: req.body.slots_to_delete}})
  .then(data => res.json({data: "slot deletion successfull", error: null}))
  .catch(err => res.json({error: "error while deleting the slots", data: null}))
})


// { token: '', slots: [{date: '', session: '', total_slot: ''}]}
router.post('/add_slots', check_token, (req, res) => {

  let rejected_slots = [];
  let slots = [...req.body.slots];
  Promise.all(req.body.slots.map(slot => {
    let _collection = slot.session === 'morning' ? morn_exam : aft_exam;
    return _collection.findOne({date: slot.date});
  }))
  .then(data => {
    return Promise.all(data.map((dat, index) => {
      if(dat != null) {
        rejected_slots.push(slots[index]);
        return Promise.resolve();
      }
      else {
        let _collection = slots[index].session === 'morning' ? morn_exam : aft_exam;        
        return new _collection({
          date: slots[index].date,
          total_slot: slots[index].total_slot,
        }).save();
      }
        
    }))
   
  })
  .then(data => res.json({ data: rejected_slots, error: null }))
  .catch(err => res.json({ data: null, error: "oops something went wrong!"}));
  


});


// related to exam_timing db
/////////////////////////////////////////////////////////////////
// { token: "", session: "morning/afternoon", 
// time: {start: Date obj, end: Date obj}  }
router.post('/change_timings', check_token, (req, res) => {

  let session = req.body.session;
  exam_timing.update({}, 
  {$set: {session: req.body.time}})
  .then(data => {
    res.json({data: "date uploaded successfully", error: null});
  })
  .catch(err => res.json({error: "error while uploading", data: null}));

});

const get_hours_and_mins = (date) => {
  return {
    'hours': date.getHours(),
    'minutes': date.getMinutes()
  }
}

// { token: "...."}
router.post('/get_exam_timings', check_token, (req, res) => {
  exam_timing.findOne({})
  .then(data => {
    let resp = {};
    resp['morning'] = {
      'start': get_hours_and_mins(data.morning.start),
      'end': get_hours_and_mins(data.morning.end)
    };
    resp['afternoon'] = {
      'start': get_hours_and_mins(data.afternoon.start),
      'end': get_hours_and_mins(data.afternoon.end)
    };
    res.json({data: resp, error: null})
  })
  .catch(err => res.json({error: "error while fetching", data: null}));
})


// { token: '...', date: '....', session: '...'}
router.post('/slot_info', check_token, (req, res) => {
  let _collection = req.body.session === 'morning' ? morn_exam : aft_exam;
  _collection.aggregate([
    { $match: { date: new Date(req.body.date) } },
    { $project: { "selected_members": 1 } },
    { $unwind: { path: "$selected_members" } },
    { $lookup: {
        from: 'faculties',
        localField: "selected_members",
        foreignField: "fac_id",
        as: "fac_info"
      } 
    },
    {
      $project: {
        "fac_info.fac_name": 1,
        "fac_info.fac_des": 1, 
        "fac_info.fac_id": 1,
        "fac_info.branch": 1
      }
    }
  ])
  .then(data => res.json({data: data, error: null}))
  .catch(err => res.json({error: "error while fetching data", data: null}));
});



module.exports = router;