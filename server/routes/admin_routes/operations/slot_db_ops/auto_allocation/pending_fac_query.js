module.exports = [
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
    $addFields: {
      pending: {
        $lt: [
          {
            $sum: [
              { $size: '$morn_selected_slots' },
              { $size: '$aft_selected_slots' }
            ]
          },
          '$lims.maximum'
        ]          
      },
    }
  },
  { $match: { pending: true } },
  { 
    $project: {
      'fac_id': 1,
      'lims.morn_max': 1,
      'lims.aft_max': 1,
      'aft_count': { $size: '$aft_selected_slots' },
      'morn_count': { $size: '$morn_selected_slots' },
      'selections': { 
        $concatArrays: ['$morn_selected_slots', '$aft_selected_slots'] 
      }
    }
  }
]