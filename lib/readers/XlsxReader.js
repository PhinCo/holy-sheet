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
			headerRowNumber: 1,
			rowCount: 10,
			skipRowsFromHeader: []
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
			try{
				const reader = new FileReader();
				reader.onload = function(e) {
					const data = e.target.result;
					self.workbook = xlsx.read( data, { type: 'binary' });
					const result = self.processSheet();
					resolve( result );
				};
				reader.readAsBinaryString( this.localXslxFile );
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
		const skipRowsFromHeader = this.options.skipRowsFromHeader;
		const numberOfRowsInSheet = sheet.rows.length;
		const headerRowNumber = this.options.headerRowNumber - 1; // Excel row 1 = array index 0
		const dataRowNumber = headerRowNumber + 1;
		const numberOfRowsToRead = _.isNumber( this.options.rowCount ) ? this.options.rowCount : numberOfRowsInSheet;
		const columnNames = this.extractColumnNamesFromHeaderRow( sheet );

		const outputRows = [];
		for( let n = dataRowNumber; n < numberOfRowsInSheet; n++ ){
			const offsetFromHeader = n - headerRowNumber;
			if( skipRowsFromHeader && skipRowsFromHeader.indexOf(offsetFromHeader) !== -1 ) continue;

			const rawRow = sheet.rows[n];
			const newRow = {};
			_.each( columnNames, ( columnName, index ) => {
				newRow[columnName] = this._cleanValue( rawRow[index] );
			});
			outputRows.push( newRow );
			if( outputRows.length === numberOfRowsToRead ) break;
		}
		
		return outputRows;
	}
	
	extractColumnNamesFromHeaderRow( sheet ){
		const headerRow = sheet.rows[this.options.headerRowNumber - 1]; // Excel row 1 = array index 0
		return _.map( headerRow, columnName => {
			return String(columnName).trim();
		});
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
