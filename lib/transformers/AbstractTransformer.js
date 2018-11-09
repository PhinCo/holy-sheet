import RegExWrapper from '../RegExWrapper';
import _ from 'lodash';

class AbstractTransformer {
	
	constructor( type, config ){
		this.type = type;

		this.name = config.name;
		if( !this.name ) throw new Error('name is required');

		/**
		 * The value returned when there is a parse error or no value is provided
		 */
		this.defaultValue = _.has( config, 'defaultValue' ) ? config.defaultValue : null;

		/**
		 * This object must contain a `match` RegEx or string. It can optionally contain a `replace`
		 * which will be used to transform 1 value to another
		 */
		this.regex = config.regex ? new RegExWrapper( config.regex ) : null;

		/**
		 * Provide a regex or a function to validate the final transformed value. Functions should throw errors
		 */
		if( _.isString( config.validate ) || config.validate instanceof RegExp ){
			const regexp = _.isString( config.validate ) ? new RegExp( config.validate ) : config.validate;
			this.validateFunction = function( value ){
				if( String(value).match( regexp ) === null ){
					return new Error(`Value '${value}' does not match regex: ${regexp}`);
				}
			};
		}else if( _.isFunction( config.validate ) ){
			this.validateFunction = config.validate;
		}
	}

	isEmpty( input ){
		if( input === void 0 || input === null ) return true;
		
		const stringValue = String( input );
		if( stringValue.trim().length === 0 ) return true;
		return false;
	}

	stringValue( input ){
		return new String( input ).trim();
	}

	transform( input ){
		if( this.isEmpty( input ) ) return this.defaultValue;

		input = String( input ); // force everything to a string so we can RegEx it

		if( input.length === 0 ) return this.defaultValue;
		
		if( this.regex ){
			if( !this.regex.matches( input ) ) return this.defaultValue; // TODO: report error
			
			if( this.regex.shouldReplace() ){
				input = this.regex.replace( input );
			}
		}
		
		return input;
	}

	validate ( value ) {
		if( !this.validateFunction ) return;
		// TODO: null value? required property?

		let result = null;

		if( _.isFunction( this.validateFunction ) ){
			try{
				const error = this.validateFunction( value );
				result = error ? { valid: false, error: error.message } : { valid: true };
			}catch( e ){
				// Handle unexpected errors as well. Callers should try to return errors instead to be more performant
				result = { valid: false, error: e.message };
			}
		}

		return result;
	}

	throwInvalidValueError( value ){
		throw new Error( `Invalid ${this.type} value for column '${this.name}': ${value}` );
	}
	
}

export default AbstractTransformer;
