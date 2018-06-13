const { morn_exam, aft_exam } = require('../../../schemas/collections');

// { token: '', slots: [{date: '', session: '', total_slot: ''}]}


module.exports = (req, res) => {

	let rejected_slots = [];
	let slots = req.body.slots;
	Promise.all(slots.map(slot => {
		let _collection = slot.session === 'morning' ? morn_exam : aft_exam;
		return _collection.findOne({date: slot.date});
	}))
	.then(data => {
		return Promise.all(data.map((dat, index) => {
			if(dat != null) {
				rejected_slots.push(slots[index]);
				return Promise.resolve();
			}
			else {
				let _collection = slots[index].session === 'morning' ? morn_exam : aft_exam;        
				return new _collection({
					date: slots[index].date,
					total_slot: slots[index].total_slot,
				}).save();
			}			
		}))
	})
	.then(data => res.json({ data: rejected_slots, error: null }))
	.catch(err => res.json({ data: null, error: "oops something went wrong!"}));

}