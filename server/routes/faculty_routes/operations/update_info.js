const { faculty } = require('../../../schemas/collections');

module.exports = (req, res) => {
  let set_fields = {
    contact_no: req.body.fac_data.contact_no,
    fac_name: req.body.fac_data.fac_name,
    email: req.body.fac_data.email
  }
  if(req.body.fac_data.password !== "" || req.body.fac_data.password !== null)
    set_fields['password'] = req.body.fac_data.password;
	faculty.updateOne(
    { fac_id: req.fac_id },
    { $set: set_fields }
  )
  .then(data => res.json({ data: "updation successful", error: null }))
  .catch(err => res.json({ error: "error while updating", data: null }));
}