const { 
  faculty, 
  morn_exam, 
  aft_exam
} = require('../../../../../schemas/collections');
const pending_fac_query = require('./pending_fac_query');

module.exports = (req, res) => {

  faculty.aggregate(pending_fac_query)
  .then(pending_faculties => {

    (function allocate(fac_index) {
      if(fac_index >= pending_faculties.length)
        return res.json({ error: null, data: "allocation completed sucessfully"})
      

      let _faculty = pending_faculties[fac_index];

      (
        _faculty.morn_count < _faculty.lims.morn_max ?
        morn_exam.find(
          { 'date': { $nin: _faculty.selected_dates } },
          'date'
        ).limit(_faculty.lims.morn_max - _faculty.morn_count)
        : Promise.resolve(-1)
      )
      .then(morn_dates => {
        return (morn_dates !== -1 ? 
        Promise.all(morn_dates.map(obj => {
          return morn_exam.findByIdAndUpdate(obj._id,
            { $push: { 'selected_members' : _faculty.fac_id } }
          ).then(_ => {
            _faculty.selected_dates.push(obj.date);
            return faculty.updateOne(
              { fac_id: _faculty.fac_id },
              { $push: { 'morn_selected_slots': obj.date } }
            )}
          )
        })) : Promise.resolve(-1))
      })
      .then(_ => {
        return (_faculty.aft_count < _faculty.lims.aft_max ?
        aft_exam.find(
          { 'date': { $nin: _faculty.selected_dates } },
          'date'
        ).limit(_faculty.lims.aft_max - _faculty.aft_count):
        Promise.resolve(-1))
      })
      .then(aft_dates => {
        return (aft_dates !== -1 ? 
        Promise.all(aft_dates.map(obj => {
          return aft_exam.findByIdAndUpdate(obj._id,
            { $push: { 'selected_members' : _faculty.fac_id } }
          ).then(_ => {
            _faculty.selected_dates.push(obj.date);
            return faculty.updateOne(
              { fac_id: _faculty.fac_id },
              { $push: { 'aft_selected_slots': obj.date } }
            )}
          )
        })) : Promise.resolve(-1))
      })      
      .then(__ => {
        setTimeout(_ => {allocate(++fac_index)}, 0);
      })
      .catch(err => res.json({ error: "error while allocating the slots!!", data: null }));

    })(0);
  })
  .catch(err => res.json(err))
}