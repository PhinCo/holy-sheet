
const coercion = require('../lib/coercion');
const assert = require('chai').assert;
const moment = require('moment');

describe( 'coercion', function(){

	it( 'coerces date values', async function(){
		const dateString = '01/02/2018';
		const dateFormat = 'MM/DD/YYYY';
		const date = moment( dateString, 'MM/DD/YYYY' ).toDate();
		assert.equal( moment( coercion.coerceToDate( dateString ) ).format( dateFormat ), dateString );
		assert.equal( moment( coercion.coerceToDate( '2018-01-02', 'YYYY-MM-DD') ).format( dateFormat ), dateString );
		assert.equal( moment( coercion.coerceToDate( date ) ).format( dateFormat ), dateString );

		assert.equal( coercion.coerceToDate( 'aaa' ), null );
		assert.equal( coercion.coerceToDate( 'aaa', 'YYY-MM-DD', 'default' ), 'default' );
	});
	
	it( 'coerces string values', async function(){
		const date = new Date();
		assert.equal( coercion.coerceToString( 1 ), '1' );
		assert.equal( coercion.coerceToString( 1.1 ), '1.1' );
		assert.equal( coercion.coerceToString( date ), String(date) );
		assert.equal( coercion.coerceToString( NaN ), 'NaN' );
		assert.equal( coercion.coerceToString( Infinity ), 'Infinity' );

		assert.equal( coercion.coerceToString( '' ), null );
		assert.equal( coercion.coerceToString( void 0 ), null );
		assert.equal( coercion.coerceToString( null ), null );
		assert.equal( coercion.coerceToString( '', 'default' ), 'default' );
		assert.equal( coercion.coerceToString( void 0, 'default' ), 'default' );
		assert.equal( coercion.coerceToString( null, 'default' ), 'default' );
	});
	
	it( 'coerces float values', async function(){
		assert.equal( coercion.coerceToFloat( 1 ), 1 );
		assert.equal( coercion.coerceToFloat( 1.1 ), 1.1 );
		assert.equal( coercion.coerceToFloat( 1.9 ), 1.9 );
		assert.equal( coercion.coerceToFloat( '1' ), 1 );
		assert.equal( coercion.coerceToFloat( '1.1' ), 1.1 );
		assert.equal( coercion.coerceToFloat( '1.9' ), 1.9 );
		assert.equal( coercion.coerceToFloat( ' 1  ' ), 1 );
		assert.equal( coercion.coerceToFloat( ' 1.1   ' ), 1.1 );
		assert.equal( coercion.coerceToFloat( ' 1.9  ' ), 1.9 );

		assert.equal( coercion.coerceToFloat( 'a' ), 0 );
		assert.equal( coercion.coerceToFloat( 'a', 22 ), 22 );
		assert.equal( coercion.coerceToFloat( 'a', 23 ), 23 );
		assert.equal( coercion.coerceToFloat( NaN, 24 ), 24 );
		assert.equal( coercion.coerceToFloat( Infinity, 24 ), 24 );
	});
	
	it( 'coerces integer values', async function(){
		assert.equal( coercion.coerceToInteger( 1 ), 1 );
		assert.equal( coercion.coerceToInteger( 1.1 ), 1 );
		assert.equal( coercion.coerceToInteger( 1.9 ), 1 );
		assert.equal( coercion.coerceToInteger( '1' ), 1 );
		assert.equal( coercion.coerceToInteger( '1.1' ), 1 );
		assert.equal( coercion.coerceToInteger( '1.9' ), 1 );
		assert.equal( coercion.coerceToInteger( ' 1  ' ), 1 );
		assert.equal( coercion.coerceToInteger( ' 1.1   ' ), 1 );
		assert.equal( coercion.coerceToInteger( ' 1.9  ' ), 1 );
		
		assert.equal( coercion.coerceToInteger( 'a' ), 0 );
		assert.equal( coercion.coerceToInteger( 'a', 22 ), 22 );
		assert.equal( coercion.coerceToInteger( 'a', 23 ), 23 );
		assert.equal( coercion.coerceToInteger( NaN, 24 ), 24 );
		assert.equal( coercion.coerceToInteger( Infinity, 24 ), 24 );
	});
	
	it( 'coerces boolean values', async function(){
		assert.isTrue( coercion.coerceToBoolean('yes') );
		assert.isTrue( coercion.coerceToBoolean(' yes  ') );
		assert.isTrue( coercion.coerceToBoolean(' YeS  ') );
		assert.isTrue( coercion.coerceToBoolean(' trUe  ') );
		assert.isTrue( coercion.coerceToBoolean('TRUE') );
		assert.isTrue( coercion.coerceToBoolean(' 1 ') );
		assert.isTrue( coercion.coerceToBoolean( 1 ) );
		assert.isTrue( coercion.coerceToBoolean( 1.0 ) );
		assert.isTrue( coercion.coerceToBoolean( true ) );

		assert.isFalse( coercion.coerceToBoolean( null ) );
		assert.isFalse( coercion.coerceToBoolean( void 0 ) );
		assert.isFalse( coercion.coerceToBoolean( NaN ) );
		assert.isFalse( coercion.coerceToBoolean( 'false' ) );
		assert.isFalse( coercion.coerceToBoolean( '  False ' ) );
		assert.isFalse( coercion.coerceToBoolean( 'NO' ) );
		assert.isFalse( coercion.coerceToBoolean( '0' ) );
		assert.isFalse( coercion.coerceToBoolean( 0 ) );
		assert.isFalse( coercion.coerceToBoolean( false ) );
	});


});