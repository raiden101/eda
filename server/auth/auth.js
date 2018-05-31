const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth_fn = require('./auth_functions');
const { key } = require('../../credentials/credentials');

router.post('/login', (req, res) => {
  let user_data = req.body.user_data;

  let promise = user_data.admin == 1 ?
  auth_fn.admin_login(user_data) :
  auth_fn.faculty_login(user_data);

  promise.then(
    resp => {
      resp.valid ? 
      jwt.sign(user_data, key, (err, token) => {
        if(err) 
          res.status(403).json({valid: false, data: null, error: 'error while logging in'});
        else
          res.status(200).json({valid: true, data: token, error: null});
      })
      :res.status(403).json({valid: false, data: null, error: null});        
    }
  )
  .catch(err => res.status(403).json({valid: false, data: null, error: err.error}));
});


router.post('/isauth', (req, res) => {
  // req.body.data: {token: '.......'} , may be userid in the data
  jwt.verify(req.body.data.token, key, (err, data) => {
    if(err)
      res.status(403).json({data: null, error: "error", valid: false});
    else
      res.status(200).json({data: null, error: null, valid: true});  
  });
})

module.exports = router;