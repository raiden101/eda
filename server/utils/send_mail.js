const nodemailer = require('nodemailer');
const pdfmake = require('pdfmake/build/pdfmake');
const vfs_fonts = require('pdfmake/build/vfs_fonts');
const { email_add, email_pwd } = require('../../credentials/credentials')

pdfmake.vfs = vfs_fonts.pdfMake.vfs;

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

const send_mail = (email, name, doc_def) => {
  return new Promise((resolve, reject) => {

    pdfmake.createPdf(doc_def).getBase64(base_64_data => {

      let mail_ops = {
        from: email_add,
        to: email,
        html: `<h4>Dear prof. ${name}</h4>
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
          reject("error while sending the mail")
        else 
          resolve('mail sent successfuly');
      })   
      
    });
  });

}
