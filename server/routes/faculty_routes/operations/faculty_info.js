const { faculty } = require('../../../schemas/collections');

module.exports = (req, res) => {
	faculty.findOne({ fac_id: req.fac_id }, "-password")
  .then(data => res.json({ data: data, error: null }))
  .catch(err =>
    res.json({ error: "error while fetching data", data: null })
  );
}