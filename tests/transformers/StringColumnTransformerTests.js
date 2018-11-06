
import StringTransformer from '../../lib/transformers/StringTransformer';
import { assert } from 'chai';

describe( 'StringColumnTransformer', function(){

	it( 'works with default settings', function(){
		const transformer = new StringTransformer( { name: 'string' } );
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
		const transformer = new StringTransformer( {
			name: 'string',
			defaultValue: 'DEFAULT'
		});

		assert.equal( transformer.transform( 1 ), '1' );
		
		assert.equal( transformer.transform( '' ), 'DEFAULT' );
		assert.equal( transformer.transform( void 0 ), 'DEFAULT' );
		assert.equal( transformer.transform( null ), 'DEFAULT' );
	});

	it( 'allows regex matching as a validation - non matches are converted to the default value', function(){
		const transformer = new StringTransformer( {
			name: 'string',
			regex: {
				match: /\(\d{3}\)\s\d{3}-\d{4}/gi
			},
			defaultValue: 'NO_MATCH'
		});

		//assert.equal( transformer.transform( '(999) 888-7777' ), '(999) 888-7777' );
		assert.equal( transformer.transform( 'oops' ), 'NO_MATCH' );
	});

	it( 'allows regex replacement', function(){
		const transformer = new StringTransformer( {
			name: 'string',
			regex: {
				match: /.*<(.*)>.*/gi,
				replace: '-$1-'
			},
		});

		assert.equal( transformer.transform( 'holy<milk>cow' ), '-milk-' );
	});
	
});