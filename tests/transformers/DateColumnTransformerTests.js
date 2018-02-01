
const DateColumnTransformer = require('../../lib/transformers/DateColumnTransformer');
const assert = require('chai').assert;
const moment = require('moment');

describe( 'DateColumnTransformer', function(){

	function _stringToDate( dateString ){
		return moment( dateString, 'MM/DD/YYYY' ).toDate();
	}
	
	it( 'works with default settings', async function(){
		const transformer = new DateColumnTransformer( {}, "source" );
		
		const dateString = '01/02/2018';
		const date = _stringToDate( dateString );

		assert.equal( transformer.transform( dateString ), dateString );
		assert.equal( transformer.transform( date ), dateString );
	});

	it( 'works with a custom input format', async function(){
		const transformer = new DateColumnTransformer( {
			inputFormat: 'YYYY-MM-DD'
		}, "source" );
		
		assert.equal( transformer.transform( '2018-01-02' ), '01/02/2018' );
	});
	
	it( 'works with a custom output format', async function(){
		const transformer = new DateColumnTransformer( {
			outputFormat: 'YYYY-MM-DD'
		}, "source" );
		
		assert.equal( transformer.transform( '01/02/2018' ), '2018-01-02' );
	});
	
	it( 'returns the default default value when passed an invalid date string', async function(){
		const transformer = new DateColumnTransformer( {}, "source" );
		assert.isNull( transformer.transform( '99/02/2018' ) );
	});

	it( 'returns the custom default value when passed an invalid date string', async function(){
		const transformer = new DateColumnTransformer( {
			defaultValue: 'INVALID_DATE'
		}, "source" );
		assert.equal( transformer.transform( '99/02/2018' ), 'INVALID_DATE' );
	});
	
});