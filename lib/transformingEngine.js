import readerForFile from './readers';
import FileTransformer from './transformers/FileTransformer';

export async function transform( inputFilePath, transformer, columnMapping ){
	if( !inputFilePath ) throw new Error( 'You must provide an inputFilePath' );
	if( !transformer ) throw new Error( 'You must provide a transformer' );
	if( !columnMapping ) throw new Error( 'You must provide an columnMapping' );
	
	const Reader = readerForFile( inputFilePath );
	const reader = new Reader( inputFilePath );
	const inputRows = await reader.readEntireFile();

	const fileTransformer = new FileTransformer( transformer, columnMapping );
	const rows = fileTransformer.transformRows( inputRows );
	
	return rows;
}

export async function transformRows( inputRows, transformer, columnMapping ){
	if( !inputRows ) throw new Error( 'You must provide an inputRows' );
	if( !transformer ) throw new Error( 'You must provide a transformer' );
	if( !columnMapping ) throw new Error( 'You must provide an columnMapping' );
	
	const fileTransformer = new FileTransformer( transformer, columnMapping );
	return fileTransformer.transformRows( inputRows );
}