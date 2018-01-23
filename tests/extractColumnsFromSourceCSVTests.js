
const csvTransform = require("../index");
const basicCsvTransformer = require('./test-transformers/basic-csv.js');
const _ = require('lodash');
const assert = require('chai').assert;

describe( 'extractColumnsFromCSVForSchema', function(){
	
	it( 'works', async function(){
		const sourceCsvPath = "./tests/test-files/basic-csv.csv";
		const results = await csvTransform.extractColumnsFromCSVForSchema( sourceCsvPath, basicCsvTransformer );
		
		const [stringResult, dateResult, integerResult, floatResult, booleanResult] = results;

		assert.equal( stringResult.columnName, "String" );
		assert.lengthOf( stringResult.possibleInputFileColumns, 5 );
		
		// Only assert all of these once
		assert.isTrue( stringResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( stringResult.possibleInputFileColumns[0].inputColumnName, "string, string" );
		assert.deepEqual( stringResult.possibleInputFileColumns[0].exampleData, ["one, one", "two, two", "three, three", "four, four", "five, five", "six, six"] );

		assert.equal( stringResult.possibleInputFileColumns[1].inputColumnName, "integer" );
		assert.isFalse( stringResult.possibleInputFileColumns[1].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[1].exampleData, ['1', '2', '3', '4', '5', '6'] );

		assert.equal( stringResult.possibleInputFileColumns[2].inputColumnName, "boolean" );
		assert.isFalse( stringResult.possibleInputFileColumns[2].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[2].exampleData, ["true", "true", "false", "0", "1", "true"] );
		
		assert.equal( stringResult.possibleInputFileColumns[3].inputColumnName, "float" );
		assert.isFalse( stringResult.possibleInputFileColumns[3].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[3].exampleData, ["1.1", "2.2", "3.3", "4.4", "5.5", "6.6"] );
		
		assert.equal( stringResult.possibleInputFileColumns[4].inputColumnName, "date" );
		assert.isFalse( stringResult.possibleInputFileColumns[4].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[4].exampleData, ["1/1/18", "1/2/18", "1/3/18", "1/4/18", "1/5/18", "1/6/18"] );


		assert.equal( dateResult.columnName, "Date" );
		assert.lengthOf( dateResult.possibleInputFileColumns, 5 );
		assert.isTrue( dateResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( dateResult.possibleInputFileColumns[0].inputColumnName, "date" );
		
		assert.equal( integerResult.columnName, "Integer" );
		assert.lengthOf( integerResult.possibleInputFileColumns, 5 );
		assert.isTrue( integerResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( integerResult.possibleInputFileColumns[0].inputColumnName, "integer" );
		
		assert.equal( floatResult.columnName, "Float" );
		assert.lengthOf( floatResult.possibleInputFileColumns, 5 );
		assert.isTrue( floatResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( floatResult.possibleInputFileColumns[0].inputColumnName, "float" );
		
		assert.equal( booleanResult.columnName, "Boolean" );
		assert.lengthOf( booleanResult.possibleInputFileColumns, 5 );
		assert.isTrue( booleanResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( booleanResult.possibleInputFileColumns[0].inputColumnName, "boolean" );
	});
	
});