const EventEmitter = require('events');
const path = require('path');
const parse = require('csv-parse');
const fs = require('fs');

/**
 * Reads it all into memory. I'm assuming the csv files are relatively small. If this assumptions is wrong, 
 * we can adapt this to streaming mode. The problem is that I don't think the XLXS parser support stream reading.
 * I don't feel like writing that shit ... ya know ut i meen
 */
class CsvReader extends EventEmitter{
	
	constructor( csvFilePath, parserOptions ){
		super();
		this.csvFilePath = path.resolve( csvFilePath );

		const options = Object.assign( {}, { columns: true, delimiter: ',', ltrim: true, rtrim: true }, parserOptions );
		this.parser = parse( options );
		
		this.rows = [];
	}
	
	async readEntireFile(){
		return new Promise( ( resolve, reject ) => {
			let row = null;

			this.parser.on( 'readable', () => {
				while( row = this.parser.read() ){
					this.rows.push( row );
				}
			});

			this.parser.on( 'error', error => {
				reject( error );
			});

			this.parser.on( 'finish', () => {
				resolve( this.rows );
			});

			fs.createReadStream( this.csvFilePath ).pipe( this.parser );
		});
	}
	
}

module.exports = CsvReader;