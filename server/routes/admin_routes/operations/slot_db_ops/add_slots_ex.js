const xlsx = require('node-xlsx').default;
const { morn_exam, aft_exam } = require('../../../../schemas/collections');


// {token:'', session: ''}44

module.exports = (req, res) => {
  if(!req.files)
    return res.json({ data: null, error: "error while receving the file."});
  
  let file = req.files.slots_excel;
  let namearr = file.name.split(".");
  if (namearr[namearr.length - 1] !== 'xlsx')
    return res.json({ data: null, error: "invalid file type!! .xlsx file expected!!" })
  let data_from_buffer = xlsx.parse(file.data);
  let slots_data = data_from_buffer[0].data;
  let _collection = req.body.session === 'morning' ? morn_exam : aft_exam;

  // allowed date formats for excel
  // (YYYY-MM-DD) or MM/DD/YYYY
  Promise.all(slots_data.map(slot => {
    return new _collection({
      date: new Date(slot[0]),
      total_slot: slot[1]
    }).save();
  }))
  .then(data => res.json({ data: "data succesfully uploaded to db", error: null }))
  .catch(err => res.json({ error: "error while uploading to db", data: null }));
}