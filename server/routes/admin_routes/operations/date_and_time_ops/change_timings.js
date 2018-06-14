const { exam_timing } = require('../../../../schemas/collections');

// { token: "", session: "morning/afternoon", 
// time: {start: Date obj, end: Date obj}  }

module.exports = (req, res) => {

	let session = req.body.session;
	exam_timing.update({}, 
	{ $set: { session: req.body.time } })
	.then(data => res.json({data: "date uploaded successfully", error: null}))
	.catch(err => res.json({error: "error while uploading", data: null}));

};