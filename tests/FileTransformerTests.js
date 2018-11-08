import FileTransformer from '../lib/transformers/FileTransformer';
import { assert } from 'chai';

describe('FileTransformer', function(){

	it('performs a simple mapping', function(){

		const transformer = {
			columns: [
				{
					name: 'string',
					type: 'string'
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

		const first = output[0];
		assert.equal( first.string, 'one' );

		const second = output[1];
		assert.equal( second.string, 'two' );
	});

});