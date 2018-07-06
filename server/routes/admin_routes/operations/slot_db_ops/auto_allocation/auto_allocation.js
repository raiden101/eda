const { 
  faculty, 
  morn_exam, 
  aft_exam
} = require('../../../../../schemas/collections');
const pending_fac_query = require('./pending_fac_query');

module.exports = (req, res) => {
  // getting pending faculties.
  faculty.aggregate(pending_fac_query)
  .then(pending_faculties => {

    (async function allocate(fac_index) {
      if(fac_index >= pending_faculties.length)
        return res.json({ error: null, data: "allocation completed sucessfully"})
      

      let _faculty = pending_faculties[fac_index];

      // getting allocatable slots for the current user.
      let p1 = _faculty.morn_count < _faculty.lims.morn_max ?
        morn_exam.find(
          { 'selected_members': { $nin: [_faculty.fac_id] } },
          'date'
        ).limit(_faculty.lims.morn_max - _faculty.morn_count)
        : Promise.resolve(-1);
      let p2 = _faculty.aft_count < _faculty.lims.aft_max ?
        aft_exam.find(
          { 'selected_members': { $nin: [_faculty.fac_id] } },
          'date'
        ).limit(_faculty.lims.aft_max - _faculty.aft_count):
        Promise.resolve(-1);
        
      // allocating the slots.
      Promise.all([p1, p2])
      .then(data => {
        let morn_dates = data[0], aft_dates = data[1];
        let a = morn_dates !== -1 ?
          Promise.all(morn_dates.map(obj => {
            return morn_exam.findByIdAndUpdate(obj._id,
              { $push: { 'selected_members' : _faculty.fac_id } }
            ).then(_ => faculty.updateOne(
              { fac_id: _faculty.fac_id },
              { $push: { 'morn_selected_slots': obj.date } }
            ))
          })) : Promise.resolve(-1);  
        let b = aft_dates !== -1 ?
          Promise.all(aft_dates.map(obj => {
            return aft_exam.findByIdAndUpdate(obj._id,
              { $push: { 'selected_members': _faculty.fac_id } }
            ).then(_ => faculty.updateOne(
              { fac_id: _faculty.fac_id },
              { $push: { 'aft_selected_slots': obj.date } }
            ))
          })): Promise.resolve(-1);

          return Promise.all([a, b]);
      })
      .then(data => {
        setTimeout(() => {allocate(++fac_index)}, 0);
      })
      .catch(err => res.json({ error: "error while allocating!!", data: null }));

    })(0);
  })
  .catch(err => res.json(err))
}