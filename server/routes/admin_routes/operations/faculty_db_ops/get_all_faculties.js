const { faculty } = require('../../../../schemas/collections');

// { token: '.......', fields: [], pending: true/false}
// pending field decides if faculty penging info 
// is to be put into the resp or not
module.exports = (req, res) => {
	let proj = {}, fields = req.body.fields;
	for(let i=0;i<fields.length;++i)
		proj[fields[i]] = 1
	
	let query = req.body.pending ? [
		{ 
			$lookup: {
				from: 'slot_limitations',
				localField: 'fac_des',
				foreignField: 'fac_des',
				as: 'lims'
			}
		},
		{ $unwind: '$lims' },
		{
			$project: {
				'pending': {
					$lt: [
						{ $sum: ['$morn_selected_slots', '$aft_selected_slots'] },
						'$lims.maximum'
					]
				},
				...proj
			}
		}
	] : 
	[
		{
			$project: {
				...proj
			}
		}
	]

	faculty.aggregate(query)
	.then(data => res.json({data: data, error: null}))
	.catch(err => res.json({data: null, error: err}));
	
};