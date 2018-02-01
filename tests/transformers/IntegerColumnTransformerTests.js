
const IntegerColumnTransformer = require('../../lib/transformers/IntegerColumnTransformer');
const assert = require('chai').assert;

describe( 'IntegerColumnTransformer', function(){

	it( 'works with default settings and integery values', async function(){
		const transformer = new IntegerColumnTransformer( {}, "source" );

		assert.equal( transformer.transform( 1 ), 1 );
		assert.equal( transformer.transform( 1.1 ), 1 );
		assert.equal( transformer.transform( 1.9 ), 1 );
		assert.equal( transformer.transform( '1' ), 1 );
		assert.equal( transformer.transform( '1.1' ), 1 );
		assert.equal( transformer.transform( '1.9' ), 1 );
		assert.equal( transformer.transform( ' 1  ' ), 1 );
		assert.equal( transformer.transform( ' 1.1   ' ), 1 );
		assert.equal( transformer.transform( ' 1.9  ' ), 1 );
	});

	it( 'works with default settings and non-integery values', async function(){
		const transformer = new IntegerColumnTransformer( {}, "source" );

		assert.isNull( transformer.transform( 'a' ) );
		// assert.isNull( transformer.transform( NaN ) );
		// assert.isNull( transformer.transform( Infinity ) );
	});
	
	it( 'allows overriding the default value', async function(){
		const transformer = new IntegerColumnTransformer( {
			defaultValue: -1
		}, "source" );

		assert.equal( transformer.transform( '1' ), 1 );
		assert.equal( transformer.transform( 'a' ), -1 );
		assert.equal( transformer.transform( NaN ), -1 );
		assert.equal( transformer.transform( Infinity ), -1 );
	});

	it( 'allows providing min and max values', async function(){
		const transformer = new IntegerColumnTransformer( {
			minValue: 5,
			maxValue: 20
		}, "source" );

		assert.equal( transformer.transform( '4' ), 5 );
		assert.equal( transformer.transform( '5' ), 5 );
		assert.equal( transformer.transform( '6' ), 6 );
		assert.equal( transformer.transform( '19' ), 19 );
		assert.equal( transformer.transform( '20' ), 20 );
		assert.equal( transformer.transform( '21' ), 20 );
	});
	
});