let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const slot_lim_schema = new Schema({
    fac_des: Number,
    minimum: Number,
    maximum: Number,
    morn_max: Number,
    aft_max: Number
})

const slot_limitation = mongoose.model('slot_limitation', slot_lim_schema);
module.exports = slot_limitation;