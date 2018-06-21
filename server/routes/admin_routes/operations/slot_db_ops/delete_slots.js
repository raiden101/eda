const { morn_exam, aft_exam, faculty } = require("../../../../schemas/collections");


// { token: '.....', 
// slots_to_delete: ['_id1', '_id2', ...], 
// session: "morning/afternoon"}

module.exports = (req, res) => {

	let [_collection, prop] = req.body.session === "morning" ? 
	[morn_exam, 'morn_selected_slots'] : [aft_exam, 'aft_selected_slots'];
	
	Promise.all(req.body.slots_to_delete.map(slot_id => {
		return _collection.findById(slot_id, 'selected_members');
	}))
	.then(data => {
		let facs = [];
		for(let i=0;i<data.length;++i)
			facs = facs.concat(data[i].selected_members);

		return Promise.all(facs.map(fac_id => faculty.findOneAndUpdate(
			{ fac_id: fac_id },
			{ $inc: { [prop]: -1 } }
		)))
	})
	.then(_ => _collection.deleteMany({_id: {$in: req.body.slots_to_delete}}))
	.then(data => res.json({data: "slot deletion successfull", error: null}))
	.catch(err => res.json({error: "error while deleting the slots", data: null}))

};