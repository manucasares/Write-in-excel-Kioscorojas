const fs = require( 'fs' );

const pdfParse = require( 'pdf-parse' );

async function getPDFData () {

    try {

        const pdfs = await getPDFs();

        if ( !pdfs.length ) {
            throw new Error( 'No se encontraron pdfs' );
        }

        const pdfsData = await getPdfsData( pdfs );

        return pdfsData;

    } catch (error) {
        console.log(error)
    }
}

function getPDFs () {
    const files = fs.readdirSync( './' );
    return files.filter( file => file.includes('.pdf') );
}

function getPDFText ( pdfPath ) {

    return new Promise( async( resolve ) => {
        const pdfFile = await fs.readFileSync( pdfPath );
        const data = await pdfParse( pdfFile );
        resolve( data.text );
    } );
}

function getRegex () {
    const rgxFechas = new RegExp( /..\/[0-9]+\/[0-9]+-[0-9]+:[0-9]+:../, 'g' );
    const rgxRetiros = new RegExp( /([1-9]+\.?[0-9]+)?.,[0-9]+(?=[0-9]{2}\/[0-9]+\/[0-9]+)/, 'g' );
    const rgxVentas = new RegExp( /(?<=[0-9]+.[0-9]+,..\s*)[0-9]+.[0-9]+,../, 'g' );
    return { rgxFechas, rgxRetiros, rgxVentas }
}

function getData ( pdfText ) {

    const { rgxFechas, rgxRetiros, rgxVentas } = getRegex();

    // Le sacamos los saltos de línea
    pdfText = pdfText.split('\n').join('');

    const [ INGRESO, EGRESO ] = pdfText.match( rgxFechas );
    const RETIRO = pdfText.match( rgxRetiros )[0];
    const VENTA_DEL_DIA = pdfText.match( rgxVentas )[0];

    return { INGRESO, EGRESO, RETIRO, VENTA_DEL_DIA };
}

async function getPdfsData ( pdfs ) {
    
    const data = [];

    for ( pdf of pdfs ) {
        let pdfText = await getPDFText( pdf );
        data.push( getData( pdfText ) );
    };

    return data;
}


module.exports = getPDFData;