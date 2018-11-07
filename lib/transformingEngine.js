import FileTransformer from './transformers/FileTransformer';

export async function transform( fileReadResult, columnMapping ){
	if( !fileReadResult ) throw new Error( 'You must provide a fileReadResult' );
	if( !columnMapping ) throw new Error( 'You must provide an columnMapping' );
	
	const fileTransformer = new FileTransformer( fileReadResult.transformer, columnMapping );
	const rows = fileTransformer.transformRows( fileReadResult.dataRows );
	
	return rows;
}
