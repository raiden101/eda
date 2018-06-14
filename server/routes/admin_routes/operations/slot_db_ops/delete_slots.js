const { morn_exam, aft_exam } = require("../../../../schemas/collections");


// { token: '.....', 
// slots_to_delete: ['_id1', '_id2', ...], 
// session: "morning/afternoon"}

module.exports = (req, res) => {
	let _collection = req.body.session === "morning" ? morn_exam : aft_exam;
	_collection.deleteMany({_id: {$in: req.body.slots_to_delete}})
	.then(data => res.json({data: "slot deletion successfull", error: null}))
	.catch(err => res.json({error: "error while deleting the slots", data: null}))
};