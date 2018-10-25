import AbstractColumnTransformer from './AbstractColumnTransformer';
import _ from 'lodash';

class StringColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'string', columnConfig.columnName, sourceColumnName );
		
		/**
		 * The value returned when there is a parse error or no value is provided
		 */
		this.defaultValue = _.has( columnConfig, 'defaultValue' ) ? columnConfig.defaultValue : null;

		/**
		 * If set, this regex will be tested against the string. Failing matches will return the default value.
		 */
		this.matchesRegex = _.has( columnConfig, 'matchesRegex' ) ? columnConfig.matchesRegex : null;


		/**
		 * If set, this regex will be used to perform a regex replacement using the `replacementRegex`
		 */
		this.replacementRegex = _.has( columnConfig, 'replacementRegex' ) ? columnConfig.replacementRegex : null;
		this.replacementString = _.has( columnConfig, 'replacementString' ) ? columnConfig.replacementString : null;
	}

	/* eslint-disable no-extra-boolean-cast */
	transform( input ){
		if( input === void 0 ) return this.defaultValue;
		if( input === null ) return this.defaultValue;
		input = String( input );
		if( input.length === 0 ) return this.defaultValue;
		
		if( !!this.matchesRegex ){
			if( input.match( this.matchesRegex ) === null ) return this.defaultValue; // TODO: report error
		}
		
		if( !!this.replacementRegex ){
			if( !this.replacementString ) throw this.throwInvalidValueError('You cannot use replacementRegex without providing replacementString.');
			input = input.replace( this.replacementRegex, this.replacementString );
		}
		
		return input;
	}
	/* eslint-enable no-extra-boolean-cast */

}

export default StringColumnTransformer;
