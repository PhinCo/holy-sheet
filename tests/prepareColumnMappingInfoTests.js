import holysheet from '../index';
import basicCsvTransformer from './test-transformers/basic.js';
import { assert } from 'chai';

describe( 'prepareColumnMappingInfo', function(){
	
	function _assertOutput( result ){
		const [stringResult, dateResult, integerResult, floatResult, booleanResult, enumResult] = result.suggestions;

		assert.equal( stringResult.name, 'String' );
		assert.equal( stringResult.description, 'tis but a string' );
		assert.lengthOf( stringResult.possibleInputFileColumns, 6 );

		// Only assert all of these once
		assert.isTrue( stringResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( stringResult.possibleInputFileColumns[0].inputColumnName, 'string' );
		assert.deepEqual( stringResult.possibleInputFileColumns[0].exampleData, ['one, one', 'two, two', 'three, three'] );

		assert.equal( stringResult.possibleInputFileColumns[1].inputColumnName, 'integer' );
		assert.isFalse( stringResult.possibleInputFileColumns[1].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[1].exampleData, ['1', '2', '3'] );

		assert.equal( stringResult.possibleInputFileColumns[2].inputColumnName, 'enum' );
		assert.isFalse( stringResult.possibleInputFileColumns[2].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[2].exampleData, ['cats,dogs,pandas', null, 'dogs; pandas ; cats'] );
		
		assert.equal( stringResult.possibleInputFileColumns[3].inputColumnName, 'boolean' );
		assert.isFalse( stringResult.possibleInputFileColumns[3].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[3].exampleData, ['TRUE', 'TRUE', 'FALSE'] );

		assert.equal( stringResult.possibleInputFileColumns[4].inputColumnName, 'float' );
		assert.isFalse( stringResult.possibleInputFileColumns[4].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[4].exampleData, ['1.1', '2.2', '3.3'] );

		assert.equal( stringResult.possibleInputFileColumns[5].inputColumnName, 'date' );
		assert.isFalse( stringResult.possibleInputFileColumns[5].isLikelyMatch );
		assert.deepEqual( stringResult.possibleInputFileColumns[5].exampleData, ['1/1/18', '1/2/18', '1/3/18'] );


		
		assert.equal( dateResult.name, 'Date' );
		assert.lengthOf( dateResult.possibleInputFileColumns, 6 );
		assert.isTrue( dateResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( dateResult.possibleInputFileColumns[0].inputColumnName, 'date' );

		assert.equal( integerResult.name, 'Integer' );
		assert.lengthOf( integerResult.possibleInputFileColumns, 6 );
		assert.isTrue( integerResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( integerResult.possibleInputFileColumns[0].inputColumnName, 'integer' );

		assert.equal( floatResult.name, 'Float' );
		assert.lengthOf( floatResult.possibleInputFileColumns, 6 );
		assert.isTrue( floatResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( floatResult.possibleInputFileColumns[0].inputColumnName, 'float' );

		assert.equal( booleanResult.name, 'Boolean' );
		assert.lengthOf( booleanResult.possibleInputFileColumns, 6 );
		assert.isTrue( booleanResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( booleanResult.possibleInputFileColumns[0].inputColumnName, 'boolean' );

		assert.equal( enumResult.name, 'Enum' );
		assert.lengthOf( enumResult.possibleInputFileColumns, 6 );
		assert.isTrue( enumResult.possibleInputFileColumns[0].isLikelyMatch );
		assert.equal( enumResult.possibleInputFileColumns[0].inputColumnName, 'enum' );
	}

	it( 'appropriately loads a csv file and offers suggestions', async function(){
		const file = new File('./tests/test-files/basic.csv');
		const readResult = await holysheet.readFileForTransformer( file, basicCsvTransformer );
		const result = await holysheet.prepareColumnMappingInfo( readResult, { dataPreviewCount: 3 } );
		_assertOutput( result );
	});

	it( 'appropriately loads a xlsx file and offers suggestions', async function(){
		const file = new File('./tests/test-files/basic.xlsx');
		const readResult = await holysheet.readFileForTransformer( file, basicCsvTransformer );
		const result = await holysheet.prepareColumnMappingInfo(readResult, { dataPreviewCount: 3 } );
		_assertOutput( result );
	});

	it( 'uses column alliases to match the integer column', async function(){
		const file = new File('./tests/test-files/basic.xlsx');
		const readResult = await holysheet.readFileForTransformer( file, {
			columns: [
				{
					name: 'Not an obvious Match',
					aliases: ['not a match', 'integer', 'still not a match'],
					type: 'string'
				}
			]
		});

		const result = await holysheet.prepareColumnMappingInfo( readResult, { dataPreviewCount: 3 } );
		
		const firstResult = result.suggestions[0].possibleInputFileColumns[0];
		assert.equal( firstResult.inputColumnName, 'integer' );
		assert.isTrue( firstResult.isLikelyMatch );

		// nothing else should be a likely match
		const otherResults = result.suggestions[0].possibleInputFileColumns.slice(1);
		for( let result of otherResults ){
			assert.isFalse( result.isLikelyMatch );
		}
	});
	
});

