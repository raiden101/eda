const admin_schema = new Schema({
  name: String,
  branch: String,
  email: String,
  contact_no: String,
  username: String,
  password: String
});

const admin = mongoose.model('administrator', admin_schema);

///////////////////////////////////////
const exam_aft_schema = new Schema({
  date: Date,
  total_slot: Number,
  remaining_slot: Number,
  selected_slot: Number,
  selected_members: [String]
});

const aft_exams = mongoose.model('aft_exam', exam_aft_schema);

//////////////////////////////////
const exam_morn_schema = new Schema({
  date: Date,
  total_slot: Number,
  remaining_slot: Number,
  selected_slot: Number,
  selected_members: [String]
});

const morn_exams = mongoose.model('morn_exam', exam_morn_schema);


/////////////////////////////////
const slot_lim_schema = new Schema({
  fac_des: Number,
  minimum: Number,
  maximum: Number,
  morn_max: Number,
  aft_max: Number
})

const slot_limitation = mongoose.model('slot_limitation', slot_lim_schema);


//////////////////////////////////////
const faculty_schema = new Schema({
  fac_id: String,
  fac_name: String,
  fac_des: Number,
  branch: String,
  email: String,
  contact_no: { type: String, default: 1111 },
  password: { type: String, default: 1111 },
  mrn_slots_selected: { type: Number, default: 0 },  // has to be bw min and max obtained from "slot_limitations" collection/table.
  aft_slots_selected: { type: Number, default: 0 }  // """"""""""""""""""""""""""""""""""""
})

const faculty = mongoose.model('facultie', faculty_schema);
////////////////////////////////////////////


module.exports = {
  slot_limitation,
  faculty,
  morn_exam,
  aft_exam,
  admin
}
