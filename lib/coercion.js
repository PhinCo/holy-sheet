
const moment = require('moment');

exports.coerceType = function( value, type, options ){
	if( type === 'string' ){
		return exports.coerceToString( value );
	}else if( type === 'integer' ){
		return exports.coerceToInteger( value, options );
	}else if( type === 'float' ){
		return exports.coerceToFloat( value, options );
	}else if( type === 'date' ){
		return exports.coerceToDate( value, options.inputFormat, options.outputFormat );
	}else if( type === 'boolean' ){
		return exports.coerceToBoolean( value, options );
	}

	throw new Error( 'Unknown coercion type: ' + type );
};

exports.coerceToString = function( value, defaultValue = null ){
	if( value === void 0 ) return defaultValue;
	if( value === null ) return defaultValue;
	value = String( value );
	if( value.length === 0 ) return defaultValue;
	return value;
};

exports.coerceToInteger = function( value, defaultValue = 0 ){
	try{
		value = parseInt( value, 10 );
		if( isNaN(value) ) return defaultValue;
		if( !isFinite(value) ) return defaultValue;
		return value;
	}catch( e ){
		return defaultValue;
	}
};

exports.coerceToFloat = function( value, defaultValue = 0.0 ){
	try{
		value = parseFloat( value );
		if( isNaN(value) ) return defaultValue;
		if( !isFinite(value) ) return defaultValue;
		return value;
	}catch( e ){
		return defaultValue;
	}
};

exports.coerceToDate = function( value, inputFormat = 'MM/DD/YYYY', defaultValue = null ){
	let m = null;
	try{
		m = inputFormat ? moment( value, inputFormat ) : moment( value );
	}catch( e ){
		return defaultValue;
	}

	if( !m.isValid() ) return defaultValue;

	return m.toDate();
};

exports.coerceToBoolean = function( value ){
	if( value === true ) return true;
	if( value === false ) return false;

	value = String(value).trim().toLowerCase();
	if( value === 'yes' ) return true;
	if( value === 'true' ) return true;
	if( value === '1' ) return true;

	return false;
};