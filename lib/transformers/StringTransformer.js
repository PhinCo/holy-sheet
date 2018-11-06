import AbstractTransformer from './AbstractTransformer';

class StringTransformer extends AbstractTransformer{

	constructor( config ){
		super( 'string', config );
	}

	transform( input ){
		if( this.isEmpty( input ) ) return this.defaultValue;
		return super.transform( this.stringValue( input ) );
	}

}

export default StringTransformer;
