import transform from '../index';
import basicCsvTransformer from './test-transformers/basic.js';
import { assert } from 'chai';
import fs from 'fs';

describe( 'prepareColumnMappingInfo', function(){
	
	function _assertOutput( results ){
		const [stringResult, dateResult, integerResult, floatResult, booleanResult, enumResult] = results;

		assert.equal( stringResult.columnName, 'String' );
		assert.equal( stringResult.description, 'tis but a string' );
		assert.lengthOf( stringResult.possibleInputFileColumns, 6 );

		// Only assert all of these once
		assert.isTrue( stringResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( stringResult.possibleInputFileColumns[0].inputColumnName, 'string' );
		assert.deepEqual( stringResult.possibleInputFileColumns[0].exampleData, ['one, one', 'two, two', 'three, three', 'four, four', 'five, five', 'six, six'] );

		assert.equal( stringResult.possibleInputFileColumns[1].inputColumnName, 'integer' );
		assert.isFalse( stringResult.possibleInputFileColumns[1].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[1].exampleData, ['1', '2', '3', '4', '5', '6'] );

		assert.equal( stringResult.possibleInputFileColumns[2].inputColumnName, 'enum' );
		assert.isFalse( stringResult.possibleInputFileColumns[2].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[2].exampleData, ['cats,dogs,pandas', null, 'dogs; pandas ; cats', 'dogs, pandas', 'dogs , pandas ; cats', 'cats'] );
		
		assert.equal( stringResult.possibleInputFileColumns[3].inputColumnName, 'boolean' );
		assert.isFalse( stringResult.possibleInputFileColumns[3].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[3].exampleData, ['TRUE', 'TRUE', 'FALSE', '0', '1', 'TRUE'] );

		assert.equal( stringResult.possibleInputFileColumns[4].inputColumnName, 'float' );
		assert.isFalse( stringResult.possibleInputFileColumns[4].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[4].exampleData, ['1.1', '2.2', '3.3', '4.4', '5.5', '6.6'] );

		assert.equal( stringResult.possibleInputFileColumns[5].inputColumnName, 'date' );
		assert.isFalse( stringResult.possibleInputFileColumns[5].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[5].exampleData, ['1/1/18', '1/2/18', '1/3/18', '1/4/18', '1/5/18', '1/6/18'] );


		
		assert.equal( dateResult.columnName, 'Date' );
		assert.lengthOf( dateResult.possibleInputFileColumns, 6 );
		assert.isTrue( dateResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( dateResult.possibleInputFileColumns[0].inputColumnName, 'date' );

		assert.equal( integerResult.columnName, 'Integer' );
		assert.lengthOf( integerResult.possibleInputFileColumns, 6 );
		assert.isTrue( integerResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( integerResult.possibleInputFileColumns[0].inputColumnName, 'integer' );

		assert.equal( floatResult.columnName, 'Float' );
		assert.lengthOf( floatResult.possibleInputFileColumns, 6 );
		assert.isTrue( floatResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( floatResult.possibleInputFileColumns[0].inputColumnName, 'float' );

		assert.equal( booleanResult.columnName, 'Boolean' );
		assert.lengthOf( booleanResult.possibleInputFileColumns, 6 );
		assert.isTrue( booleanResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( booleanResult.possibleInputFileColumns[0].inputColumnName, 'boolean' );

		assert.equal( enumResult.columnName, 'Enum' );
		assert.lengthOf( enumResult.possibleInputFileColumns, 6 );
		assert.isTrue( enumResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( enumResult.possibleInputFileColumns[0].inputColumnName, 'enum' );
	}


	
	it( 'appropriately loads a csv file and offers suggestions', async function(){
		const file = new MockFile('./tests/test-files/basic.csv');
		const results = await transform.prepareColumnMappingInfo( file, basicCsvTransformer, { rowCount: 6 } );
		_assertOutput( results );
	});

	it( 'appropriately loads a xlsx file and offers suggestions', async function(){
		const file = new MockFile('./tests/test-files/basic.xlsx');
		const results = await transform.prepareColumnMappingInfo( file, basicCsvTransformer, { rowCount: 6 } );
		_assertOutput( results );
	});
	
});

class MockFile{
	constructor( filepath ){
		const path = require('path');
		this.filepath = filepath;
		this.name = path.basename( filepath );
	}
}
class MockFileReaderSync {
	readAsText( file ){
		return fs.readFileSync( file.filepath, { encoding: 'utf8' } );
	}
}

class MockFileReader {

	readAsText( file ){
		const data = fs.readFileSync( file.filepath, { encoding: 'utf8' });
		this.onload({
			target: {
				result: data
			}
		});
	}

	readAsBinaryString( file ){
		const binary = fs.readFileSync( file.filepath, { encoding: 'binary' });
		this.onload({
			target: {
				result: binary.toString()
			}
		});
	}
}

global.File = MockFile;
global.FileReaderSync = MockFileReaderSync;
global.FileReader = MockFileReader;