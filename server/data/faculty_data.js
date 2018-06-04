const router = require('express').Router();
const { morn_exam, aft_exam, slot_limitation, faculty } = require('../schemas/collections');
const jwt = require('jsonwebtoken');
const { key } = require('../../credentials/credentials');

// resp will be array of arrays.
// arr[0] will be morning dates.
// arr[1] will be aft dates.
// issue: all together dates wont be sorted.
const check_token = (req, res, next) => {
  try {
    let decoded_data = jwt.verify(req.body.token, key);
    if(decoded_data.admin == 0) {
      req.fac_id = decoded_data.username;
      next();
    }else
      res.json({data: null, error: "unauthorized activity!!"});
  }catch(err) {
      res.json({data: null, error: "error while fetching data!!"});    
  }
};

// { token: '........'}
router.post('/', check_token, (req, res) => {
  let resp = {};
  faculty.findOne({fac_id: req.fac_id}, 'fac_des')
  .then(data => {
    if(data != null) 
      return slot_limitation.findOne({fac_des: data.fac_des}, 'morn_max aft_max')
    else 
      throw "oops!! something went wrong";
  })
  .then(data => {
    resp['morn_max'] = data.morn_max;
    resp['aft_max'] = data.aft_max;      
    return morn_exam.find({selected_members: {$eq: req.fac_id}}, '-_id date').sort('date')
  })
  .then(
    data => {
      resp['morn_selection'] = data;
      return aft_exam.find({selected_members: {$eq: req.fac_id}}, '-_id date').sort('date'); 
    }
  )
  .then(
    data => {
      resp['aft_selection'] = data;
      res.json({data: resp, error: null})
    }
  )
  .catch(err => res.json({data: null, error: err}));

});

// { token: '....'}
router.post('/faculty_info', check_token, (req, res) => {
  faculty.findOne({fac_id: req.fac_id}, '-password')
  .then(data => res.json({data: data, error: null}))
  .catch(err => res.json({error: "error while fetching data", data: null}));
});

// { token: "...", fac_data: "..."}
router.post('/update_info', check_token, (req, res) => {
  faculty
  .updateOne({fac_id: req.fac_id}, {
    $set: {
      "contact_no": req.body.fac_data.contact_no,
      "password": req.body.fac_data.password,
      "fac_name": req.body.fac_data.fac_name,
      "branch": req.body.fac_data.branch,
      "email": req.body.fac_data.email,
    }
  })
  .then(data => res.json({data: "updataion successful", error: null}))
  .catch(err => res.json({error: "errow while updating", data: null}))
});




module.exports = router;