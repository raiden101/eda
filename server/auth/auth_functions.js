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
  // cuzz data type: { username: '', password: '', admin: ''}
  delete user_data['admin']
  return findOneInAcollection(admin, user_data);
}

const faculty_login = (user_data) => {
  // we want the data to be of the type: { fac_id: '', password: ''}
  delete user_data['admin'];
  user_data['fac_id'] = user_data['username'];
  delete user_data['username'];
  return findOneInAcollection(faculty, user_data);
}

module.exports = {
  admin_login,
  faculty_login
}