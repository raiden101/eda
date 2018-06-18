const { faculty } = require('../../../../schemas/collections')
const transporter = require('../utils/transporter');
const { email_add } = require('../../../../../credentials/credentials');
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

const mail_ops = (to_add, name, pwd) => {
	return {
		from: email_add,
		to: email_add, // to be changed to *to_add*
		subject: 'Password for exam duty selection.',  
		html: `<h3>Dear prof. ${name}</h3>
		<p>Your password for exam duty selection site is <h3>${pwd}</h3></p>`,
	}
}

// { token: '.....', faculty_data: {.......} }

module.exports = (req, res) => {
	let fac_data = req.body.faculty_data;
	// checking if the fac_id already exists in db.
	faculty.findOne({fac_id: fac_data.fac_id})
	.then(data => {
		if(data === null)			// if fac_id doesnt exist in db => add user.
			return new faculty({
				...fac_data,
				// password: generate_password()
			}).save();
		return Promise.resolve(-1); // dont add to db.
	})
	.then(data => {
		if(data === -1)
			res.json({data: null, error: "cant add user, duplicate exists!"})
		else {
			transporter.sendMail(
			mail_ops(fac_data.email, fac_data.fac_name, data.password), 
			function(err, info) {
				if(err)
					res.json({data: null, error: "user added to db, but mail not sent!!!"});
				else
					res.json({data: "uploading faculty data successful and the mail has been sent to the user.", error: null})				
			})
		}
	})
	.catch((err) => res.json({data: null, error: "error while adding to db!!"}))
}