const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class DateColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig ){
		super( 'date', columnConfig.columnName, columnConfig.description );
	}

	transform( input ){
		return coercion.coerceToString( input );
	}

}

module.exports = DateColumnTransformer;