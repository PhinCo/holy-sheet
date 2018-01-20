const JsonValidator = require('jsonschema').Validator;


const csvTransformerColumnSchema = {
	id: '/CsvTransformerColumn',
	type: 'object',
	properties: {
		columnName: { type: 'string' },
		type: { 
			type: 'string',
			enum: ['string', 'date', 'integer', 'float', 'boolean']
		}
	},
	required: ['columnName']
};

const csvTransformerSchema = {
	id: '/CsvTransformer',
	type: 'object',
	properties: {
		outputColumns: {
			type: 'array',
			items: { 
				type: 'object',
				$ref: '/CsvTransformerColumn'
			},
			minItems: 1
		}
	},
	required: ['outputColumns']
};


exports.validate = function( targetCsvSchema ){
	const validator = new JsonValidator();
	validator.addSchema( csvTransformerColumnSchema, '/CsvTransformerColumn' );
	const result = validator.validate( targetCsvSchema, csvTransformerSchema );

	if( result.errors && result.errors.length > 0 ){
		const messages = [];
		for( let n = 0; n < result.errors.length; n++ ){
			const error = result.errors[n];
			if( error && error.stack ) messages.push( error.stack );
		}
		throw new Error("Your transformer has issues: " + messages.join(', ') );
	}
	
	return true;
};