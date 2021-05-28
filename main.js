const writeDataInExcel = require('./helpers/excel');
const getPDFData = require('./helpers/pdf');

// Clear console
process.stdout.write('\033c');

const EXCEL_PATH = 'excel.xlsx';

async function main () {
    
    const pdfData = await getPDFData();

    await writeDataInExcel( EXCEL_PATH, pdfData );
}

main();




