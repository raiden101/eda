const fs = require('fs');
const path = require('path');
const fl_logo = fs.readFileSync(path.join(__dirname, 'fl_logo.png'), 'base64');
const nitte_logo = fs.readFileSync(path.join(__dirname, '/nitte_logo.png'), 'base64');

module.exports = {
  content: [
    {
      image: nitte_logo,
      width: 30, height: 30,
      alignment: 'center'
    },
    {
      text: 'Exam duty chart', 
      fontSize: 20, bold: true, alignment: 'center', lineHeight: 2
    },
    {
      table: {
        headerRows: 1,
        widths: ['*', '*'],
        body: [
          [{ text: 'Session', style: "tableHeader" },
          { text: 'Date(dd/mm/yyyy)', style: 'tableHeader' }]
        ]
      }
    },
    {
      image: fl_logo,
      width: 30, height: 30,
      alignment: 'center'
    },
    {
      text: "Powered by Finite Loop.", 
      fontSize: 14, bold: false, alignment: 'center', lineHeight: 2
    }
  ],
  styles: {
    tableHeader: {
      bold: true,
      fontSize: 15,
      color: 'black',
      alignment: 'center',
    },
    row: {
      alignment: 'center',
      fontSize: 13,
    }
  },
  pageMargins: [70, 60, 60, 70]
}