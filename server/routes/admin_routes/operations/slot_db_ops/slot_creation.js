const { morn_exam, aft_exam } = require('../../../../schemas/collections')

// { token: '....', 
// new_slot: {"session": "morning/afternoon", 
// total_slot: "...", date: "..."} 
// }
module.exports = (req, res) => {
	let _collection = req.body.new_slot.session === 'morning' ? morn_exam : aft_exam;
	_collection.find({date: req.body.new_slot.date})
	.then(data => {
		if(data === null) 
			res.json({error: "this slot already exists!", data: null})
		else {
			new _collection({
				total_slot: req.body.new_slot.total_slot,
				date: req.body.new_slot.date
			})
			.save()
			.then(data => res.json({data: "slot creation successful", error: null}))
			.catch(err => res.json({data: null, error: "error while creating new slot"}));
		}
	})
}