const EventEmitter = require('events');
const path = require('path');
const xlsx = require('xlsx');
const _ = require('lodash');

/**
 * Reads it all into memory. I'm assuming the csv files are relatively small. If this assumptions is wrong,
 * we can adapt this to streaming mode. The problem is that I don't think the XLXS parser support stream reading.
 * I don't feel like writing that shit ... ya know ut i meen
 */
class XlsxReader extends EventEmitter{

	constructor( xslxFilePath, parserOptions ){
		super();
		this.xslxFilePath = path.resolve( xslxFilePath );

		this.options = Object.assign( {}, {
			sheetName: null,
			startingRow: 1
		}, parserOptions );

		this.rows = [];
	}

	_cleanValue( value ){
		if( value === void 0 ) return null;
		return value;
	}
	
	async readEntireFile(){
		return new Promise( ( resolve, reject ) => {
			
			let workSheet = null;
			try{
				workSheet = xlsx.readFile( this.xslxFilePath, this.options );
			}catch( e ){
				return reject( e );
			}
			
			const sheets = Object.keys( workSheet.Sheets ).map( sheetName => {
				const sheet = workSheet.Sheets[sheetName];
				return {
					name: sheetName,
					rows: xlsx.utils.sheet_to_json( sheet, { header: 1 }) // raw seems to try to interpret data types in the cells
				};
			});

			const sheet = this.chooseSheetToWorkWith( sheets );
			const columnNames = _.map( _.first( sheet.rows ), columnName => {
				return String(columnName).trim();
			});
			
			const outputRows = [];
			for( let n = 1; n < sheet.rows.length; n++ ){
				const rawRow = sheet.rows[n];
				const newRow = {};
				_.each( columnNames, ( columnName, index ) => {
					newRow[columnName] = this._cleanValue( rawRow[index] );
				});
				outputRows.push( newRow );
			}
			
			resolve( outputRows );
		});
	}
	
	chooseSheetToWorkWith( sheets ){
		let sheet = null;
		if( this.options.sheetName ){
			sheet = sheets[this.options.sheetName];
		}else{
			sheet = _.first( sheets );
		}
		if( !sheet ) throw new Error('Counldn\'t find your sheet -> ' + Object.keys( sheets ).join(', ') );

		return sheet;
	}

}

module.exports = XlsxReader;