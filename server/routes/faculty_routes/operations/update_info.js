const { faculty } = require('../../../schemas/collections');

module.exports = (req, res) => {
  let set_fields = {}, fac_data = req.body.fac_data;

  for(let key in fac_data) 
    if(fac_data[key] !== "")
      set_fields[key] = fac_data[key];
    
  faculty.updateOne(
    { fac_id: req.fac_id },
    { $set: set_fields }
  )
  .then(data => res.json({ data: "updation successful", error: null }))
  .catch(err => res.json({ error: "error while updating", data: null }));
}