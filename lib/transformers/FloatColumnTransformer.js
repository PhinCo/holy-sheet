const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class FloatColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'float', columnConfig.columnName, sourceColumnName );
	}

	transform( input ){
		return coercion.coerceToFloat( input );
	}

}

module.exports = FloatColumnTransformer;