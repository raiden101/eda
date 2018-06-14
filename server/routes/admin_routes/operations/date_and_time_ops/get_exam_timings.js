const { exam_timing } = require('../../../../schemas/collections');

const get_hours_and_mins = (date) => {
	return {
		'hours': date.getHours(),
		'minutes': date.getMinutes()
	}
}
// { token: "...."}

module.exports = (req, res) => {
	exam_timing.findOne({})
	.then(data => {
		let resp = {};
		resp['morning'] = {
			'start': get_hours_and_mins(data.morning.start),
			'end': get_hours_and_mins(data.morning.end)
		};
		resp['afternoon'] = {
			'start': get_hours_and_mins(data.afternoon.start),
			'end': get_hours_and_mins(data.afternoon.end)
		};
		res.json({data: resp, error: null})
	})
	.catch(err => res.json({error: "error while fetching", data: null}));
}