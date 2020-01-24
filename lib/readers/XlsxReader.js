import xlsx from 'xlsx';
import _ from 'lodash';
import AbstractReader from './AbstractReader';
import RowPreprocessor from './RowPreprocessor';

/**
 * Reads it all into memory. I'm assuming the csv files are relatively small. If this assumptions is wrong,
 * we can adapt this to streaming mode. The problem is that I don't think the XLXS parser support stream reading.
 * I don't feel like writing that shit ... ya know ut i meen
 */
class XlsxReader extends AbstractReader{

	constructor( localXslxFile, transformer, parserOptions ){
		super( transformer );

		this.localXslxFile = localXslxFile;

		this.options = Object.assign( {}, {
			sheetName: null,
			headerRowNumber: transformer.headerRowNumber,
			skipRowsFromHeader: transformer.skipRowsFromHeader,
			rowCount: 10,
			ignoreBlankLines: transformer.ignoreBlankLines
		}, parserOptions );

		if( !this.options.headerRowNumber ) this.options.headerRowNumber = 1;
	}

	_cleanValue( value ){
		if( value === void 0 ) return null;
		return value;
	}
	
	async readFile(){
		const self = this;
		return new Promise( ( resolve, reject ) => {
			try{
				const reader = new FileReader(); // eslint-disable-line no-undef
				reader.onload = function(e) {
					const data = e.target.result;
					self.workbook = xlsx.read( data, { type: 'binary' });
					resolve( self.processSheet() );
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
				rows: xlsx.utils.sheet_to_json( sheet, { range: 0, header: 1 }) // range: 0 returns empty rows instead of skipping them, header: 1 turns of smart header and returns array of arrays
			};
		});

		const sheet = this.chooseSheetToWorkWith( sheets );
		const { dataRows, columnHeaders } = this.extractData( sheet );
		const filteredRows = new RowPreprocessor().removeRowsWithoutData(dataRows, this.options.ignoreBlankLines);
		const extractions = this.performExtractions( sheet.rows );

		return {
			dataRows: filteredRows,
			columnHeaders,
			extractions
		};
	}

	extractData( sheet ){
		const skipRowsFromHeader = this.options.skipRowsFromHeader;
		const numberOfRowsInSheet = sheet.rows.length;
		const headerRowNumber = this.options.headerRowNumber - 1; // Excel row 1 = array index 0
		const dataRowNumber = headerRowNumber + 1;
		const columnHeaders = this.extractColumnNamesFromHeaderRow( sheet );

		const dataRows = [];
		for( let n = dataRowNumber; n < numberOfRowsInSheet; n++ ){
			const offsetFromHeader = n - headerRowNumber;
			if( skipRowsFromHeader && skipRowsFromHeader.indexOf(offsetFromHeader) !== -1 ) continue;

			const rawRow = sheet.rows[n];
			const newRow = {
				__rowNumber: n + 1
			};
			_.each( columnHeaders, ( columnName, index ) => {
				newRow[columnName] = this._cleanValue( rawRow[index] );
			});
			dataRows.push( newRow );
		}

		return {
			dataRows,
			columnHeaders
		};
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

	_normalizeCellLocation( cell ){
		if( _.isString( cell.row ) ) cell.row = parseInt( cell.row, 10 );
		if( _.isString( cell.col ) ) cell.col = this._columnLetterToColumnNumber( cell.col );
		return cell;
	}
	
	_columnLetterToColumnNumber( letter ){
		let column = 0;
		let length = letter.length;
		for( let i = 0; i < length; i++ )	{
			column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
		}
		return column;
	}

}

export default XlsxReader;
