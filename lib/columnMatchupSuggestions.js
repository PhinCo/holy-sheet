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
export async function prepareColumnMappingInfo( inputFilePathOrReader, transformer, inputOptions ){
	if( !inputFilePathOrReader ) throw new Error( 'You must provide an inputFilePathOrReader' );
	validator.validateTransformer( transformer ); // throws if there's a problem


	const options = Object.assign( {}, {
		rowCount: 5, 
		skipRowsFromHeader: transformer.skipRowsFromHeader
	}, inputOptions );
	
	if( transformer.headerRowNumber ) options.headerRowNumber = transformer.headerRowNumber;

	const Reader = readerForFile( inputFilePathOrReader );
	const reader = new Reader( inputFilePathOrReader, options );
	const result = await reader.readFile();
	
	return _matchTransformerToRows( result.rows, transformer );
}

function _matchTransformerToRows( rows, targetCsvSchema ){
	if( !rows || rows.length === 0 ) throw new Error('No rows in input file');

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
	output.name = columnTransformer.name;
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
	const columnTransformerName = columnTransformer.name;
	const results = _.map( inputColumnNames, inputColumnName => {

		let names = [columnTransformerName];
		if( columnTransformer.aliases ) names = [columnTransformerName, ...columnTransformer.aliases];

		let maxSimilarity = 0;
		for( let name of names ){
			let similarity = 0;

			if( name === inputColumnName ){
				similarity = 1.0; // perfect match
			}else{
				// for some reason a 1 char difference is still a 1.0 - don't let that happen.
				similarity = stringSimilarity.compareTwoStrings( inputColumnName, name ) * 0.9;
			}

			if( similarity > maxSimilarity ) maxSimilarity = similarity;
		}

		return {
			inputColumnName,
			isLikelyMatch: maxSimilarity > 0.3,
			exampleData: _extractExampleData( columnTransformer, inputColumnName, rows ),
			nameSimilarity: maxSimilarity
		};
	});
	return _.sortBy( results, 'nameSimilarity' ).reverse();
}

export function _extractExampleData( columnTransformer, inputColumnName, rows ){
	return _.map( rows, inputColumnName );
}
