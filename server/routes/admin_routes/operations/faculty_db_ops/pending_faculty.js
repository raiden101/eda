const { slot_limitation, faculty } = require('../../../../schemas/collections');

// { token: '...', designation: }

module.exports = (req, res) => {
	slot_limitation.findOne({ fac_des: req.body.designation }, '-_id maximum')
	.then(data => {
		if(data === null) 
			throw "error";
		else {
      return faculty.aggregate([
				{ $match: { fac_des: req.body.designation } },
				{ 
					$addFields: { tot_count: 
						{ $sum: ['$morn_selected_slots', '$aft_selected_slots'] } 
					} 
				},
				{ $match: { tot_count: { $lt: data.maximum } } }
      ])
		}
			
	})
	.then(data => res.json({ data: data, error: null}))
	.catch(err => res.json({ data: null, error: "error while fetching data!" }));
}