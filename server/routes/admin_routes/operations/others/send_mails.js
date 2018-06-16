const nodemailer = require('nodemailer');

const pdfmake = require('pdfmake/build/pdfmake');
const vfs_fonts = require('pdfmake/build/vfs_fonts');
pdfmake.vfs = vfs_fonts.pdfMake.vfs;

const { email_add, email_pwd } = require('../../../../../credentials/credentials');
const { morn_exam, aft_exam } = require('../../../../schemas/collections');

const doc_def = require('./doc_def');


// function for extractiong human readable date.
const get_date = (date) => {
  return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
}
const layout = {
  paddingTop: (i, node) => 7,
  paddingBottom: (i, node) => 7,
  vLineWidth: (i, node) => 0,
  hLineWidth: (i, node) => i <= 1 ? 1 : 0, 
  hLineColor: (i, node) => i <= 1 ? '#555': null,
  fillColor: (i, node) => i%2 === 0 ? '#eee': null
}

// preparing transporer using which mail will be sent.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: email_add,
    pass: email_pwd
  },
  tls: {
    rejectUnauthorized: false
  }
})

// function for getting definition for the pdf.
// ("pdfmake" module specific).
const get_doc_def = (fac_id) => {
  return new Promise((resolve, reject) => {
    
    let docDefinition = JSON.parse(JSON.stringify(doc_def));
    
    //layout is not used in doc_def, as the above JSON process
    // wont parse the functions.
    docDefinition.content[1].layout = layout;
    let body_ref = docDefinition.content[1].table.body;
    
    morn_exam.find({ selected_members: { $in: [fac_id] } }, 'date')
    .then(data => { 
      data.forEach((dat) => {
        body_ref.push([
          { text: 'Morning', style: 'row' }, 
          { text: get_date(dat.date), style: 'row'}
        ])
      })
      return aft_exam.find({ selected_members: { $in: [fac_id] }}, 'date')
    })
    .then(data => {
      data.forEach((dat) => {
        body_ref.push([
          { text: 'Afternoon', style: 'row' }, 
          { text: get_date(dat.date), style: 'row'}
        ])
      });
      resolve(docDefinition);
    })
    .catch(err => reject("error while fetching data"));

  });
}

const send_mail = (fac_id, email, name) => {
  return new Promise((resolve, reject) => {

    get_doc_def(fac_id).then(doc_def => {

      pdfmake.createPdf(doc_def).getBase64(base_64_data => {
        let mail_ops = {
          from: email_add,
          to: email,
          html: `<h3>Dear prof. ${name}</h3>
          <p>We have processed your request for the exam duty and 
          following are your selections.For further query or for 
          any kind of changes, contact ...</p>`,
          subject: 'Exam duty table',  
          attachments: [
            { 
              filename: 'duty.pdf', 
              content: base_64_data, 
              encoding: 'base64',
              contentType: 'text/pdf'
            }
          ]
        }
        
        transporter.sendMail(mail_ops, (error, info) => {
          if(error)
            reject('error')
          else 
            resolve('done');
        })     
      });
      
    })
    .catch(err => reject('error'));
    
  });

}


// faculties: [{ fac_id, email, name }...]
module.exports = (req, res) => {
  Promise.all(req.body.faculties.map(faculty => {
    send_mail(faculty.fac_id, faculty.email, faculty.name)
  }))
  .then(data => res.json({ data: "email sent!!", error: null}))
  .catch(err => res.json({ data: null, error: "error while sending mail"}))
}