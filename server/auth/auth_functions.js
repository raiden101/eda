const { faculty, admin } = require('../schemas/collections');

const findOneInAcollection = (collection, data_to_be_searched) => {
  return new Promise((resolve, reject) => {
    collection.findOne(data_to_be_searched, (err, data) => {
      if(err) 
        reject({error: "error while logging in"})
      else if(data == null)
        resolve({valid: false})
      else
        resolve({valid: true});
    })
  });
}

const admin_login = (user_data) => {
  return findOneInAcollection(admin, {
    username: user_data.username,
    password: user_data.password
  });
}

const faculty_login = (user_data) => {
  // we want the data to be of the type: { fac_id: '', password: ''}
  return findOneInAcollection(faculty, {
    fac_id: user_data.username,
    password: user_data.password
  });
}

module.exports = {
  admin_login,
  faculty_login
}