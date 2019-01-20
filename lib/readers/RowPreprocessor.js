/*
	Provides utility functions for processing the rows prior to parsing and validation
 */
import _ from 'lodash';

class RowPreprocessor {

	shouldIgnoreBlankLines(ignoreBlankLines) {
		if (_.isNil(ignoreBlankLines)) return true;

		return ignoreBlankLines;
	}

	atLeastOneValueIsNotNull(row) {
		const rowWithoutRowNumber = Object.assign({}, row);
		delete rowWithoutRowNumber.__rowNumber;
		return Object.values(rowWithoutRowNumber).some(value => (value !== null));
	}

	removeRowsWithoutData(rows, ignoreBlankLines) {

		if (!this.shouldIgnoreBlankLines(ignoreBlankLines)) return rows;
		return rows.filter(row => this.atLeastOneValueIsNotNull(row));
	}

}
export default RowPreprocessor;

