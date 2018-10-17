const { morn_exam, aft_exam } = require('../../../../schemas/collections')
const mapping = {
	1: "Asst. Prof GD 1",
	2: "Asst. Prof GD 2",
	3: "Asst. Prof GD 3",
	4: "Asso. Prof."
};

// { token: '...', date: '....', session: '...'}
module.exports = (req, res) => {
	let _collection = req.body.session === 'morning' ? morn_exam : aft_exam;
	_collection.aggregate([
		{ $match: { date: new Date(req.body.date) } },
		{ $project: { "selected_members": 1 } },
		{ $unwind: { path: "$selected_members" } },
		{ $lookup: {
				from: 'faculties',
				localField: "selected_members",
				foreignField: "fac_id",
				as: "fac_info"
			} 
		},
		{
			$project: {
				"fac_info.fac_name": 1,
				"fac_info.fac_des": 1,
				"fac_info.fac_id": 1,
				"fac_info.branch": 1,
			}
		},
		{ $sort: { 'fac_info.fac_des': -1, 'fac_info.fac_id': 1 } }
	])
	.then(data => {
		for(let i=0;i<data.length;++i)
			data[i].fac_info[0].fac_des = mapping[data[i].fac_info[0].fac_des]
		res.json({data: data, error: null})
	})
	.catch(err => res.json({error: "error while fetching data", data: null}));
}