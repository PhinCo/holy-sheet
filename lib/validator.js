const _ = require('lodash');

/*
const transformerColumnSchema = {
	id: '/TransformerColumn',
	type: 'object',
	properties: {
		columnName: { type: 'string' },
		description: { type: 'string' },
		type: { 
			type: 'string',
			enum: ['string', 'date', 'integer', 'float', 'boolean', 'enum']
		},
		min: { type: ['integer', 'float'] },
		max: { type: ['integer', 'float'] },
		defaultValue: { type: ['integer', 'float', 'null', 'boolean', 'string'] },
		inputFormat: { type: 'string' },
		outputFormat: { type: 'string' },
		validateMatchesRegex: { type: ['string', 'object'] },
		allowedValues: { type: 'array', items: { type: 'string' } },
		multiple: { type: 'boolean' },
		inputDelimeter: { type: 'string' },
		outputDelimeter: { type: 'string' }
	},
	required: ['columnName']
};

const transformerSchema = {
	id: '/Transformer',
	type: 'object',
	properties: {
		columns: {
			type: 'array',
			items: { 
				type: 'object',
				$ref: '/TransformerColumn'
			},
			minItems: 1
		}
	},
	required: ['columns']
};
*/

const VALID_TRANSFORMER_TYPES = ['string', 'date', 'integer', 'float', 'boolean', 'enum'];


function _throwTransformerError( message ){
	throw new Error('Transformer schema error(s): ' + message );
}

function _throwColumnError( columnSchema, message ){
	throw new Error(`Transformer schema column ${columnSchema.columnName} has error(s): ${message}`);
}

function validateTransformer( transformer ){
	if( !transformer ) throw new Error('transformer is required');

	if( !_.isArray(transformer.columns) ) _throwTransformerError('a transformer must have an array of column definitions');

	_.each( transformer.columns, _validateTransformerColumn );
}

function _validateTransformerColumn( transformerColumn ){
	if( !transformerColumn.columnName ) _throwColumnError('must have a columnName');
	if( VALID_TRANSFORMER_TYPES.indexOf(transformerColumn.type) === -1 ) _throwColumnError('must have a valid type');
}

function validateColumnMapping( transformer, columnMapping ){
	_.each( transformer.columns, columnTransformer => {
		if( !_.has( columnMapping, columnTransformer.columnName ) ) throw new Error('Column mapping error: no mapping key for transformer column -> ' + columnTransformer.columnName );
		const target = columnMapping[columnTransformer.columnName];
		if( !target ) throw new Error('Column mapping error: no mapping value for transformer column -> ' + columnTransformer.columnName );
	});
}

/*
function schemaValidate( object, schema, otherSchemas ){
	const validator = new JsonValidator();
	_.each( otherSchemas, schema => {
		validator.addSchema( schema, schema.id );
	});
	validator.addSchema( schema, schema.id );
	
	const result = validator.validate( object, schema );

	if( result.errors && result.errors.length > 0 ){
		const messages = [];
		for( let n = 0; n < result.errors.length; n++ ){
			const error = result.errors[n];
			if( error && error.stack ) messages.push( error.stack );
		}
		const error = new Error('Schema validation errors');
		error.messages = messages;
		throw error;
	}

	return true;
}
*/

export default {
	// schemaValidate,
	validateColumnMapping,
	validateTransformer
};
