// const JsonValidator = require('jsonschema').Validator;
const _ = require('lodash');

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


function validateTransformer( transformer ){
	if( !transformer ) throw new Error('transformer is required');

	try{
		return exports.schemaValidate( transformer, transformerSchema, [transformerColumnSchema] );
	}catch( e ) {
		throw new Error('Transformer schema error(s): ' + e.messages.join(', '));
	}
}

function validateColumnMapping( transformer, columnMapping ){
	const columnMappingSchema = {
		id: '/ColumnMapping',
		type: 'object',
		properties: {},
		additionalProperties: false
	};

	_.each( transformer.columns, columnTransformer => {
		columnMappingSchema.properties[columnTransformer.columnName] = {
			type: ['string', 'integer', 'float', 'boolean', 'date', 'object', 'null']
		};
	});
	
	try{
		return exports.schemaValidate( columnMapping, columnMappingSchema );
	}catch( e ) {
		throw new Error('Column mapping schema error(s): ' + e.messages.join(', '));
	}
}

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

export default {
	schemaValidate,
	validateColumnMapping,
	validateTransformer
};
