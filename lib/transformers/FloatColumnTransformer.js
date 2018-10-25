import AbstractColumnTransformer from './AbstractColumnTransformer';
import _ from 'lodash';

class FloatColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig, sourceColumnName ){
		super( 'float', columnConfig.columnName, sourceColumnName );
		
		/**
		 * The value returned when there is a parse error or no value is provided
		 */
		this.defaultValue = _.has( columnConfig, 'defaultValue' ) ? columnConfig.defaultValue : null;

		/**
		 * Minimum allowed value, exceeding values will be replaced with defaultValue.
		 */
		this.minValue = _.has( columnConfig, 'minValue' ) ? columnConfig.minValue : null;

		/**
		 * Maximum allowed value, exceeding values will be replaced with defaultValue.
		 */
		this.maxValue = _.has( columnConfig, 'maxValue' ) ? columnConfig.maxValue : null;
	}

	transform( input ){
		if( this._looksEmpty( input ) ){
			return this.defaultValue;
		}

		const floatValue = this._coerce( input, this.defaultValue );
		if( floatValue === this.defaultValue ) return floatValue;

		if( this.minValue !== null && floatValue < this.minValue ) return this.minValue;
		if( this.maxValue !== null && floatValue > this.maxValue ) return this.maxValue;

		return floatValue;
	}

	_looksEmpty( input ){
		if( !input ) return true;

		const stringValue = String( input );
		if( stringValue.trim().length === 0 ) return true;
		return false;
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

export default FloatColumnTransformer;
