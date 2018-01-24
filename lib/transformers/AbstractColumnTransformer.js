
class AbstractColumnTransformer {
	
	constructor( type, columnName, sourceColumnName ){
		this.columnName = columnName;
		this.type = type;
		this.sourceColumnName = sourceColumnName;
	}

	transform( input ){
		throw new Error("Not Implemented");
	}

	throwInvalidValueError( value ){
		throw new Error( `Invalid ${this.type} value for column '${this.sourceColumnName}': ${value}` );
	}
	
}

module.exports = AbstractColumnTransformer;