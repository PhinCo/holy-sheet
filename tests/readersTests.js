import { assert } from 'chai';
const { resolve } = require('path');
import holysheet from '../index';

describe('XLSX reader', function(){

	it('reads with header offset and extractions', async function(){

		const transformer = {
			headerRowNumber: 5,
			columns: [
				{
					name: 'string',
					type: 'string'
				}
			],
			extractions: [
				{
					name: 'simple extraction',
					outputKeyName: 'simple',
					cell: {
						col: 'C', 
						row: 2,
					},
					type: 'string'
				},
				{
					name: 'regex extraction',
					outputKeyName: 'regex',
					cell: {
						col: 'C', 
						row: 3,
					},
					type: 'integer',
					regex: {
						match: /^.*\(([^\)]+)\)$/g,
						replace: '$1'
					},
				}
			]
		};

		const file = new File( resolve( __dirname, './test-files/extractions.xlsx') );
		const readResult = await holysheet.readFileForTransformer( file, transformer );

		const { dataRows, extractions, columnHeaders, transformer: outputTransformer } = readResult;

		assert.isOk( outputTransformer );

		assert.deepEqual( columnHeaders, ['header 1', 'header 2', 'header 3'] );

		assert.equal( extractions['simple'], 'simple extraction' );
		assert.equal( extractions['regex'], 2343 );


		assert.lengthOf( dataRows, 3 );

		const row1 = dataRows[0];
		assert.equal( row1['header 1'], 'row1:value1' );
		assert.equal( row1['header 2'], 'row1:value2' );
		assert.equal( row1['header 3'], 'row1:value3' );

		const row2 = dataRows[1];
		assert.equal( row2['header 1'], 'row2:value1' );
		assert.equal( row2['header 2'], 'row2:value2' );
		assert.equal( row2['header 3'], 'row2:value3' );

		const row3 = dataRows[2];
		assert.equal( row3['header 1'], 'row3:value1' );
		assert.equal( row3['header 2'], 'row3:value2' );
		assert.equal( row3['header 3'], 'row3:value3' );
	});

});

describe('CSV reader', function(){

	it('reads with header offset and extractions', async function(){

		const transformer = {
			headerRowNumber: 5,
			columns: [
				{
					name: 'string',
					type: 'string'
				}
			],
			extractions: [
				{
					name: 'simple extraction',
					outputKeyName: 'simple',
					cell: {
						col: 3, 
						row: 2,
					},
					type: 'string'
				},
				{
					name: 'regex extraction',
					outputKeyName: 'regex',
					cell: {
						col: 3, 
						row: 3,
					},
					type: 'integer',
					regex: {
						match: /^.*\(([^\)]+)\)$/g,
						replace: '$1'
					},
				}
			]
		};

		const file = new File( resolve( __dirname, './test-files/extractions.csv') );
		const readResult = await holysheet.readFileForTransformer( file, transformer );

		const { dataRows, extractions, columnHeaders, transformer: outputTransformer } = readResult;

		assert.isOk( outputTransformer );

		assert.deepEqual( columnHeaders, ['header 1', 'header 2', 'header 3'] );

		assert.equal( extractions['simple'], 'simple extraction' );
		assert.equal( extractions['regex'], 2343 );


		assert.lengthOf( dataRows, 3 );

		const row1 = dataRows[0];
		assert.equal( row1['header 1'], 'row1:value1' );
		assert.equal( row1['header 2'], 'row1:value2' );
		assert.equal( row1['header 3'], 'row1:value3' );

		const row2 = dataRows[1];
		assert.equal( row2['header 1'], 'row2:value1' );
		assert.equal( row2['header 2'], 'row2:value2' );
		assert.equal( row2['header 3'], 'row2:value3' );

		const row3 = dataRows[2];
		assert.equal( row3['header 1'], 'row3:value1' );
		assert.equal( row3['header 2'], 'row3:value2' );
		assert.equal( row3['header 3'], 'row3:value3' );
	});

});