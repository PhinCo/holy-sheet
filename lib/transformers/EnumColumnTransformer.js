const AbstractColumnTransformer = require("./AbstractColumnTransformer");
const coercion = require('../coercion');
const _ = require('lodash');

class EnumColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'enum', columnConfig.columnName, sourceColumnName );
		this.allowedValues = columnConfig.values;
		this.multiple = _.has( columnConfig, "multiple" ) ? columnConfig.multiple : false;
		this.inputDelimeter = _.has( columnConfig, "inputDelimeter" ) ? columnConfig.inputDelimeter : /\s*[;:,]\s*/gi;
		this.outputDelimeter = _.has( columnConfig, "outputDelimeter" ) ? columnConfig.outputDelimeter : ', ';
	}

	transform( input ){
		if( input === null || input === void 0 ) return null;
		
		let value = coercion.coerceToString( input );
		if( !value ) return null;
		
		value = value.trim();
		
		if( !this.multiple ){
			this.throwInvalidValueError( value );
			return value;
		}
		
		const values = value.split( this.inputDelimeter );
		_.each( values, this.validateValue.bind( this ) );
		return values.sort().join( this.outputDelimeter );
	}

	validateValue( value ){
		if( this.allowedValues.indexOf( value ) === -1 ){
			this.throwInvalidValueError( value );
		}
	}
}

module.exports = EnumColumnTransformer;