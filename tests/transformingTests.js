
const transform = require('../index');
const basicCsvTransformer = require('./test-transformers/basic.js');
const assert = require('chai').assert;
const fs = require('fs');


describe( 'transforming', function(){
	
	const csvOutputPath = './tests/test-output/basicCsvTransformed.csv';
	const xslxOutputPath = './tests/test-output/basicXslxTransformed.csv';

	const columnMapping = {
		'String': 'string, string',
		'Date': 'date',
		'Integer': 'integer',
		'Float': 'float',
		'Boolean': 'boolean',
		'Enum': 'enum'
	};
	
	function _timeout( ms ){
		return new Promise( resolve => setTimeout( resolve, ms ) );
	}
	
	after( function(){
		if( fs.existsSync(csvOutputPath) ) fs.unlinkSync( csvOutputPath );
		if( fs.existsSync(xslxOutputPath) ) fs.unlinkSync( xslxOutputPath );
	});
	
	if( process.env.TRAVIS !== 'true' ){
		it( 'appropriately loads a csv file, transforms, and writes the output file', async function(){
			const inputPath = './tests/test-files/basic.csv';
			await transform.transform( inputPath, basicCsvTransformer, columnMapping, csvOutputPath );

			await _timeout( 100 ); // File was 0 bytes without the wait. TODO: investigate the writer - maybe it's not closing properly
			assert.isTrue( fs.existsSync( csvOutputPath ) );
			assert.isTrue( fs.statSync( csvOutputPath ).size > 100 );
		});

		it( 'appropriately loads a xlsx file, transforms, and writes the output file', async function(){
			const inputPath = './tests/test-files/basic.xlsx';
			await transform.transform( inputPath, basicCsvTransformer, columnMapping, xslxOutputPath );

			await _timeout( 100 ); // File was 0 bytes without the wait. TODO: investigate the writer - maybe it's not closing properly
			assert.isTrue( fs.existsSync( xslxOutputPath ) );
			assert.isTrue( fs.statSync( xslxOutputPath ).size > 100 );
		});
	}
	
});