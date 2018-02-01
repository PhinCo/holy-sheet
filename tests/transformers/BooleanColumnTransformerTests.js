
const BooleanColumnTransformer = require('../../lib/transformers/BooleanColumnTransformer');
const assert = require('chai').assert;

describe( 'BooleanColumnTransformer', function(){

	it( 'works', async function(){
		const transformer = new BooleanColumnTransformer( {}, "source" );
		assert.isTrue( transformer.transform('yes') );
		assert.isTrue( transformer.transform('TRUE') );
		assert.isTrue( transformer.transform( 1 ) );
		assert.isTrue( transformer.transform( true ) );
		
		assert.isFalse( transformer.transform( null ) );
		assert.isFalse( transformer.transform( void 0 ) );
		assert.isFalse( transformer.transform( 'false' ) );
		assert.isFalse( transformer.transform( 'NO' ) );
		assert.isFalse( transformer.transform( 0 ) );
		assert.isFalse( transformer.transform( false ) );
	});

});