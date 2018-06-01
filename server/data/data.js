const router = require('express').Router();
const { morn_exam, aft_exam, slot_limitation, faculty } = require('../schemas/collections');

// resp will be array of arrays.
// arr[0] will be morning dates.
// arr[1] will be aft dates.
// issue: all together dates wont be sorted.
router.get('/user_home/:fac_id', (req, res) => {
  let resp = {};
  faculty.findOne({fac_id: req.params.fac_id}, 'fac_des')
  .then(data => {
    if(data != null) 
      return slot_limitation.findOne({fac_des: data.fac_des}, 'morn_max aft_max')
    else 
      throw "oops!! something went wrong";
  })
  .then(data => {
    resp['morn_max'] = data.morn_max;
    resp['aft_max'] = data.aft_max;      
    return morn_exam.find({selected_members: {$eq: req.params.fac_id}}, '-_id date').sort('date')
  })
  .then(
    data => {
      resp['morn_selection'] = data;
      return aft_exam.find({selected_members: {$eq: req.params.fac_id}}, '-_id date').sort('date'); 
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




module.exports = router;