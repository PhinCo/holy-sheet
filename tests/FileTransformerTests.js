import FileTransformer from '../lib/transformers/FileTransformer';
import { assert } from 'chai';

describe('FileTransformer', function(){

	it('performs a simple mapping', function(){

		const transformer = {
			columns: [
				{
					columnName: 'string',
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

		const fileTransformer = new FileTransformer( transformer, columnMapping );
		const output = fileTransformer.transformRows( rows );

		const first = output[0];
		assert.equal( first.string, 'one' );

		const second = output[1];
		assert.equal( second.string, 'two' );
	});

});