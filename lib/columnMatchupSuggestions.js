// import validator from './validator';
import _ from 'lodash';
import stringSimilarity from 'string-similarity';

function determinePreviewCount(dataRows) {
	const arbitrarilyChosenDefault = 5;
	return Math.min(arbitrarilyChosenDefault, dataRows.length);
}

/**
 * Provided a source file path and transformer. This function will load the source file and
 * read the columns. This function will return a list of columns from the source file with information
 * about each column. The data returned by this function is very useful for a column mapping UI.
 *
 * @param fileReadResult
 * @param parserOptions - overrides for the csv-parse library
 */
export async function prepareColumnMappingInfo( fileReadResult, inputOptions ){
	if( !fileReadResult ) throw new Error( 'You must provide an fileReadResult' );

	const options = Object.assign( {}, {
		dataPreviewCount: determinePreviewCount(fileReadResult.dataRows),
		skipRowsFromHeader: null // Array of row numbers to skip after the header - indexed from the header. If your header is at row 5 and you wanted to skip row 6, you'd set this to [1]
	}, inputOptions );
	
	const matchedRows = _matchTransformerToRows( fileReadResult, options );

	return {
		suggestions: matchedRows,
		extractions: fileReadResult.extractions // Stop doing this?
	};
}

function _matchTransformerToRows( fileReadResult, options ){
	const { dataRows, transformer } = fileReadResult;

	if( !dataRows || dataRows.length === 0 ) throw new Error('No rows in input file');

	const firstRow = dataRows[0];
	const inputColumnNames = _removePrivateKeys( Object.keys( firstRow ) ); // Move to readResult - have readers return this
	if( !inputColumnNames || inputColumnNames.length === 0 ) throw new Error('Cannot match columns up without a header row in the input file');



	const results = [];

	for( let n = 0; n < transformer.columns.length; n++ ){
		results.push( _matchColumnTransformerToColumns( transformer.columns[n], inputColumnNames, dataRows, options ) );
	}

	return results;
}

function _removePrivateKeys( columnNames ){
	return columnNames.filter( columnName => columnName !== '__rowNumber' );
}

function _matchColumnTransformerToColumns( columnTransformer, inputColumnNames, dataRows, options ){
	const output = _matchColumnToInputColumns( columnTransformer, inputColumnNames, dataRows, options );

	if( !output ) throw new Error( 'unknown column transformer type: ' + columnTransformer.type );

	output.description =  columnTransformer.description;
	output.name = columnTransformer.name;
	output.transformer = columnTransformer;
	return output;
}

function _matchColumnToInputColumns( columnTransformer, inputColumnNames, dataRows, options ){
	const nameMatches = _bestMatchesByName( columnTransformer, inputColumnNames, dataRows, options );

	return {
		possibleInputFileColumns: nameMatches
	};
}

export function _bestMatchesByName( columnTransformer, inputColumnNames, dataRows, options ){
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
			exampleData: _extractExampleData( columnTransformer, inputColumnName, dataRows, options ),
			nameSimilarity: maxSimilarity
		};
	});
	return _.sortBy( results, 'nameSimilarity' ).reverse();
}

export function _extractExampleData( columnTransformer, inputColumnName, dataRows, options ){
	const exampleData = [];
	for( let n = 0; n < options.dataPreviewCount; n ++ ){
		const value = dataRows[n][inputColumnName];
		exampleData.push( value );
	}
	return exampleData;
}
