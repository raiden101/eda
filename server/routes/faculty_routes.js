const router = require("express").Router();
const {
	morn_exam,
	aft_exam,
	slot_limitation,
	faculty
} = require("../schemas/collections");
const jwt = require("jsonwebtoken");
const { key } = require("../../credentials/credentials");

// resp will be array of arrays.
// arr[0] will be morning dates.
// arr[1] will be aft dates.
// issue: all together dates wont be sorted.
const check_token = (req, res, next) => {
	try {
		let decoded_data = jwt.verify(req.body.token, key);
		if (decoded_data.admin == 0) {
			req.fac_id = decoded_data.username;
			next();
		} else res.json({ data: null, error: "auth error" });
	} catch (err) {
		res.json({ data: null, error: "error while fetching data!!" });
	}
};

// { token: '........'}
router.post("/", check_token, (req, res) => {
	let resp = {};

	faculty
		.aggregate([
			{ $match: { fac_id: req.fac_id } },
			{
				$lookup: {
					from: "slot_limitations",
					localField: "fac_des",
					foreignField: "fac_des",
					as: "slot_lims"
				}
			},
			{
				$lookup: {
					from: "morn_exams",
					localField: "fac_id",
					foreignField: "selected_members",
					as: "morn_selections"
				}
			},
			{
				$lookup: {
					from: "aft_exams",
					localField: "fac_id",
					foreignField: "selected_members",
					as: "aft_selections"
				}
			},
			{
				$project: {
					"fac_des": 1,
					"fac_name": 1,
					"slot_lims.morn_max": 1,
					"slot_lims.aft_max": 1,
					"slot_lims.minimum": 1,
					"morn_selections.date": 1,
					"aft_selections.date": 1
				}
			}
		])
		.then(data => res.json(data))
		.catch(err => res.json(err));

	/////////////////////////////////////////
	// faculty.findOne({fac_id: req.fac_id}, 'fac_des')
	// .then(data => {
	//   if(data != null)
	//     return slot_limitation.findOne({fac_des: data.fac_des}, 'morn_max aft_max')
	//   else
	//     throw "oops!! something went wrong";
	// })
	// .then(data => {
	//   resp['morn_max'] = data.morn_max;
	//   resp['aft_max'] = data.aft_max;
	//   return morn_exam.find({selected_members: {$eq: req.fac_id}}, '-_id date').sort('date')
	// })
	// .then(
	//   data => {
	//     resp['morn_selection'] = data;
	//     return aft_exam.find({selected_members: {$eq: req.fac_id}}, '-_id date').sort('date');
	//   }
	// )
	// .then(
	//   data => {
	//     resp['aft_selection'] = data;
	//     res.json({data: resp, error: null})
	//   }
	// )
	// .catch(err => res.json({data: null, error: err}));
});

// { token: '....'}
router.post("/faculty_info", check_token, (req, res) => {
	faculty
		.findOne({ fac_id: req.fac_id }, "-password")
		.then(data => res.json({ data: data, error: null }))
		.catch(err =>
			res.json({ error: "error while fetching data", data: null })
		);
});

// { token: "...", fac_data: "..."}
router.post("/update_info", check_token, (req, res) => {
	faculty
		.updateOne(
			{ fac_id: req.fac_id },
			{
				$set: {
					contact_no: req.body.fac_data.contact_no,
					password: req.body.fac_data.password,
					fac_name: req.body.fac_data.fac_name,
					branch: req.body.fac_data.branch,
					email: req.body.fac_data.email
				}
			}
		)
		.then(data => res.json({ data: "updataion successful", error: null }))
		.catch(err => res.json({ error: "errow while updating", data: null }));
});

router.post("/selection_info", check_token, (req, res) => {
	const query = [
		{ $match: { selected_members: { $nin: [req.fac_id] } } },
		{
			$project: {
				_id: 1,
				date: 1,
				total_slot: 1,
				remaining_slot: {
					$subtract: ["$total_slot", { $size: "$selected_members" }]
				}
			}
		},
		{ $sort: { date: 1 } }
	];
	const projection_str = 'morn_selected_slots aft_selected_slots fac_des'
	
	faculty.findOne({ fac_id: req.fac_id }, projection_str)
	.then(data => {
		
		if(data === null) throw "errror";
		slot_limitation.findOne({ fac_des: data.fac_des })
		.then(lim => {
			if(lim.maximum <= (data.morn_selected_slots + data.aft_selected_slots))
				return Promise.reject("maximum slot selected");
			else
				return Promise.all(
					[morn_exam.aggregate(query), aft_exam.aggregate(query)]
				)
		})
		.then(data => res.json({ data: data, error: null }))
		.catch(err => res.json({ error: err, data: null }))
		
	})
	
});

router.post('/reserve_slot', check_token, (req, res) => {
	let [_collection, field] = req.body.selected.session === 'morning' ? 
	[morn_exam, 'morn_selected_slots'] : [aft_exam, 'aft_selected_slots'];
	_collection.updateOne(
		{ date: new Date(slot.date) }, 
		{ 
			$push: { selected_members: req.fac_id }, 
			$inc: { remaining_slot: -1 }
		}
	)
	.then(data => {
		return faculty.updateOne(
			{ fac_id: req.fac_id }, 
			{ $inc: { field: 1 } }
		)
	})
	.then(data => res.json({ data: "reservation successful", error: null}))
	.catch(err => res.json({ error: "error while reserving slots", data: null}))
	
})

module.exports = router;
