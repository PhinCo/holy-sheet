
const StringColumnTransformer = require('../../lib/transformers/StringColumnTransformer');
const assert = require('chai').assert;

describe( 'StringColumnTransformer', function(){

	it( 'works with default settings', function(){
		const transformer = new StringColumnTransformer( {}, "source" );
		const date = new Date();

		assert.equal( transformer.transform( 1 ), '1' );
		assert.equal( transformer.transform( 1.1 ), '1.1' );
		assert.equal( transformer.transform( date ), String(date) );
		assert.equal( transformer.transform( NaN ), 'NaN' );
		assert.equal( transformer.transform( Infinity ), 'Infinity' );

		assert.isNull( transformer.transform( '' ) );
		assert.isNull( transformer.transform( void 0 ) );
		assert.isNull( transformer.transform( null ) );
	});

	it( 'allows overriding the default value', function(){
		const transformer = new StringColumnTransformer( {
			defaultValue: 'DEFAULT'
		}, "source" );

		assert.equal( transformer.transform( 1 ), '1' );
		
		assert.equal( transformer.transform( '' ), 'DEFAULT' );
		assert.equal( transformer.transform( void 0 ), 'DEFAULT' );
		assert.equal( transformer.transform( null ), 'DEFAULT' );
	});

	it( 'allows regex matching as a validation - non matches are converted to the default value', function(){
		const transformer = new StringColumnTransformer( {
			matchesRegex: /\(\d{3}\)\s\d{3}-\d{4}/gi,
			defaultValue: 'NO_MATCH'
		}, "source" );

		assert.equal( transformer.transform( '(999) 888-7777' ), '(999) 888-7777' );
		assert.equal( transformer.transform( 'oops' ), 'NO_MATCH' );
	});

	it( 'allows regex replacement', function(){
		const transformer = new StringColumnTransformer( {
			replacementRegex: /.*<(.*)>.*/gi,
			replacementString: '-$1-'
		}, "source" );

		assert.equal( transformer.transform( 'holy<milk>cow' ), '-milk-' );
	});

	it( 'errors when using replacementRegex without a replacementString', function(){
		const transformer = new StringColumnTransformer( {
			replacementRegex: /.*<(.*)>.*/gi
		}, "source" );
		
		assert.throws( () => {
			transformer.transform( 'holy<milk>cow' )
		}, 'Invalid string value for column \'source\': You cannot use replacementRegex without providing replacementString.' );
	});
	
});