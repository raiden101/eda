const pdfmake = require('pdfmake/build/pdfmake');
const vfs_fonts = require('pdfmake/build/vfs_fonts');
pdfmake.vfs = vfs_fonts.pdfMake.vfs;

const { email_add } = require('../../../../../credentials/credentials');
const { faculty } = require('../../../../schemas/collections');

const doc_def = require('../utils/doc_def');
const transporter = require('../utils/transporter');

// function for extractiong human readable date.
const get_date = (date) => {
  return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
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
    
    faculty.findOne(
      { fac_id: fac_id }, 
      'morn_selected_slots aft_selected_slots'
    ).then(data => {
      if(data === null)
        reject("no such id found!!");
      else {
        data.morn_selected_slots.forEach(date => {
          body_ref.push([
            { text: 'Morning', style: 'row' }, 
            { text: get_date(date), style: 'row'}
          ])
        })
        data.aft_selected_slots.forEach(date => {
          body_ref.push([
            { text: 'Afternoon', style: 'row' }, 
            { text: get_date(date), style: 'row'}
          ])
        })
        resolve(docDefinition);
      }  
    })

  });

}

function send_mail(fac_id, email, name, email_body) {
  return new Promise((resolve, reject) => {

    get_doc_def(fac_id)
    .then(doc_definition => {

      pdfmake.createPdf(doc_definition).getBase64(base_64_data => {
        let mail_ops = {
          from: email_add,
          to: email,
          html: email_body,
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
      send_mail(
        faculties[i].fac_id, 
        'newtest191@gmail.com', 
        faculties[i].fac_name,
        req.body.mail.replace('{username}', faculties[i].fac_name)
      )
      .then(resp => {
        // resp.msg has the email which wasnt sent.
        if(!resp.success)
          rejected_mails.push(resp.msg);
        setTimeout(_ => {sendMail(++i)}, 0)
      });
    }else { 
      res.json({ data: 
        { rejected_mails: rejected_mails }, 
        error: null 
      });
    }

  })(0);

}