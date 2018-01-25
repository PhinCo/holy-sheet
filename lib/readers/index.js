
const path = require('path');
const CsvReader = require('./CsvReader');
const XlsxReader = require('./XlsxReader');

exports.readerForFile = function( filePath ){
	if( path.extname( filePath ) === '.xlsx' ){
		return XlsxReader;
	}else if( path.extname( filePath ) === '.csv' ){
		return CsvReader;
	}
	throw new Error('No reader for this type of file: ' + filePath );
};