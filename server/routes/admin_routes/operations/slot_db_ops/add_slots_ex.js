const xlsx = require('node-xlsx').default;
const { morn_exam, aft_exam } = require('../../../../schemas/collections');


// {token:''}
// excel file format: session(morning/afternoon) // date // total_slot

module.exports = (req, res) => {
  if(!req.files)
    return res.json({ data: null, error: "error while receving the file."});
  
  let file = req.files.slots_excel;
  let namearr = file.name.split(".");
  if (namearr[namearr.length - 1] !== 'xlsx')
    return res.json({ data: null, error: "invalid file type!! .xlsx file expected!!" })
  let data_from_buffer = xlsx.parse(file.data);
  let slots_data = data_from_buffer[0].data;
  
  // allowed date formats for excel
  // (YYYY/MM/DD)
  console.log(slots_data);
  Promise.all(slots_data.map(slot => {
    if(slot.length == 0) return;
    let _collection = slot[0] === 'morning' ? 
    morn_exam : aft_exam;  
    
    return new _collection({
      date: new Date((slot[1] - (25567+2))*86400*1000),
      total_slot: slot[2]
    }).save();
  }))
  .then(data => res.json({ data: "data succesfully uploaded to db", error: null }))
  .catch(err => res.json({ error: "error while uploading to db", data: null }));
}