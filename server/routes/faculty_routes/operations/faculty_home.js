const { faculty } = require("../../../schemas/collections");

module.exports = (req, res) => {
  let resp = {};

  faculty
    .aggregate([
      { $match: { fac_id: req.fac_id } },
      {
        $lookup: {
          from: "slot_limitations",
          localField: "fac_des",
          foreignField: "fac_des",
          as: "slot_lims"
        }
      },
      {
        $project: {
          fac_des: 1,
          fac_name: 1,
          email: 1,
          contact_no: 1,
          branch: 1,
          morn_selected_slots: 1,
          aft_selected_slots: 1,
          "slot_lims.morn_max": 1,
          "slot_lims.aft_max": 1,
          "slot_lims.minimum": 1
        }
      }
    ])
    .then(data => {
      res.json(data);
    })
    .catch(err => res.json(err));
};
