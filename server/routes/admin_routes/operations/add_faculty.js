const { faculty } = require('../../../schemas/collections')

// { token: '.....', faculty_data: {.......} }

module.exports = (req, res) => {
	faculty.findOne({fac_id: req.body.faculty_data.fac_id})
	.then(data => {
		if(data === null)
			return new faculty(req.body.faculty_data).save();
		return Promise.resolve(-1);
	})
	.then((data) => {
		if(data === -1)
			res.json({data: null, error: "cant add user, duplicate exists!"})
		else 
			res.json({data: "uploading faculty data successful", error: null})
	})
	.catch((err) => res.json({data: null, error: "error while adding to db!!"}))
}