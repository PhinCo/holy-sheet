
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
		assert.isNull( transformer.transform( NaN ) );
		assert.isNull( transformer.transform( Infinity ) );
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
	
});