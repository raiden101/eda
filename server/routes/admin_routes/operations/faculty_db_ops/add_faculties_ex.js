const xlsx = require('node-xlsx').default;
const { faculty } = require('../../../../schemas/collections');
const format_array = [
  "number",
  "string",
  "number",
  "string",
  "string",
  "number"
], column_length = 6;

const msg_generator = (success, error_msg) => {
  return {
    success: success,
    error: error_msg
  }
}
// does both duplicate check and format check.
const is_valid = (faculties) => {
  let s = new Set();
  for(let faculty of faculties) {
    // format check.
    if(!faculty.length)
      continue;
    if(faculty.length !== column_length)
      return msg_generator(false, "invalid data format!!!!");
    for(let i=0;i<column_length;++i)
      if(typeof faculty[i] !== format_array[i])
        return msg_generator(false, "invalid data format!!!");
    
    // duplicate check.
    if(s.has(faculty[0]))
      return msg_generator(false, "duplicate id found!!!")
    s.add(faculty[0])
  }
  return msg_generator(true, null);
}
module.exports = (req, res) => {
  if(!req.files)
    return res.json({ data: null, error: "error while receving the file."});
  
  let file = req.files.file_input;  // uploaded file.
  let namearr = file.name.split(".");  // for checking extension.
  if(namearr[namearr.length-1] !== 'xlsx')  // checking extension type.
    return res.json({ data: null, error: "invalid file type!! .xlsx file expected!!" })
  
  let data_from_buffer = xlsx.parse(file.data); 
  let fac_data = data_from_buffer[0].data;

  let check = is_valid(fac_data);
  if(!check.success)
    res.json({ error: check.error, data: null });
  else 
    Promise.all(fac_data.map(fac => {
      return new faculty({
        fac_id: fac[0],
        fac_name: fac[1],
        fac_des: fac[2],
        branch: fac[3],
        email: fac[4],
        contact_no: String(fac[5]),
        password: String(fac[5])
      }).save();
    }))
    .then(data => res.json({ data: "data succesfully uploaded to db", error: null }))
    .catch(err => res.json({ error: "error while uploading to db", data: null }));
}