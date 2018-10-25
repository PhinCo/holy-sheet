const Papa = require('papaparse');
const _ = require('lodash');

/**
 * Reads it all into memory. I'm assuming the csv files are relatively small. If this assumptions is wrong, 
 * we can adapt this to streaming mode. The problem is that I don't think the XLXS parser support stream reading.
 * I don't feel like writing that shit ... ya know ut i meen
 */
class CsvReader {
	
	constructor( localCsvFile, parserOptions ){
		this.localCsvFile = localCsvFile;
		this.parserOptions = parserOptions;
		this.rows = null;
	}
	
	_cleanColumns( value ){
		if( _.isString(value) && value.length === 0 ){ // remove empty strings - stay consistent with XSXL reader
			return null;
		}
		return value;
	}
	
	async readEntireFile(){
		const self = this;
		return new Promise( function( resolve, reject ){
			Papa.parse( self.localCsvFile, Object.assign( {}, self.parserOptions, {
				header: true,
				trimHeaders: true,
				transform: self._cleanColumns,
				complete ( result ) {
					self.rows = result.data;
					resolve( self.rows );
				},
				error ( error ) {
					reject( error );
				}
			}));
		});
	}
	
}

export default CsvReader;