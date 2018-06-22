const xlsx = require('node-xlsx').default;
const { faculty } = require('../../../../schemas/collections');

module.exports = (req, res) => {
  if(!req.files)
    return res.json({ data: null, error: "error while receving the file."});
  
  let file = req.files.file_input;
  let namearr = file.name.split(".");
  if(namearr[namearr.length-1] !== 'xlsx')  // checking extension type.
    return res.json({ data: null, error: "invalid file type!! .xlsx file expected!!" })
  
  let data_from_buffer = xlsx.parse(file.data);
  let fac_data = data_from_buffer[0].data;

  Promise.all(fac_data.map(fac => {
    return new faculty({
      fac_id: fac[0],
      fac_name: fac[1],
      fac_des: fac[2],
      branch: fac[3],
      email: fac[4],
      contact_no: fac[5],
      password: fac[5]
    }).save();
  }))
  .then(data => res.json({ data: "data succesfully uploaded to db", error: null }))
  .catch(err => res.json({ error: "error while uploading to db", data: null }));
}