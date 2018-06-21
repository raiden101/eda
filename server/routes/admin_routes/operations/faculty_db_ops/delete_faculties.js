const { 
  morn_exam, 
  aft_exam, 
  faculty 
} = require('../../../../schemas/collections')


// { token: '....', fac_ids: ['id1', 'id2'...] }

module.exports = (req, res) => {
	faculty.deleteMany({ fac_id: { $in: req.body.fac_ids } })
	.then(data => {
		// if number of docs effected(data.n) == 0
		if(data.n == 0) 
			throw "error while deleting the users or users not found";
		else {
			let p1 = morn_exam.updateMany(
				{ selected_members: { $in: req.body.fac_ids } },
				{ $pullAll: { selected_members: req.body.fac_ids } });
			let p2 = aft_exam.updateMany(
				{ selected_members: { $in: req.body.fac_ids } },
				{ $pullAll: { selected_members: req.body.fac_ids } });
			Promise.all([p1, p2])
			.then(data => res.json({data: "deletion successful", error: null}))
			.catch(err => { throw "error while deleting!!"});
		}
	})
	.catch(err => res.json({data: null, error: err}));
}