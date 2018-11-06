import Papa from'papaparse';
import _ from 'lodash';
import AbstractReader from './AbstractReader';

/**
 * Reads it all into memory. I'm assuming the csv files are relatively small. If this assumptions is wrong, 
 * we can adapt this to streaming mode. The problem is that I don't think the XLXS parser support stream reading.
 * I don't feel like writing that shit ... ya know ut i meen
 */
class CsvReader extends AbstractReader {
	
	constructor( localCsvFile, transformer, parserOptions ){
		super( transformer );
		
		this.localCsvFile = localCsvFile;
		this.parserOptions = Object.assign( {}, {
			header: true,
			trimHeaders: true,
			skipEmptyLines: true,
			startingRowNumber: 0,
			rowCount: 10
		}, parserOptions );
		this.rows = null;
	}
	
	_cleanColumns( value ){
		if( _.isString(value) && value.length === 0 ){ // remove empty strings - stay consistent with XSXL reader
			return null;
		}
		return value;
	}

	async readFile(){
		const self = this;
		return new Promise( function( resolve, reject ){
			Papa.parse( self.localCsvFile, Object.assign( {}, self.parserOptions, {
				header: true,
				trimHeaders: true,
				transform: self._cleanColumns,
				skipEmptyLines: true,
				complete ( result ) {
					self.rows = result.data;
					const extractions = self.performExtractions( self.rows );

					resolve({
						rows: self.rows,
						extractions
					});
				},
				error ( error ) {
					reject( error );
				}
			}));
		});
	}
	
}

export default CsvReader;