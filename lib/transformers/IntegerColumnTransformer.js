const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class IntegerColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig ){
		super( 'integer', columnConfig.columnName, columnConfig.description );
	}

	transform( input ){
		return coercion.coerceToInteger( input );
	}

}

module.exports = IntegerColumnTransformer;