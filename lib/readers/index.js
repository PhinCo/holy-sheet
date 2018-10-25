
// const path = require('path');
import CsvReader from './CsvReader';
import XlsxReader from './XlsxReader';
import _ from 'lodash';

export default function readerForFile( fileReader ){
	if( _.endsWith( fileReader.name, '.xlsx' ) ){
		return XlsxReader;
	}else if( _.endsWith( fileReader.name, '.csv' )){
		return CsvReader;
	}
	throw new Error('No reader for this type of file: ' + fileReader );
}
