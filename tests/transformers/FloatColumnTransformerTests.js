
const FloatColumnTransformer = require('../../lib/transformers/FloatColumnTransformer');
const assert = require('chai').assert;

describe( 'IntegerColumnTransformer', function(){

	it( 'works with default settings and integery values', async function(){
		const transformer = new FloatColumnTransformer( {}, "source" );
		
		assert.equal( transformer.transform( 1 ), 1 );
		assert.equal( transformer.transform( 1.1 ), 1.1 );
		assert.equal( transformer.transform( 1.9 ), 1.9 );
		assert.equal( transformer.transform( '1' ), 1 );
		assert.equal( transformer.transform( '1.1' ), 1.1 );
		assert.equal( transformer.transform( '1.9' ), 1.9 );
		assert.equal( transformer.transform( ' 1  ' ), 1 );
		assert.equal( transformer.transform( ' 1.1   ' ), 1.1 );
		assert.equal( transformer.transform( ' 1.9  ' ), 1.9 );
	});

	it( 'works with default settings and non-integery values', async function(){
		const transformer = new FloatColumnTransformer( {}, "source" );

		assert.isNull( transformer.transform( 'a' ) );
		assert.isNull( transformer.transform( 'a' ) );
		assert.isNull( transformer.transform( 'a' ) );
		assert.isNull( transformer.transform( NaN ) );
		assert.isNull( transformer.transform( Infinity) );
	});

	it( 'allows overriding the default value', async function(){
		const transformer = new FloatColumnTransformer( {
			defaultValue: -1.1
		}, "source" );

		assert.equal( transformer.transform( '1.0' ), 1.0 );
		assert.equal( transformer.transform( 'a' ), -1.1 );
		assert.equal( transformer.transform( NaN ), -1.1 );
		assert.equal( transformer.transform( Infinity ), -1.1 );
	});

});