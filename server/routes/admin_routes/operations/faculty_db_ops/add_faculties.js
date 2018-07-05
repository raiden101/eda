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

const is_valid = (data) => {
  for(let dat of data) {
    if(dat.length !== column_length)
      return false;
    for(let i=0;i<column_length;++i)
      if(typeof dat[i] !== format_array[i])
        return false;
  }
  return true;
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

  // checking for duplicates fac_id's
  let s = new Set();
  for(let fac of fac_data)
    s.add(fac[0]);  // adding fac_id's to the set.
  
  if(s.size !== fac_data.length)
    res.json({ error: "duplicate exists in excel file!!", data: null });
  else if(!is_valid(fac_data))
    res.json({ error: "something wrong with data format!!", data: null })
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