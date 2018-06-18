const { faculty } = require('../../../../schemas/collections')

// { token: '.....', faculty_data: {.......} }

module.exports = (req, res) => {
	let fac_data = req.body.faculty_data;
	// checking if the fac_id already exists in db.
	faculty.findOne({fac_id: fac_data.fac_id})
	.then(data => {
		if(data === null)
			return new faculty(fac_data).save();
		return Promise.resolve(-1);
	})
	.then(data => {
		if(data === -1)
			res.json({data: null, error: "cant add user, duplicate exists!"})
		else
			res.json({data: "uploading faculty data successful.", error: null})				
	})
	.catch((err) => res.json({data: null, error: "error while adding to db!!"}))
}