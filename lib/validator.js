import _ from 'lodash';

const VALID_TRANSFORMER_TYPES = ['string', 'date', 'integer', 'float', 'boolean', 'enum'];

function _throwTransformerError( message ){
	throw new Error('Transformer schema error(s): ' + message );
}

function _throwColumnError( columnSchema, message ){
	throw new Error(`Transformer schema column ${columnSchema.name} has error(s): ${message}`);
}

function validateTransformer( transformer ){
	if( !transformer ) throw new Error('transformer is required');

	if( !_.isArray(transformer.columns) ) _throwTransformerError('a transformer must have an array of column definitions');

	_.each( transformer.columns, _validateTransformerColumn );
}

function _validateTransformerColumn( transformerColumn ){
	if( !transformerColumn.name ) _throwColumnError('must have a name');
	if( VALID_TRANSFORMER_TYPES.indexOf(transformerColumn.type) === -1 ) _throwColumnError('must have a valid type');
}

function validateColumnMapping( transformer, columnMapping ){
	_.each( transformer.columns, columnTransformer => {
		if( !_.has( columnMapping, columnTransformer.name ) ) throw new Error('Column mapping error: no mapping key for transformer column -> ' + columnTransformer.name );
		const target = columnMapping[columnTransformer.name];
		if( !target ) throw new Error('Column mapping error: no mapping value for transformer column -> ' + columnTransformer.name );
	});
}

export default {
	validateColumnMapping,
	validateTransformer
};
