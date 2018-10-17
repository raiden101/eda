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
      'toAllocate': {
        $subtract: [
          { $sum: ['$lims.morn_max', '$lims.aft_max'] },
          { 
            $sum: [
              { $size: '$aft_selected_slots' }, 
              { $size: '$morn_selected_slots' }
            ] 
          }
        ]
      },
      'aft_selected_slots': 1,
      'morn_selected_slots': 1,
    }
  }
]