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
          res.json({valid: false, data: null, error: 'error while logging in'});
        else
          res.json({valid: true, data: token, error: null});
      })
      :res.json({valid: false, data: null, error: null});        
    }
  )
  .catch(err => res.json({valid: false, data: null, error: err.error}));
});

module.exports = router;