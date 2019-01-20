import RowPreprocessor from '../lib/readers/RowPreprocessor';
import { assert } from 'chai';
import _ from 'lodash';

function firstFullRow() {
	return {
		'__rowNumber': 0,
		'FST NM': 'John',
		'LST NM': 'Smith'
	};
}

function secondFullRow() {
	return {
		'__rowNumber': 1,
		'FST NM': 'Mary',
		'LST NM': 'Albertson'
	};
}

function partiallyBlankRow() {
	return {
		'__rowNumber': 3,
		'FST NM': null,
		'LST NM': 'Albertson'
	};
}

function blankRow() {
	return {
		'__rowNumber': 4,
		'FST NM': null,
		'LST NM': null
	};
}

function allRows() {
	return [firstFullRow(), secondFullRow(), partiallyBlankRow(), blankRow()];
}

function allRowsExceptBlankRow() {
	return [firstFullRow(), secondFullRow(), partiallyBlankRow()];
}



describe('Blank rows are handled based on the configuration setting', function(){

	it('should return all rows based on the configuration', function(){
		const ignoreBlankLines = false;

		const processedRows = new RowPreprocessor().removeRowsWithoutData( allRows(), ignoreBlankLines);
		assert.isTrue(_.isEqual(allRows(), processedRows));

	});

	it('should remove the blank row based on the configuration', function(){
		const ignoreBlankLines = true;

		const processedRows = new RowPreprocessor().removeRowsWithoutData( allRows(), ignoreBlankLines);
		assert.isTrue(_.isEqual(allRowsExceptBlankRow(), processedRows));
	});

	it('should remove the blank row even though no configuration is provided', function(){
		const ignoreBlankLines = undefined;

		const processedRows = new RowPreprocessor().removeRowsWithoutData( allRows(), ignoreBlankLines);
		assert.isTrue(_.isEqual(allRowsExceptBlankRow(), processedRows));
	});

});