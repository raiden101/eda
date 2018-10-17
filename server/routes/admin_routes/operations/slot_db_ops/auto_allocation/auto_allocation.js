const {
  faculty,
  morn_exam,
  aft_exam
} = require("../../../../../schemas/collections");
const pending_fac_query = require("./pending_fac_query");

const allocateSlots = (currFaculty, flag) => {
  // flag = true or false
  // true === morning, false === afternoon
  let {
    morn_selected_slots,
    aft_selected_slots,
    toAllocate,
    fac_id
  } = currFaculty;
  let sessionString = flag ? "morn_selected_slots" : "aft_selected_slots";
  let allocatedCount = 0;
  let session = flag ? morn_exam : aft_exam;
  let selectedDateArray = (flag ? morn_selected_slots : aft_selected_slots).map(
    ({ date }) => date
  );

  return new Promise((resolve, reject) => {
    session
      .aggregate([
        { $match: { date: { $nin: [selectedDateArray] } } },
        {
          $addFields: {
            available: {
              $lt: [{ $size: "$selected_members" }, "$total_slot"]
            }
          }
        },
        { $match: { available: true } },
        { $project: { date: 1 } }
      ])
      .limit(toAllocate)
      .then(dates => {
        // Got allocatable dates.
        allocatedCount = dates.length;
        Promise.all(
          dates.map(currDate => {
            return session
              .findByIdAndUpdate(currDate._id, {
                $push: { 'selected_members': [fac_id] }
              })
              .then(_ => {
                return faculty.updateOne(
                  { fac_id: fac_id },
                  { $push: { [sessionString]: currDate.date } }
                );
              });
          })
        )
        .then(_ => {
          resolve(allocatedCount);
        })
        .catch(err => {
          reject();
        });
      })
      .catch(err => {
        reject(); // do error handling.
      });
  });
};

module.exports = (req, res) => {
  faculty
    .aggregate(pending_fac_query)
    .then(pending_faculties => {
      // Got all pending faculties.
      (function allocate(fac_index) {
        if (fac_index >= pending_faculties.length)
          return res.json({
            error: null,
            data: "allocation completed sucessfully"
          });

        let _faculty = pending_faculties[fac_index];
        // Have to allocate '_faculty.toAllocate' number of slots
        // to that faculty.(No condition on session[m/a])
        // But slots shouldnt repeat.

        allocateSlots(_faculty, true)
          .then(slotAllocated => {
            let diff = _faculty.toAllocate - slotAllocated;
            _faculty.toAllocate = diff;
            if (diff > 0) return allocateSlots(_faculty, false);
            return Promise.resolve();
          })
          .then(_ => {
            setTimeout(() => {
              allocate(++fac_index);
            }, 0);
          })
          .catch(err => {
            throw new Error("Error");
          });

      })(0);
    })
    .catch(err => res.json(err));
};
