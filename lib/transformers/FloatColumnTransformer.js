const AbstractColumnTransformer = require('./AbstractColumnTransformer');
const _ = require('lodash');

class FloatColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'float', columnConfig.columnName, sourceColumnName );
		
		/**
		 * The value returned when there is a parse error or no value is provided
		 */
		this.defaultValue = _.has( columnConfig, 'defaultValue' ) ? columnConfig.defaultValue : null;
	}

	transform( input ){
		try{
			input = parseFloat( input );
			if( isNaN(input) ) return this.defaultValue;
			if( !isFinite(input) ) return this.defaultValue;
			return input;
		}catch( e ){
			return this.defaultValue;
		}
	}

}

module.exports = FloatColumnTransformer;