const { morn_exam, aft_exam } = require('../../../schemas/collections');

// response will be an array of 2 arrays ie [[],[]]
// 1st array will have all info about morning exams.
// 2nd array """""""""""""""""""""""" aft exams.
// { token: '.....'}

module.exports = (req, res) => {
	let query = [
		{ 
			$project: {
				_id: 1,
				date: 1,
				selected_members: 1, 
				total_slot: 1,
				selected_slot: { $size: "$selected_members" },
				remaining_slot: { 
					$subtract: ["$total_slot", { $size: "$selected_members" }]
				} 
			},
		},
		{ $sort: { "date": 1 } }
	]
	let p1 = morn_exam.aggregate(query),
	p2 = aft_exam.aggregate(query);
	
	Promise.all([p1, p2])
	.then(data => {
		res.json({data: data, error: null})
	})
	.catch(err => res.json({data: null, error: "error while fetching data!!"}));
}