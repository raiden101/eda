const { 
  faculty, 
  morn_exam, 
  aft_exam 
} = require('../../../schemas/collections');

module.exports = (req, res) => {
	let [_collection, field] = req.body.selected.session === 'morning' ? 
	[morn_exam, 'morn_selected_slots'] : [aft_exam, 'aft_selected_slots'];
	_collection.updateOne(
		{ 
			$and: [ 
				{ date: new Date(req.body.date) }, 
				{ remaining_slot: { $gt: 0 } }
			] 
		}, 
		{ 
			$push: { selected_members: req.fac_id }, 
			$inc: { remaining_slot: -1 }
		}
	)
	.then(data => {
		if(data.n === 0)
			throw "error";
		else
			return faculty.updateOne(
				{ fac_id: req.fac_id }, 
				{ $inc: { [field]: 1 } }
			)
	})
	.then(data => res.json({ data: "reservation successful", error: null}))
	.catch(err => res.json({ error: "error while reserving slots", data: null}))
	
}