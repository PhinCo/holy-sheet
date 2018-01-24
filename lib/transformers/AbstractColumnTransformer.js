
class AbstractColumnTransformer {
	
	constructor( type, columnName, description ){
		this.columnName = columnName;
		this.type = type;
		this.description = description;
	}

	transform( input ){
		throw new Error("Not Implemented");
	}
	
}

module.exports = AbstractColumnTransformer;