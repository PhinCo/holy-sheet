
const EnumColumnTransformer = require('../../lib/transformers/EnumColumnTransformer');
const assert = require('chai').assert;

describe( 'EnumColumnTransformer', function(){
	
	it( 'works with default settings', async function(){
		const transformer = new EnumColumnTransformer( {
			allowedValues: ['one']
		}, "source" );
		
		assert.equal( transformer.transform( 'one' ), 'one' );
		assert.equal( transformer.transform( '  one ' ), 'one' );
	});

	it( 'works when allowing multiples', async function(){
		const transformer = new EnumColumnTransformer( {
			allowedValues: ['one', 'two', 'three'],
			multiple: true
		}, "source" );

		const cleanedOutput = 'one, three, two'; // out of order due to alphabetical sort
		assert.equal( transformer.transform( 'one, two, three' ), cleanedOutput );
		assert.equal( transformer.transform( 'one,   two  ,   three  ' ), cleanedOutput );
		assert.equal( transformer.transform( 'one:two;three' ), cleanedOutput );
	});

	it( 'blows up if multiple are received but not allowed', async function(){
		const transformer = new EnumColumnTransformer( {
			allowedValues: ['one']
		}, "source" );
		
		assert.throws( () => {
			transformer.transform( 'one,two' );
		}, 'Invalid enum value for column \'source\': one,two' );
	});

	it( 'silently removes invalid values when asked to', async function(){
		const transformer = new EnumColumnTransformer( {
			allowedValues: ['one', 'two', 'three'],
			multiple: true,
			excludeInvalidValues: true
		}, "source" );

		const cleanedOutput = 'one, three, two'; // out of order due to alphabetical sort
		assert.equal( transformer.transform( 'one, four, three, five, two' ), cleanedOutput );
	});
	
	it( 'allows a custom input delimeter', async function(){
		const transformer = new EnumColumnTransformer( {
			allowedValues: ['one', 'two', 'three'],
			multiple: true,
			inputDelimeter: '|'
		}, "source" );

		const cleanedOutput = 'one, three, two'; // out of order due to alphabetical sort
		assert.equal( transformer.transform( 'three|two|one' ), cleanedOutput );
	});

	it( 'allows a custom output delimeter', async function(){
		const transformer = new EnumColumnTransformer( {
			allowedValues: ['one', 'two', 'three'],
			multiple: true,
			outputDelimeter: '|'
		}, "source" );

		assert.equal( transformer.transform( 'three;two;one' ), 'one|three|two' );
	});
	
});