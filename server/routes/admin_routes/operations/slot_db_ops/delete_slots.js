const { morn_exam, aft_exam, faculty } = require("../../../../schemas/collections");


// { token: '.....', 
// slots_to_delete: ['_id1', '_id2', ...], 
// session: "morning/afternoon"}

module.exports = (req, res) => {

	let [_collection, prop] = req.body.session === "morning" ? 
	[morn_exam, 'morn_selected_slots'] : [aft_exam, 'aft_selected_slots'];
	
	Promise.all(req.body.slots_to_delete.map(
		slot_id => _collection.findById(slot_id, 'selected_members date')
	))
	.then(data => Promise.all(data.map(slot => {
			return Promise.all(slot.selected_members.map(fac_id => {
				return faculty.findOneAndUpdate(
					{ fac_id: fac_id },
					{ $pull: { [prop]: slot.date } }
				)
			}))
		}))
	)
	.then(_ => _collection.deleteMany({_id: {$in: req.body.slots_to_delete}}))
	.then(data => res.json({data: "slot deletion successfull", error: null}))
	.catch(err => res.json({error: "error while deleting the slots", data: null}))

};