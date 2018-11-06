import AbstractTransformer from './AbstractTransformer';
import _ from 'lodash';

class EnumTransformer extends AbstractTransformer{

	constructor( config ){
		super( 'enum', config );
		
		/**
		 * This array defines all the allowed values of the enum. The values are case sensitive.
		 */ 
		this.allowedValues = config.allowedValues;
		
		/**
		 * If set to TRUE, the transformer will allow parse a delimited input string, verify the enum values, and
		 * output a filtered cleaned-up set using the `outputDelimiter`.
		 */ 
		this.multiple = _.has( config, 'multiple' ) ? config.multiple : false;
		
		/**
		 * Regex or String to be used to parse the input string
		 */ 
		this.inputDelimeter = _.has( config, 'inputDelimeter' ) ? config.inputDelimeter : /\s*[;:,|]\s*/gi;

		/**
		 * If set to TRUE, invalid values will be silently excluded from the output.
		 */
		this.excludeInvalidValues = _.has( config, 'excludeInvalidValues' ) ? config.excludeInvalidValues : false;
		
		/**
		 * Output delimiter string to be used to construct the output string
		 */
		this.outputDelimeter = _.has( config, 'outputDelimeter' ) ? config.outputDelimeter : ', ';
	}

	transform( input ){
		if( input === null || input === void 0 ) return null;
		
		const value = this.stringValue( input );
		let values = value.trim().split( this.inputDelimeter );
		
		if( this.multiple === false && _.size(values) > 1 ){
			this.throwInvalidValueError( value );
			return value;
		}
		
		values = _.reduce( values, this.validateOrFilterValue.bind( this ), [] );
		if( !values ) return null;
		
		return values.sort().join( this.outputDelimeter );
	}

	validateOrFilterValue( reducer, value ){
		const isValid = this.allowedValues.indexOf( value ) !== -1;
		
		if( isValid ){
			reducer.push( value );
			return reducer;
		}
		
		if( this.excludeInvalidValues === true ){
			return reducer;
		}
		
		this.throwInvalidValueError( value );
	}
}

export default EnumTransformer;
