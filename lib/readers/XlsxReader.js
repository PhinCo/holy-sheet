const xlsx = require('xlsx');
const _ = require('lodash');

/**
 * Reads it all into memory. I'm assuming the csv files are relatively small. If this assumptions is wrong,
 * we can adapt this to streaming mode. The problem is that I don't think the XLXS parser support stream reading.
 * I don't feel like writing that shit ... ya know ut i meen
 */
class XlsxReader {

	constructor( localXslxFile, parserOptions ){
		this.localXslxFile = localXslxFile;

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
		const self = this;
		return new Promise( ( resolve, reject ) => {
			
			const rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer

			try{
				const reader = new FileReader();
				reader.onload = function(e) {
					var data = e.target.result;
					if( !rABS ) data = new Uint8Array( data );
					self.workbook = xlsx.read( data, { type: rABS ? 'binary' : 'array' });
					const result = self.processSheet();
					resolve( result );
				};
				if( rABS ) reader.readAsBinaryString( this.localXslxFile ); else reader.readAsArrayBuffer( this.localXslxFile );
			}catch( e ){
				return reject( e );
			}
		});
	}

	processSheet(){
		if( !this.workbook ) return;

		const sheets = Object.keys( this.workbook.Sheets ).map( sheetName => {
			const sheet = this.workbook.Sheets[sheetName];
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
		
		return outputRows;
	}
	
	chooseSheetToWorkWith( sheets ){
		let sheet = null;
		if( this.options.sheetName ){
			sheet = sheets[this.options.sheetName];
		}else{
			sheet = _.first( sheets );
		}
		if( !sheet ) throw new Error('Couldn\'t find your sheet -> ' + Object.keys( sheets ).join(', ') );

		return sheet;
	}

}

export default XlsxReader;
