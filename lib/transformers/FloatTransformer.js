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

		const stringValue = super.transform( input );

		const floatValue = this._coerce( stringValue, this.defaultValue );
		if( floatValue === this.defaultValue ) return floatValue;

		if( this.minValue !== null && floatValue < this.minValue ) return this.minValue;
		if( this.maxValue !== null && floatValue > this.maxValue ) return this.maxValue;

		return floatValue;
	}

	_coerce( input, defaultValue ){
		try{
			const floatValue = parseFloat( input );
			if( isNaN(floatValue) ) return defaultValue;
			if( !isFinite(floatValue) ) return defaultValue;
			return floatValue;
		}catch( e ){
			return defaultValue;
		}
	}

}

export default FloatTransformer;
