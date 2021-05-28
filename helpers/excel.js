const xlsx = require( 'xlsx' );

async function writeDataInExcel ( EXCEL_PATH, pdfData ) {
    
    try {

        const dataInJSON = excelToJSON( EXCEL_PATH );

        pushInJSON( dataInJSON, pdfData );

        const newWorkBook = await xlsx.utils.book_new();
        const newWorkSheet = await xlsx.utils.json_to_sheet( dataInJSON );

        xlsx.utils.book_append_sheet( newWorkBook, newWorkSheet, 'Hoja 1' );
        await xlsx.writeFile( newWorkBook, 'excel.xlsx' );
        console.log('Archivo creado')

    } catch (error) {
        console.log(error)
    }
}

function excelToJSON ( EXCEL_PATH ) {

    const workBook = xlsx.readFile( EXCEL_PATH );
    const firstSheet = workBook.Sheets[ workBook.SheetNames[ 0 ] ];
    const dataInJSON = xlsx.utils.sheet_to_json( firstSheet );

    return dataInJSON
}

function pushInJSON ( jsonData, pdfData ) {
                  
    pdfData.forEach( ( { INGRESO, EGRESO, RETIRO, VENTA_DEL_DIA } ) => {
        
        if ( isAlreadyInExcel( INGRESO, jsonData ) ) {
            console.log(`El PDF con fecha de Ingreso ${ INGRESO } ya está en el pdf.`);
            return;
        }

        // Convertimos a numero, le sacamos el punto porque es tomado como float sino
        const ventaNum = Number( VENTA_DEL_DIA.split( ',' )[ 0 ].replace( /\./g, '' ) );
        const retiroNum = Number( RETIRO.split( ',' )[ 0 ].replace( /\./g, "" ) );
        
        jsonData.push( {
            INGRESO,
            EGRESO,
            RETIRO,
            "VENTA DEL DIA": VENTA_DEL_DIA,
            TOTAL: `${ ventaNum - retiroNum },00`
        } );
    });
}

const isAlreadyInExcel = ( INGRESO, jsonData ) => jsonData.find( data => data.INGRESO === INGRESO );

module.exports = writeDataInExcel;