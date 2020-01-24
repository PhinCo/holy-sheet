import DateTransformer from '../../lib/transformers/DateTransformer';
import { assert } from 'chai';
import moment from 'moment';

describe( 'DateTransformer', function(){

	function _stringToDate( dateString ){
		return moment( dateString, 'MM/DD/YYYY' ).toDate();
	}
	
	it( 'works with default settings', async function(){
		const transformer = new DateTransformer( { name: 'date' } );
		
		const dateString = '01/02/2018';
		const date = _stringToDate( dateString );

		assert.equal( transformer.transform( dateString ), dateString );
		assert.equal( transformer.transform( date ), dateString );
	});

	it( 'works with a custom input format', async function(){
		const transformer = new DateTransformer( {
			name: 'date',
			inputFormat: 'YYYY-MM-DD'
		});
		
		assert.equal( transformer.transform( '2018-01-02' ), '01/02/2018' );
	});
	
	it( 'works with a custom output format', async function(){
		const transformer = new DateTransformer( {
			name: 'date',
			outputFormat: 'YYYY-MM-DD'
		});
		
		assert.equal( transformer.transform( '01/02/2018' ), '2018-01-02' );
	});
	
	it( 'returns the default default value when passed an invalid date string', async function(){
		const transformer = new DateTransformer( { name: 'date' }, 'source' );
		assert.isNull( transformer.transform( '99/02/2018' ) );
	});

	it( 'returns the custom default value when passed an invalid date string', async function(){
		const transformer = new DateTransformer( {
			name: 'date',
			defaultValue: 'INVALID_DATE'
		});
		assert.equal( transformer.transform( '99/02/2018' ), 'INVALID_DATE' );
	});

	it( 'allows regex', async function(){
		const transformer = new DateTransformer( {
			name: 'date',
			regex: {
				match: /^-*([\d/]+)-*$/gi,
				replace: '$1'
			},
			inputFormat: 'DD-MM-YYYY',
			outputFormat: 'YYYY-MM-DD'
		});

		assert.strictEqual( transformer.transform( '---12/04/1980----' ), '1980-04-12' );
	});
	
});