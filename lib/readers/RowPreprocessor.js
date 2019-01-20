/*
	Provides utility functions for processing the rows prior to parsing and validation
 */
import _ from 'lodash';

function shouldIgnoreBlankLines (ignoreBlankLines) {
	if (_.isNil(ignoreBlankLines)) return true;

	return ignoreBlankLines;
}

function removeRowsWithoutData( rows, ignoreBlankLines ){

	if (!shouldIgnoreBlankLines (ignoreBlankLines)) return rows;

	return rows.filter(row => Object.values(row).some(value => (value !== null)));
}


module.exports.removeRowsWithoutData = removeRowsWithoutData;

