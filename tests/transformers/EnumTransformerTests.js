import EnumTransformer from '../../lib/transformers/EnumTransformer';
import { assert } from 'chai';

describe( 'EnumTransformer', function(){
	
	it( 'works with default settings', async function(){
		const transformer = new EnumTransformer( {
			name: 'enum',
			allowedValues: ['one']
		} );
		
		assert.equal( transformer.transform( 'one' ), 'one' );
		assert.equal( transformer.transform( '  one ' ), 'one' );
	});

	it( 'works when allowing multiples', async function(){
		const transformer = new EnumTransformer( {
			name: 'enum',
			allowedValues: ['one', 'two', 'three'],
			multiple: true,
			outputDelimeter: ', '
		} );

		const cleanedOutput = 'one, three, two'; // out of order due to alphabetical sort
		assert.equal( transformer.transform( 'one, two, three' ), cleanedOutput );
		assert.equal( transformer.transform( 'one,   two  ,   three  ' ), cleanedOutput );
		assert.equal( transformer.transform( 'one:two;three' ), cleanedOutput );
	});

	it( 'blows up if multiple are received but not allowed', async function(){
		const transformer = new EnumTransformer( {
			name: 'enum',
			allowedValues: ['one'],
			outputDelimeter: ','
		} );
		
		assert.throws( () => {
			transformer.transform( 'one,two' );
		}, 'Invalid enum value for column \'enum\': one,two' );
	});

	it( 'silently removes invalid values when asked to', async function(){
		const transformer = new EnumTransformer( {
			name: 'enum',
			allowedValues: ['one', 'two', 'three'],
			multiple: true,
			excludeInvalidValues: true,
			outputDelimeter: ', '
		} );

		const cleanedOutput = 'one, three, two'; // out of order due to alphabetical sort
		assert.equal( transformer.transform( 'one, four, three, five, two' ), cleanedOutput );
	});
	
	it( 'allows a custom input delimeter', async function(){
		const transformer = new EnumTransformer( {
			name: 'enum',
			allowedValues: ['one', 'two', 'three'],
			multiple: true,
			inputDelimeter: '|',
			outputDelimeter: ', '
		} );

		const cleanedOutput = 'one, three, two'; // out of order due to alphabetical sort
		assert.equal( transformer.transform( 'three|two|one' ), cleanedOutput );
	});

	it( 'allows a custom output delimeter', async function(){
		const transformer = new EnumTransformer( {
			name: 'enum',
			allowedValues: ['one', 'two', 'three'],
			multiple: true,
			outputDelimeter: '|'
		} );

		assert.equal( transformer.transform( 'three;two;one' ), 'one|three|two' );
	});

	it( 'allows regex', async function(){
		const transformer = new EnumTransformer( {
			name: 'enum',
			allowedValues: ['1', '2', '3'],
			multiple: true,
			regex: {
				match: /^\+([\d,]+)\+$/gi,
				replace: '$1'
			}
		});

		assert.deepEqual( transformer.transform( '+1,2+' ), ['1', '2'] );
	});
	
});