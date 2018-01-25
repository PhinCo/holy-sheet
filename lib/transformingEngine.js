const fs = require('fs');
const readers = require('./readers');
const FileTransformer = require('./transformers/FileTransformer');
const CsvWriter = require('./writers/CsvWriter');

exports.transform = async function( inputFilePath, transformer, columnMapping, outputFilePath ){
	if( !inputFilePath ) throw new Error( 'You must provide an inputFilePath' );
	if( !transformer ) throw new Error( 'You must provide a transformer' );
	if( !columnMapping ) throw new Error( 'You must provide an columnMapping' );
	if( !outputFilePath ) throw new Error( 'You must provide an outputFilePath' );
	
	if( fs.existsSync( outputFilePath ) ) fs.unlinkSync( outputFilePath );

	const Reader = readers.readerForFile( inputFilePath );
	const reader = new Reader( inputFilePath );
	const inputRows = await reader.readEntireFile();

	const fileTransformer = new FileTransformer( transformer, columnMapping );
	const rows = fileTransformer.transformRows( inputRows );
	
	const writer = new CsvWriter( outputFilePath );
	await writer.write( rows );
};
