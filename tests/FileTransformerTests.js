import FileTransformer from '../lib/transformers/FileTransformer';
import { assert } from 'chai';
import _ from 'lodash';

describe('FileTransformer', function(){

	it('performs a simple mapping', function(){

		const transformer = {
			columns: [
				{
					name: 'string',
					type: 'string',
					outputKeyName: 'dastring'
				}
			]
		};

		const rows = [
			{
				other: 'one'
			},
			{
				other: 'two'
			}
		];

		const columnMapping = {
			string: 'other'
		};

		const fileReadResult = {
			transformer,
			dataRows: rows
		};

		const fileTransformer = new FileTransformer( fileReadResult, columnMapping );
		const output = fileTransformer.transform();

		const first = output.transformedRows[0];
		assert.equal( first.dastring, 'one' );

		const second = output.transformedRows[1];
		assert.equal( second.dastring, 'two' );
	});

	it('returns validation errors', function(){

		const transformer = {
			columns: [
				{
					name: 'one',
					type: 'integer',
					regex: {
						validate: /.*/gi
					}
				},
				{
					name: 'two',
					type: 'float',
					regex: {
						match: /^xxx([^x]+)xxx$/gi,
						replace: '$1'
					},
					validate: /^[123467890\.]+$/gi // fuck 5's man - any number with a 5 in it will die
				},
				{
					name: 'three',
					type: 'float',
					regex: {
						match: /^x*([^x]+)x*$/gi,
						replace: '$1'
					},
					validate: function( value ){
						if( String(value).indexOf('3') !== -1 ){
							return new Error('3\'s suck dawg');
						}
					}
				},
			]
		};

		const rows = [];
		for( let n = 1; n <= 12; n++ ){
			rows.push({ input1: n, input2: `xxx${n}.${n}${n}xxx`, input3: `xxx${n}.${n}${n}xxx`, __rowNumber: n });
		}

		const columnMapping = {
			one: 'input1',
			two: 'input2',
			three: 'input3'
		};

		const fileReadResult = {
			transformer,
			dataRows: rows
		};

		const fileTransformer = new FileTransformer( fileReadResult, columnMapping );
		const output = fileTransformer.transform();

		for( let n = 1; n <= 12; n++ ){
			const row = output.transformedRows[n - 1];
			assert.equal( row.one, n );
			assert.equal( row.two, `${n}.${n}${n}` );
			assert.equal( row.three, `${n}.${n}${n}` );
		}

		const { errors } = output;

		const error3 = _.find( errors, { rowNumber: 3 });
		assert.equal( error3.error, `3's suck dawg` );
		assert.equal( error3.inputColumnName, 'input3' );
		assert.equal( error3.inputValue, 'xxx3.33xxx' );
		assert.equal( error3.key, 'three' );
		assert.equal( error3.transformedValue, 3.33 );

		const error5 = _.find( errors, { rowNumber: 5 });
		assert.equal( error5.error, `Value '5.55' does not match regex: /^[123467890\\.]+$/gi` );
		assert.equal( error5.inputColumnName, 'input2' );
		assert.equal( error5.inputValue, 'xxx5.55xxx' );
		assert.equal( error5.key, 'two' );
		assert.equal( error5.transformedValue, 5.55 );
	});
});

