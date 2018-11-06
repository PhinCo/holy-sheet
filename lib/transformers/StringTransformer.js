import AbstractTransformer from './AbstractTransformer';

class StringTransformer extends AbstractTransformer{

	constructor( config ){
		super( 'string', config );
	}

	transform( input ){
		return super.transform( input );
	}

}

export default StringTransformer;
