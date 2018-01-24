const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class BooleanColumnTransformer extends AbstractColumnTransformer{
	
	constructor( columnConfig, sourceColumnName ){
		super(  'boolean', columnConfig.columnName, sourceColumnName );
	}
	
	transform( input ){
		return coercion.coerceToBoolean( input );
	}
	
}

module.exports = BooleanColumnTransformer;