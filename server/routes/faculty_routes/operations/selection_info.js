const { faculty, slot_limitation,morn_exam,aft_exam } = require("../../../schemas/collections");

module.exports = (req, res) => {
	const query = (date_arr) => [
		{ $match: { date: { $nin: date_arr } } },
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
	let projection_str = "morn_selected_slots aft_selected_slots fac_des";

	faculty.findOne({ fac_id: req.fac_id }, projection_str)
	.then(data => {
		if (data === null) throw "errror";
		slot_limitation.findOne({ fac_des: data.fac_des })
		.then(lim => {
			if (
				lim.maximum <= 
				(data.morn_selected_slots.length + data.aft_selected_slots.length)
			)
				return Promise.reject("maximum slot selected");
			else {
				let arr = [
					...data.morn_selected_slots,
					...data.aft_selected_slots
				];
				let q = query(arr);
				return Promise.all([
					morn_exam.aggregate(q),
					aft_exam.aggregate(q)
				]);
			}
		})
		.then(data => res.json({ data: data, error: null }))
		.catch(err => res.json({ error: err, data: null }));
	});
};
