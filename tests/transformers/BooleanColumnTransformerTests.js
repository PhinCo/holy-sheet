
const BooleanColumnTransformer = require('../../lib/transformers/BooleanColumnTransformer');
const assert = require('chai').assert;

describe( 'BooleanColumnTransformer', function(){

	it( 'works with truthy values', async function(){
		const transformer = new BooleanColumnTransformer( {}, "source" );
		assert.isTrue( transformer.transform('yes') );
		assert.isTrue( transformer.transform(' yes  ') );
		assert.isTrue( transformer.transform(' YeS  ') );
		assert.isTrue( transformer.transform(' trUe  ') );
		assert.isTrue( transformer.transform('TRUE') );
		assert.isTrue( transformer.transform(' 1 ') );
		assert.isTrue( transformer.transform( 1 ) );
		assert.isTrue( transformer.transform( 1.0 ) );
		assert.isTrue( transformer.transform( true ) );
	});
	
	it( 'works with falsey values', async function(){
		const transformer = new BooleanColumnTransformer( {}, "source" );
		assert.isFalse( transformer.transform( null ) );
		assert.isFalse( transformer.transform( void 0 ) );
		assert.isFalse( transformer.transform( NaN ) );
		assert.isFalse( transformer.transform( 'false' ) );
		assert.isFalse( transformer.transform( '  False ' ) );
		assert.isFalse( transformer.transform( 'NO' ) );
		assert.isFalse( transformer.transform( '0' ) );
		assert.isFalse( transformer.transform( 0 ) );
		assert.isFalse( transformer.transform( false ) );
	});
	
});