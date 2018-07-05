const xlsx = require('node-xlsx').default;
const { morn_exam, aft_exam } = require('../../../../schemas/collections');
const format_array = [
  "string",
  "number",
  "number"
], column_length = 3;

const msg_generator = (success, error_msg) => {
  return {
    success: success,
    error: error_msg
  }
}
// does both duplicate check and format check.
const is_valid = (slots) => {
  let morn_set = new Set(), 
      aft_set = new Set();
  for(let slot of slots) {
    // format check.
    if(!slot.length)
      continue;
    if(slot.length !== column_length)
      return msg_generator(false, "invalid data format!!!!");
    for(let i=0;i<column_length;++i)
      if(typeof slot[i] !== format_array[i])
       return msg_generator(false, "invalid data format!!!");
    
    // duplicate check.
    if(slot[0] === "morning") {
      if(morn_set.has(slot[1]))
        return msg_generator(false, "duplicate exist in the file!!!")
      morn_set.add(slot[1])
    }else {
      if(aft_set.has(slot[1]))
        return msg_generator(false, "duplicate exist in the file!!!")
      aft_set.add(slot[1])
    }
  }
  return msg_generator(true, null);
}
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
  
  let check = is_valid(slots_data);
  if(!check.success)
    res.json({ error: check.error, data: null })
  else
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