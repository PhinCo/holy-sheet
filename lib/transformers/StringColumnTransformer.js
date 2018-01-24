const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class StringColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig ){
		super( 'string', columnConfig.columnName, columnConfig.description );
	}

	transform( input ){
		return coercion.coerceToString( input );
	}

}

module.exports = StringColumnTransformer;