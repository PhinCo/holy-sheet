import FloatTransformer from '../../lib/transformers/FloatTransformer';
import { assert } from 'chai';

describe( 'FloatColumnTransformer', function(){

	it( 'works with default settings and integery values', async function(){
		const transformer = new FloatTransformer( { name: 'float' } );
		
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
		const transformer = new FloatTransformer( { name: 'float' } );

		assert.isNull( transformer.transform( 'a' ) );
		assert.isNull( transformer.transform( 'a' ) );
		assert.isNull( transformer.transform( 'a' ) );
		assert.isNull( transformer.transform( NaN ) );
		assert.isNull( transformer.transform( Infinity) );
	});

	it( 'allows overriding the default value', async function(){
		const transformer = new FloatTransformer( {
			name: 'float',
			defaultValue: -1.1
		});

		assert.equal( transformer.transform( '1.0' ), 1.0 );
		assert.equal( transformer.transform( 'a' ), -1.1 );
		assert.equal( transformer.transform( NaN ), -1.1 );
		assert.equal( transformer.transform( Infinity ), -1.1 );
	});

	it( 'allows providing min and max values', async function(){
		const transformer = new FloatTransformer( {
			name: 'float',
			minValue: 5,
			maxValue: 20
		});

		assert.strictEqual( transformer.transform( '4' ), 5.0 );
		assert.strictEqual( transformer.transform( '4.9999999999999999999' ), 5.0 );
		assert.strictEqual( transformer.transform( '5.0000000000000000001' ), 5.0  );
		assert.strictEqual( transformer.transform( '5' ), 5.0  );

		assert.strictEqual( transformer.transform( '19.9999999999999999999' ), 19.9999999999999999999 );
		assert.strictEqual( transformer.transform( '20.0' ), 20.0 );
		assert.strictEqual( transformer.transform( '20.00000000000000000001' ), 20.0 );
	});
	
});