import AbstractColumnTransformer from './AbstractColumnTransformer';

class BooleanColumnTransformer extends AbstractColumnTransformer{
	
	constructor( columnConfig, sourceColumnName ){
		super(  'boolean', columnConfig.columnName, sourceColumnName );
	}
	
	transform( input ){
		return this._coerceValue( input );
	}
	
	_coerceValue( value ){
		if( value === true ) return true;
		if( value === false ) return false;

		value = String(value).trim().toLowerCase();
		if( value === 'yes' ) return true;
		if( value === 'true' ) return true;
		if( value === '1' ) return true;

		return false;
	}
	
}

export default BooleanColumnTransformer;
