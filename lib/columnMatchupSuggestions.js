// import validator from './validator';
import _ from 'lodash';
import stringSimilarity from 'string-similarity';
import readerForFile from './readers';
import validator from './validator';

/**
 * Provided a source file path and transformer. This function will load the source file and
 * read the columns. This function will return a list of columns from the source file with information
 * about each column. The data returned by this function is very useful for a column mapping UI.
 *
 * @param inputFilePath
 * @param targetTransformer
 * @param parserOptions - overrides for the csv-parse library
 */
export async function prepareColumnMappingInfo( inputFilePathOrReader, transformer ){
	if( !inputFilePathOrReader ) throw new Error( 'You must provide an inputFilePathOrReader' );
	validator.validateTransformer( transformer ); // throws if there's a problem

	const numberOfRowsToReadForColumnMatchup = 5;

	const Reader = readerForFile( inputFilePathOrReader );
	const reader = new Reader( inputFilePathOrReader, { 
		rowCount: numberOfRowsToReadForColumnMatchup, 
		headerRowNumber: transformer.headerRowNumber || 0,
		skipRowsFromHeader: transformer.skipRowsFromHeader
	});
	const rows = await reader.readEntireFile();
	
	return _matchTransformerToRows( rows, transformer );
}

function _matchTransformerToRows( rows, targetCsvSchema ){
	if( !rows || rows.length === 0 ) throw new Error('Cannot match columns up with some rows in the input file');

	const firstRow = rows[0];
	const inputColumnNames = Object.keys( firstRow );
	if( !inputColumnNames || inputColumnNames.length === 0 ) throw new Error('Cannot match columns up without a header row in the input file');

	const results = [];

	for( let n = 0; n < targetCsvSchema.columns.length; n++ ){
		results.push( _matchColumnTransformerToColumns( targetCsvSchema.columns[n], inputColumnNames, rows ) );
	}
	return results;
}

function _matchColumnTransformerToColumns( columnTransformer, inputColumnNames, rows ){
	let output = _matchColumnToInputColumns( columnTransformer, inputColumnNames, rows );

	if( !output ) throw new Error( 'unknown column transformer type: ' + columnTransformer.type );

	output.description =  columnTransformer.description;
	output.columnName = columnTransformer.columnName;
	output.transformer = columnTransformer;
	return output;
}

function _matchColumnToInputColumns( columnTransformer, inputColumnNames, rows ){
	const nameMatches = _bestMatchesByName( columnTransformer, inputColumnNames, rows );

	return {
		possibleInputFileColumns: nameMatches
	};
}

export function _bestMatchesByName( columnTransformer, inputColumnNames, rows ){
	const columnTransformerName = columnTransformer.columnName;
	const results = _.map( inputColumnNames, inputColumnName => {
		const nameSimilarity = stringSimilarity.compareTwoStrings( inputColumnName, columnTransformerName );

		return {
			inputColumnName,
			isLikelyMatch: nameSimilarity > 0.3,
			exampleData: _extractExampleData( columnTransformer, inputColumnName, rows ),
			nameSimilarity
		};
	});
	return _.sortBy( results, 'nameSimilarity' ).reverse();
}

export function _extractExampleData( columnTransformer, inputColumnName, rows ){
	return _.map( rows, inputColumnName );
}
