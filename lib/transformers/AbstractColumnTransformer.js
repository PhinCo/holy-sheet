
class AbstractColumnTransformer {
	
	constructor( type, columnName, sourceColumnName ){
		this.columnName = columnName;
		this.type = type;
		this.sourceColumnName = sourceColumnName;
	}

	throwInvalidValueError( value ){
		throw new Error( `Invalid ${this.type} value for column '${this.sourceColumnName}': ${value}` );
	}
	
}

export default AbstractColumnTransformer;
