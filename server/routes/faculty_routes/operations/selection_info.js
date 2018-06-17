const { faculty, slot_limitation,morn_exam,aft_exam } = require("../../../schemas/collections");

module.exports = (req, res) => {
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
		{ $match: { remaining_slot: { $gt: 0 } } },
		{ $sort: { date: 1 } }
	];
	const projection_str = "morn_selected_slots aft_selected_slots fac_des";

	faculty.findOne({ fac_id: req.fac_id }, projection_str).then(data => {
		if (data === null) throw "errror";
		slot_limitation
			.findOne({ fac_des: data.fac_des })
			.then(lim => {
				if (
					lim.maximum <=
					data.morn_selected_slots + data.aft_selected_slots
				)
					return Promise.reject("maximum slot selected");
				else {
					let p1 = lim.morn_max > data.morn_selected_slots ? 
					morn_exam.aggregate(query) : Promise.resolve('morn_max');
					let p2 = lim.aft_max > data.aft_selected_slots ? 
					aft_exam.aggregate(query) : Promise.resolve('aft_max');
				
					return Promise.all([p1, p2]);
				}
			})
			.then(data => res.json({ data: data, error: null }))
			.catch(err => res.json({ error: err, data: null }));
	});
};
