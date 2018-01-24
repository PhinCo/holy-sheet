const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');

class FloatColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig ){
		super( 'float', columnConfig.columnName, columnConfig.description );
	}

	transform( input ){
		return coercion.coerceToFloat( input );
	}

}

module.exports = FloatColumnTransformer;