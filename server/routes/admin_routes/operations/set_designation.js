const { slot_limitation } = require('../../../schemas/collections')

// { token: '..', fac_des: '..', maximum: '..', minimum: '..',
// morn_max: '', aft_max: ''}

module.exports = (req, res) => {
	slot_limitation.updateOne(
		{ fac_des: req.body.fac_des },
		{
			$set: { 
				maximum: req.body.maximum, 
				minimum: req.body.minimum,
				morn_max: req.body.morn_max,
				aft_max: req.body.aft_max        
			}
		}
	)
	.then(data => res.json({ data: "update successful", error: null }))
	.catch(err => res.json({ error: "error while updating", data: null}));
}