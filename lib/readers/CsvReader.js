import Papa from'papaparse';
import _ from 'lodash';
import AbstractReader from './AbstractReader';

/**
 * Reads it all into memory. I'm assuming the csv files are relatively small. If this assumptions is wrong, 
 * we can adapt this to streaming mode. The problem is that I don't think the XLXS parser support stream reading.
 * I don't feel like writing that shit ... ya know ut i meen
 */
class CsvReader extends AbstractReader {
	
	constructor( localCsvFile, transformer, options ){
		super( transformer );
		
		this.localCsvFile = localCsvFile;
		this.options = Object.assign( {}, {
			header: false,
			trimHeaders: true,
			skipEmptyLines: false,
			startingRowNumber: 0,
			transform: this._cleanColumns,
			headerRowNumber: transformer.headerRowNumber,
		}, options );

		if( !this.options.headerRowNumber ) this.options.headerRowNumber = 1;

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
			Papa.parse( self.localCsvFile, Object.assign( {}, self.options, {
				complete ( result ) {
					self.rows = self.convertToArrayOfObjects( result.data );

					const extractions = self.performExtractions( result.data );

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

	convertToArrayOfObjects( rawRows ){
		const headerRowIndex = this.options.headerRowNumber - 1;
		let headerRow = rawRows[headerRowIndex];
		const numHeaders = headerRow.length;
		const numberOfRowsToRead = _.isNumber( this.options.rowCount ) ? this.options.rowCount : rawRows.length;

		if( headerRow ){
			headerRow = headerRow.map( header => {
				return _.isString(header) ? header.trim() : header;
			});
		}
		
		const output = [];
		for( let i = this.options.headerRowNumber; i < rawRows.length; i++ ){
			const row = rawRows[i];
			const newRow = {};
			for( let h = 0; h < numHeaders; h++ ){
				const header = headerRow[h];
				newRow[header] = _.isString(row[h]) ? row[h].trim() : row[h];
			}
			output.push( newRow );
			if( output.length >= numberOfRowsToRead ) break;
		}
		return output;
	}
	
}

export default CsvReader;