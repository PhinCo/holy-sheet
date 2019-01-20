
// const path = require('path');
import CsvReader from './CsvReader';
import XlsxReader from './XlsxReader';
import _ from 'lodash';
import validator from '../validator';

function readerForFile( file ){
	if( _.endsWith( file.name, '.xlsx' ) ){
		return XlsxReader;
	}else if( _.endsWith( file.name, '.csv' )){
		return CsvReader;
	}
	throw new Error('No reader for this type of file: ' + file.name );
}

export async function readFileForTransformer( file, transformer, readOptions ){
	if( !transformer ) throw new Error('transformer is required');
	validator.validateTransformer( transformer ); // throws if there's a problem

	const Reader = readerForFile( file );

	const options = Object.assign( {}, {
		headerRowNumber: transformer.headerRowNumber,
		skipRowsFromHeader: transformer.skipRowsFromHeader,
		ignoreBlankLines: transformer.ignoreBlankLines
	}, readOptions );
	
	if( transformer.headerRowNumber <= 0 ) options.headerRowNumber = 1;

	const reader = new Reader( file, transformer, options );
	const readResult = await reader.readFile();
	readResult.transformer = transformer; // Pack this on here to avoid passing it in later - these things are tightly paired
	return readResult;
}