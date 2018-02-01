const AbstractColumnTransformer = require('./AbstractColumnTransformer');
const moment = require('moment');
const _ = require('lodash');

class DateColumnTransformer extends AbstractColumnTransformer{

	constructor( columnConfig = {}, sourceColumnName ){
		super( 'date', columnConfig.columnName, sourceColumnName );

		/**
		 * This format string is used to parse the input dates. Any valid momentjs format string will work.
		 */
		this.inputFormat = _.has( columnConfig, "inputFormat" ) ? columnConfig.inputFormat : 'MM/DD/YYYY';

		/**
		 * This value is returned when a date cannot be parsed using the input format
		 */
		this.defaultValue = _.has( columnConfig, "defaultValue" ) ? columnConfig.defaultValue : null;

		/**
		 * This format string is used to convert the parsed date to an output string. Any valid momentjs format string will work.
		 */
		this.outputFormat = _.has( columnConfig, "outputFormat" ) ? columnConfig.outputFormat : 'MM/DD/YYYY';
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
			m = moment( inputString, this.inputFormat )
		}catch( e ){
			return this.defaultValue;
		}
		return m;
	}

}

module.exports = DateColumnTransformer;