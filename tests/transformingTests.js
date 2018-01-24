
const transform = require("../index");
const basicCsvTransformer = require('./test-transformers/basic.js');
const assert = require('chai').assert;

describe( 'transforming', function(){
	
	const columnMapping = {
		"String": "string, string",
		"Date": "date",
		"Integer": "integer",
		"Float": "float",
		"Boolean": "boolean",
		"Enum": "enum"
	};
	
	function _assertOutput( results ){
		const [row1, row2, row3, row4, row5, row6 ] = results;

		assert.equal( row1.String, 'one, one' );
		assert.equal( row1.Date, '01-01-18' );
		assert.equal( row1.Integer, 1 );
		assert.equal( row1.Float, 1.1 );
		assert.equal( row1.Boolean, true );
		assert.equal( row1.Enum, 'cats, dogs, pandas' );
	}
	
	// TODO: move all theses test to the test for FileTransformer
	it( 'appropriately loads a csv file and offers suggestions', async function(){
		const inputPath = "./tests/test-files/basic.csv";
		const outputPath = "./tests/test-output/basicCsvTransformed.csv";
		const results = await transform.transform( inputPath, basicCsvTransformer, columnMapping, outputPath );
		_assertOutput( results ); // TODO: this should have written a file
	});

	it( 'appropriately loads a xlsx file and offers suggestions', async function(){
		const inputPath = "./tests/test-files/basic.xlsx";
		const outputPath = "./tests/test-output/basicCsvTransformed.csv";
		const results = await transform.transform( inputPath, basicCsvTransformer, columnMapping, outputPath );
		_assertOutput( results ); // TODO: this should have written a file
	});

});