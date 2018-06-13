const { morn_exam, aft_exam } = require('../../../../schemas/collections');

// {token: '..'}

module.exports = (req, res) => {
	let resp = {};
	morn_exam.find({}, { date: 1 })
	.then(data => {
		resp['morn_dates'] = data;
		return aft_exam.find({}, { date: 1 });
	})
	.then(data => {
		resp['aft_dates'] = data;
		res.json({ data: resp, error: null });
	})
	.catch(err => res.json({ error: "error while fetching data", data: null }))
}