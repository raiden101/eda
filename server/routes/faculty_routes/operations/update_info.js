const { faculty } = require('../../../schemas/collections');

module.exports = (req, res) => {
	faculty.updateOne(
    { fac_id: req.fac_id },
    {
      $set: {
        contact_no: req.body.fac_data.contact_no,
        password: req.body.fac_data.password,
        fac_name: req.body.fac_data.fac_name,
        branch: req.body.fac_data.branch,
        email: req.body.fac_data.email
      }
    }
  )
  .then(data => res.json({ data: "updataion successful", error: null }))
  .catch(err => res.json({ error: "errow while updating", data: null }));
}