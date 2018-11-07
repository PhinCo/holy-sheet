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

	throwInvalidValueError( value ){
		throw new Error( `Invalid ${this.type} value for column '${this.name}': ${value}` );
	}
	
}

export default AbstractTransformer;