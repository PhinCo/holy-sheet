
const FileTransformer = require('../../lib/transformers/FileTransformer');
const basicCsvTransformer = require('../test-transformers/basic.js');
const CsvReader = require('../../lib/readers/CsvReader');
const XlsxReader = require('../../lib/readers/XlsxReader');
const assert = require('chai').assert;

describe( 'transforming', function(){

	const columnMapping = {
		'String': 'string, string',
		'Date': 'date',
		'Integer': 'integer',
		'Float': 'float',
		'Boolean': 'boolean',
		'Enum': 'enum'
	};

	function _assertOutput( results ){
		const [row1, row2, row3, row4, row5, row6 ] = results;

		assert.equal( row1.String, 'one, one' );
		assert.equal( row1.Date, '01-01-18' );
		assert.equal( row1.Integer, 1 );
		assert.equal( row1.Float, 1.1 );
		assert.equal( row1.Boolean, true );
		assert.equal( row1.Enum, 'cats, dogs, pandas' );

		assert.equal( row2.String, 'two, two' );
		assert.equal( row2.Date, '01-02-18' );
		assert.equal( row2.Integer, 2 );
		assert.equal( row2.Float, 2.2 );
		assert.equal( row2.Boolean, true );
		assert.equal( row2.Enum, null );

		assert.equal( row3.String, 'three, three' );
		assert.equal( row3.Date, '01-03-18' );
		assert.equal( row3.Integer, 3 );
		assert.equal( row3.Float, 3.3 );
		assert.equal( row3.Boolean, false );
		assert.equal( row3.Enum, 'cats, dogs, pandas' );

		assert.equal( row4.String, 'four, four' );
		assert.equal( row4.Date, '01-04-18' );
		assert.equal( row4.Integer, 4 );
		assert.equal( row4.Float, 4.4 );
		assert.equal( row4.Boolean, false );
		assert.equal( row4.Enum, 'dogs, pandas' );

		assert.equal( row5.String, 'five, five' );
		assert.equal( row5.Date, '01-05-18' );
		assert.equal( row5.Integer, 5 );
		assert.equal( row5.Float, 5.5 );
		assert.equal( row5.Boolean, true );
		assert.equal( row5.Enum, 'cats, dogs, pandas' );

		assert.equal( row6.String, 'six, six' );
		assert.equal( row6.Date, '01-06-18' );
		assert.equal( row6.Integer, 6 );
		assert.equal( row6.Float, 6.6 );
		assert.equal( row6.Boolean, true );
		assert.equal( row6.Enum, 'cats' );
	}

	it( 'appropriately loads a csv file and offers suggestions', async function(){
		const inputPath = './tests/test-files/basic.csv';

		const fileTransformer = new FileTransformer( basicCsvTransformer, columnMapping );
		const reader = new CsvReader( inputPath );
		const rows = await reader.readEntireFile();
		const results = await fileTransformer.transformRows( rows );
		_assertOutput( results );
	});

	it( 'appropriately loads a xlsx file and offers suggestions', async function(){
		const inputPath = './tests/test-files/basic.xlsx';
		const fileTransformer = new FileTransformer( basicCsvTransformer, columnMapping );
		const reader = new XlsxReader( inputPath );
		const rows = await reader.readEntireFile();
		const results = await fileTransformer.transformRows( rows );
		_assertOutput( results );
	});

});