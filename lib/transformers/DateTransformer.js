import AbstractTransformer from './AbstractTransformer';
import _ from 'lodash';
import moment from 'moment';

class DateTransformer extends AbstractTransformer{

	constructor( config ){
		super( 'date', config );

		/**
		 * This format string is used to parse the input dates. Any valid momentjs format string will work.
		 */
		this.inputFormat = _.has( config, 'inputFormat' ) ? config.inputFormat : 'MM/DD/YYYY';

		/**
		 * This format string is used to convert the parsed date to an output string. Any valid momentjs format string will work.
		 */
		this.outputFormat = _.has( config, 'outputFormat' ) ? config.outputFormat : 'MM/DD/YYYY';
	}

	transform( input ){
		let m = null;
		if( _.isString( input ) ){
			m = this._parseString( input );
		}else if( _.isDate( input ) ){
			m = moment( input );
		}else{
			return this.defaultValue;
		}

		if( !m || !m.isValid() ) return this.defaultValue;

		return m.format( this.outputFormat );
	}
	
	_parseString( inputString ){
		let m = null;
		try{
			m = moment( inputString, this.inputFormat );
		}catch( e ){
			return this.defaultValue;
		}
		return m;
	}

}

export default DateTransformer;
