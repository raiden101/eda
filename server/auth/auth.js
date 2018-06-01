const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth_fn = require('./auth_functions');
const { key } = require('../../credentials/credentials');


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
      jwt.sign(user_data, key, (err, token) => {
        if(err) 
          res.json({valid: false, data: null, error: ['error while logging in']});
        else
          res.json({valid: true, data: token, error: []});
      })
      :res.json({valid: false, data: null, error: []});        
    }
  )
  .catch(err => res.json({valid: false, data: null, error: [err.error]}));
});


router.post('/isAuth', (req, res) => {
  jwt.verify(req.body.token, key, (err, data) => {
    if(err)
      res.json({data: null, error: ["error"], valid: false});
    else
      res.json({data: {admin: data.admin}, error: [], valid: true});  
  });
})

module.exports = router;