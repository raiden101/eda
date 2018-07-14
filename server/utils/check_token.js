const jwt = require('jsonwebtoken');
const { key } = require('../../credentials/credentials');

module.exports = (admin_flag) => (req, res, next) => {
	try {
		let decoded_data = jwt.verify(req.body.token, key);
		if(decoded_data.admin == admin_flag) {
			if(!admin_flag)
				req.fac_id = decoded_data.username;
			next();
		}		
		else
			res.json({data: null, error: "auth error"});
	}catch(err) {
			res.json({data: null, error: "auth error"});
	}
}