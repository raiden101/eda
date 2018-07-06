const fs = require('fs');
const path = require('path');
const nitte_logo = "data:image/png;base64," + fs.readFileSync(
  path.join(__dirname, 'nitte_logo.png'), 'base64'
);
const fl_logo = "data:image/png;base64," + fs.readFileSync(
  path.join(__dirname, 'fl_logo.png'), 'base64'
);

module.exports = {
  header: {
    image: nitte_logo,
    width: 90,
    alignment: 'center',
    margin: [0, 10, 0, 15]
  },
  content: [
    {
      text: 'Exam duty chart', 
      margin: [0, 18, 0, 0],
      fontSize: 17, 
      lineHeight: 2
    },
    {
      table: {
        headerRows: 1,
        widths: ['*', '*'],
        body: [
          [
            { text: 'Session', style: "tableHeader" },
            { text: 'Date(dd/mm/yyyy)', style: 'tableHeader' }
          ]
        ]
      }
    },
    {
      image: fl_logo,
      width: 60,
      alignment: 'center',
      margin: [0, 60, 0, 10]
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
    },
  },
  pageMargins: [70, 60, 60, 70]
}