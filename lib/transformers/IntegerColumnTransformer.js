const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class IntegerColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'integer', columnConfig.columnName, sourceColumnName );
	}

	transform( input ){
		return coercion.coerceToInteger( input );
	}

}

module.exports = IntegerColumnTransformer;