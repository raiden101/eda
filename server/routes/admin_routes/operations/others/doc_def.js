module.exports = {
  content: [
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