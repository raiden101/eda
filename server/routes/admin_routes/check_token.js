const jwt = require('jsonwebtoken');
const { key } = require('../../../credentials/credentials');

module.exports = (req, res, next) => {
	try {
		let decoded_data = jwt.verify(req.body.token, key);
		decoded_data.admin == 1 ? next()
		:res.json({data: null, error: "auth error"});
	}catch(err) {
			res.json({data: null, error: "auth error"});
	}
}