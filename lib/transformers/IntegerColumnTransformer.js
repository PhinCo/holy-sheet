const AbstractColumnTransformer = require('./AbstractColumnTransformer');
const _ = require('lodash');

class IntegerColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'integer', columnConfig.columnName, sourceColumnName );
		
		/**
		 * The value returned when there is a parse error or no value is provided
		 */
		this.defaultValue = _.has( columnConfig, 'defaultValue' ) ? columnConfig.defaultValue : null;
	}

	transform( input ){
		if( !input && this.allowEmpty !== true ) return this.defaultValue;
		
		try{
			const intValue = parseInt( input, 10 );
			if( isNaN(intValue) ) return this.defaultValue;
			if( !isFinite(intValue) ) return this.defaultValue;
			return intValue;
		}catch( e ){
			return this.defaultValue;
		}
	}
	
}

module.exports = IntegerColumnTransformer;