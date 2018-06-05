const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth_fn = require('./auth_functions');
const { key } = require('../../credentials/credentials');
const exp_in_secs = 6000;

// expected data: user_data: 
// { username: '...', password: '...', admin: 0/1}
router.post('/login', (req, res) => {
  let user_data = req.body.user_data;
  let promise = user_data.admin == 1 ?
  auth_fn.admin_login(user_data) :
  auth_fn.faculty_login(user_data);

  promise.then(
    resp => {
      resp.valid ? 
      jwt.sign({
        ...user_data,
        exp: Math.floor(Date.now()/1000) + exp_in_secs
      }, 
      key, (err, token) => {
        if(err) 
          res.json({valid: false, data: null, error: ['error while logging in!']});
        else
          res.json({valid: true, data: token, error: []});
      })
      :res.json({valid: false, data: null, error: ["invalid username or password!"]});        
    }
  )
  .catch(err => res.json({valid: false, data: null, error: [err.error]}));
});


router.post('/isAuth', (req, res) => {
  jwt.verify(req.body.token, key, (err, data) => {
    if(err)
      res.json({status: 0, admin: -1});
    else
      res.json({status: 1, admin: data.admin});
  });
})

module.exports = router;