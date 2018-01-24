const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class StringColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'string', columnConfig.columnName, sourceColumnName );
	}

	transform( input ){
		return coercion.coerceToString( input );
	}

}

module.exports = StringColumnTransformer;