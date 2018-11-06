import readers from './readers';
import FileTransformer from './transformers/FileTransformer';
import CsvWriter from './writers/CsvWriter';

export async function transform( inputFilePath, transformer, columnMapping, outputFilePath ){
	if( !inputFilePath ) throw new Error( 'You must provide an inputFilePath' );
	if( !transformer ) throw new Error( 'You must provide a transformer' );
	if( !columnMapping ) throw new Error( 'You must provide an columnMapping' );
	if( !outputFilePath ) throw new Error( 'You must provide an outputFilePath' );
	
	const Reader = readers.readerForFile( inputFilePath );
	const reader = new Reader( inputFilePath );
	const inputRows = await reader.readEntireFile();

	const fileTransformer = new FileTransformer( transformer, columnMapping );
	const rows = fileTransformer.transformRows( inputRows );
	
	const writer = new CsvWriter( outputFilePath );
	await writer.write( rows );
}

export async function transformRows( inputRows, transformer, columnMapping ){
	if( !inputRows ) throw new Error( 'You must provide an inputRows' );
	if( !transformer ) throw new Error( 'You must provide a transformer' );
	if( !columnMapping ) throw new Error( 'You must provide an columnMapping' );
	
	const fileTransformer = new FileTransformer( transformer, columnMapping );
	return fileTransformer.transformRows( inputRows );
}