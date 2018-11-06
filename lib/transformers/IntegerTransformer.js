import AbstractTransformer from './AbstractTransformer';
import _ from 'lodash';

class IntegerTransformer extends AbstractTransformer{

	constructor( config ){
		super( 'integer', config );

		/**
		 * The value returned when there is a parse error or no value is provided.
		 */
		this.defaultValue = _.has( config, 'defaultValue' ) ? config.defaultValue : null;

		/**
		 * Minimum allowed value, exceeding values will be replaced with defaultValue.
		 */
		this.minValue = _.has( config, 'minValue' ) ? config.minValue : null;

		/**
		 * Maximum allowed value, exceeding values will be replaced with defaultValue.
		 */
		this.maxValue = _.has( config, 'maxValue' ) ? config.maxValue : null;
	}

	transform( input ){
		if( this.isEmpty( input ) ) return this.defaultValue;
		
		const stringValue = super.transform( input );

		const intValue = this._coerce( stringValue, this.defaultValue );
		if( intValue === this.defaultValue ) return intValue;
		
		if( this.minValue !== null && intValue < this.minValue ) return this.minValue;
		if( this.maxValue !== null && intValue > this.maxValue ) return this.maxValue;

		return intValue;
	}
	
	_coerce( input, defaultValue ){
		try{
			const intValue = parseInt( input, 10 );
			if( isNaN(intValue) ) return defaultValue;
			if( !isFinite(intValue) ) return defaultValue;
			return intValue;
		}catch( e ){
			return defaultValue;
		}
	}
	
}

export default IntegerTransformer;
