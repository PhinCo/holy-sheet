import AbstractTransformer from './AbstractTransformer';
import _ from 'lodash';

class FloatTransformer extends AbstractTransformer{

	constructor( config ){
		super( 'float', config );

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

		const floatValue = this._coerce( this.stringValue(input), this.defaultValue );
		if( floatValue === this.defaultValue ) return floatValue;

		if( this.minValue !== null && floatValue < this.minValue ) return this.minValue;
		if( this.maxValue !== null && floatValue > this.maxValue ) return this.maxValue;

		return floatValue;
	}

	_coerce( input, defaultValue ){
		try{
			const intValue = parseFloat( input );
			if( isNaN(intValue) ) return defaultValue;
			if( !isFinite(intValue) ) return defaultValue;
			return intValue;
		}catch( e ){
			return defaultValue;
		}
	}

}

export default FloatTransformer;
