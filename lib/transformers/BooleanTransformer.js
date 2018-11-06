import AbstractTransformer from './AbstractTransformer';

class BooleanTransformer extends AbstractTransformer{
	
	constructor( config ){
		super(  'boolean', config );
	}
	
	transform( input ){
		input = super.transform( input );
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

export default BooleanTransformer;
