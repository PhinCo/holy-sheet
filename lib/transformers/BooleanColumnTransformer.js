const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class BooleanColumnTransformer extends AbstractColumnTransformer{
	
	constructor( columnConfig ){
		super(  'boolean', columnConfig.columnName, columnConfig.description );
	}
	
	transform( input ){
		return coercion.coerceToBoolean( input );
	}
	
}

module.exports = BooleanColumnTransformer;