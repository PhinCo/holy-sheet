const AbstractColumnTransformer = require('./AbstractColumnTransformer');
const coercion = require('../coercion');
const moment = require('moment');

class DateColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'date', columnConfig.columnName, sourceColumnName );
	}

	transform( input ){
		const date = coercion.coerceToDate( input );
		return moment(date).format('MM-DD-YY');
	}

}

module.exports = DateColumnTransformer;