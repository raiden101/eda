const { faculty } = require('../../../../schemas/collections')
const { random, floor } = Math;

const pwd_options = [
	'abcdefghijklmnopqrstuvwxyz',
	'0123456789',
	'@#',
	'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
];
const rand_range_int = (min, max) => floor(random()*(max-min+1)) + min;

const get_rand_from = iter => iter[rand_range_int(0, iter.length-1)];

const generate_password = () => {
	let len = rand_range_int(4, 9), pwd = '';
	for(let i=0;i<len;++i)
		pwd += get_rand_from(get_rand_from(pwd_options));
	return pwd.trim();
}

// { token: '.....', faculty_data: {.......} }

module.exports = (req, res) => {
	faculty.findOne({fac_id: req.body.faculty_data.fac_id})
	.then(data => {
		if(data === null)
			return new faculty({
				...req.body.faculty_data
				// password: generate_password()
			}).save();
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