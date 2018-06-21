const pdfmake = require('pdfmake/build/pdfmake');
const vfs_fonts = require('pdfmake/build/vfs_fonts');
pdfmake.vfs = vfs_fonts.pdfMake.vfs;

const { email_add } = require('../../../../../credentials/credentials');
const { morn_exam, aft_exam } = require('../../../../schemas/collections');

const doc_def = require('../utils/doc_def');
const transporter = require('../utils/transporter');

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

function send_mail(fac_id, email, name) {
  return new Promise((resolve, reject) => {

    get_doc_def(fac_id)
    .then(doc_definition => {

      pdfmake.createPdf(doc_definition).getBase64(base_64_data => {
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
          if(error) {
            resolve({ msg: email, success: false });
          }
          else 
            resolve({ msg: 'done', success: true });
        })     
      });
      
    })
    .catch(err => resolve({ msg: email, success: false }))
    
  });

}


// {token: '', mail: '', faculties: [{ fac_id, email, name }...]
module.exports = (req, res) => {
  let faculties = req.body.faculties,
      rejected_mails = [];

  (function sendMail(i) {

    if(i < faculties.length) {
      send_mail(faculties[i].fac_id, 'newtest191@gmail.com', faculties[i].fac_name)
      .then(resp => {
        // resp.msg has the email which wasnt sent.
        if(!resp.success)
          rejected_mails.push(resp.msg);
        sendMail(++i);
      });
    }else { 
      res.json({ data: 
        { rejected_mails: rejected_mails }, 
        error: null 
      });
    }

  })(0);

}