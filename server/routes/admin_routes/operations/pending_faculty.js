const { slot_limitation, faculty } = require('../../../schemas/collections');

// { token: '...', designation: }

module.exports = (req, res) => {
	slot_limitation.findOne({ fac_des: req.body.designation }, '-_id maximum')
	.then(data => {
		if(data === null) 
			throw "error";
		else {
      let val = data.maximum;
      // return faculty.aggregate([
      //   { 
      //     $lt: [
      //       { $sum: ['$morn_slots_selected', '$aft_slots_selected' ] },
      //       val
      //     ]
      //   }
      // ])

			return faculty.aggregate([
				{ $match: { fac_des: req.body.designation } },
				{ $project: { _id: 0, fac_id: 1, fac_name: 1 } },
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
						"fac_id": 1,
						"fac_name": 1,
						"tot_count": { $sum: [
							{ $size: "$morn_selections" }, 
							{ $size: "$aft_selections" }
						]}
					}
				},
				{ $match: { tot_count: { $lt: val } } }
			]);
		}
			
	})
	.then(data => {
    res.json({ data: data, error: null})
  })
	.catch(err => {
    console.log(err);
    res.json({ data: null, error: "error while fetching data!" })
  });
}