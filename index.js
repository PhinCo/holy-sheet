
const parse = require('csv-parse');
const fs = require('fs');
const moment = require('moment');
const debug = require('debug')('csv-transform');
const schemaValidator = require('./lib/schema-validator');
const _ = require('lodash');
const stringSimilarity = require('string-similarity');


/**
 * Provided a source CSV file path and target CSV schema. This function will load the source file and 
 * read the columns. This function will return a list of columns from the source file with information 
 * about each column. The data returned by this function is very useful for a column mapping UI.
 * 
 * @param sourceCsvFilePath
 * @param targetTransformer
 * @param parserOptions - overrides for the csv-parse library
 */
exports.extractColumnsFromCSVForSchema = async function( sourceCsvFilePath, targetTransformer, parserOptions ){
	if( !sourceCsvFilePath ) throw new Error( 'You must provide a valid sourceCsvFilePath' );
	if( !targetTransformer ) throw new Error( 'You must provide a valid targetTransformer' );
	schemaValidator.validate( targetTransformer ); // throws if there's a problem

	const numberOfRowsToReadForColumnMatchup = 10;
	const options = Object.assign( {}, { columns: true, delimiter: ',', ltrim: true, rtrim: true, to: numberOfRowsToReadForColumnMatchup }, parserOptions );
	const parser = parse( options );
	
	return new Promise( function( resolve, reject ){

		const rows = [];
		let row = null;
		
		parser.on( 'readable', function(){
			while( row = parser.read() ){
				debug( 'Row from source CSV %O', row );
				rows.push( row );
			}
		});

		parser.on( 'error', reject );

		parser.on( 'finish', function(){
			resolve( _matchTransformerToRows( rows, targetTransformer ) );
		});

		fs.createReadStream( sourceCsvFilePath ).pipe( parser );
	});
	
}

function _matchTransformerToRows( rows, targetCsvSchema ){
	if( !rows || rows.length === 0 ) throw new Error("Cannot match columns up with some rows in the input file");
	
	const firstRow = rows[0];
	const inputColumnNames = Object.keys( firstRow );
	if( !inputColumnNames || inputColumnNames.length === 0 ) throw new Error("Cannot match columns up without a header row in the input file");
	
	const results = [];
	
	for( let n = 0; n < targetCsvSchema.outputColumns.length; n++ ){
		results.push( _matchColumnTransformerToColumns( targetCsvSchema.outputColumns[n], inputColumnNames, rows ) );
	}
	return results;
}

function _matchColumnTransformerToColumns( columnTransformer, inputColumnNames, rows ){
	if( columnTransformer.type === 'string' || columnTransformer.type === void 0 ){
		return _matchStringColumnToInputColumns( columnTransformer, inputColumnNames, rows );
	}else if( columnTransformer.type === 'integer' ){
		return _matchIntegerColumnToInputColumns( columnTransformer, inputColumnNames, rows );
	}else if( columnTransformer.type === 'float' ){
		return _matchIntegerFloatToInputColumns( columnTransformer, inputColumnNames, rows );
	}else if( columnTransformer.type === 'date' ){
		return _matchDateColumnToInputColumns( columnTransformer, inputColumnNames, rows );
	}else if( columnTransformer.type === 'boolean' ){
		return _matchBooleanColumnToInputColumns( columnTransformer, inputColumnNames, rows );
	}
	
	throw new Error( 'unknown column transformer type: ' + columnTransformer.type );
}

function _matchStringColumnToInputColumns( columnTransformer, inputColumnNames, rows ){
	const nameMatches = exports._bestMatchesByName( columnTransformer, inputColumnNames, rows );

	return {
		columnName: columnTransformer.columnName,
		transformer: columnTransformer,
		possibleInputFileColumns: nameMatches
	};
}

function _matchIntegerColumnToInputColumns( columnTransformer, inputColumnNames, rows ){
	const nameMatches = exports._bestMatchesByName( columnTransformer, inputColumnNames, rows );

	return {
		columnName: columnTransformer.columnName,
		transformer: columnTransformer,
		possibleInputFileColumns: nameMatches
	};
}

function _matchIntegerFloatToInputColumns( columnTransformer, inputColumnNames, rows ){
	const nameMatches = exports._bestMatchesByName( columnTransformer, inputColumnNames, rows );

	return {
		columnName: columnTransformer.columnName,
		transformer: columnTransformer,
		possibleInputFileColumns: nameMatches
	};
}

function _matchDateColumnToInputColumns( columnTransformer, inputColumnNames, rows ){
	const nameMatches = exports._bestMatchesByName( columnTransformer, inputColumnNames, rows );

	return {
		columnName: columnTransformer.columnName,
		transformer: columnTransformer,
		possibleInputFileColumns: nameMatches
	};
}

function _matchBooleanColumnToInputColumns( columnTransformer, inputColumnNames, rows ){
	const nameMatches = exports._bestMatchesByName( columnTransformer, inputColumnNames, rows );

	return {
		columnName: columnTransformer.columnName,
		transformer: columnTransformer,
		possibleInputFileColumns: nameMatches
	};
}

exports._bestMatchesByName = function( columnTransformer, inputColumnNames, rows ){
	const columnTransformerName = columnTransformer.columnName;
	const results = _.map( inputColumnNames, inputColumnName => {
		const nameSimilarity = stringSimilarity.compareTwoStrings( inputColumnName, columnTransformerName );
		
		return {
			columnTransformerName,
			inputColumnName,
			description: columnTransformer.description,
			isLikelyMatch: nameSimilarity > 0,
			exampleData: exports._extractExampleData( columnTransformer, inputColumnName, rows )
		};
	});
	return _.sortBy( results, 'similarity' );
}

exports._extractExampleData = function( columnTransformer, inputColumnName, rows ){
	return _.map( rows, inputColumnName ); // TODO: transform it? rate matches by transformability for things like booleans? 
}