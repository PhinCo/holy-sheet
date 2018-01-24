const StringColumnTransformer = require('./StringColumnTransformer');
const IntegerColumnTransformer = require('./IntegerColumnTransformer');
const FloatColumnTransformer = require('./FloatColumnTransformer');
const BooleanColumnTransformer = require('./BooleanColumnTransformer');
const DateColumnTransformer = require('./DateColumnTransformer');
const EnumColumnTransformer = require('./EnumColumnTransformer');
const _ = require('lodash');
const validator = require('../validator');


class FileTransformer {
	
	constructor( transformerConfig, columnMappings ){
		validator.validateTransformer( transformerConfig ); // throws if there's a problem
		validator.validateColumnMapping( transformerConfig, columnMappings ); // throws if there's a problem
		this.transformFuncs = this.buildColumnTransformFuncs( transformerConfig.outputColumns, columnMappings );
	}
	
	transformerForColumnConfig( columnConfig, sourceColumnName ){
		if( columnConfig.type === 'string' ){
			
			return new StringColumnTransformer( columnConfig, sourceColumnName );
			
		}else if( columnConfig.type === 'integer' ){
			
			return new IntegerColumnTransformer( columnConfig, sourceColumnName );
			
		}else if( columnConfig.type === 'float' ){
			
			return new FloatColumnTransformer( columnConfig, sourceColumnName );
			
		}else if( columnConfig.type === 'boolean' ){
			
			return new BooleanColumnTransformer( columnConfig, sourceColumnName );
			
		}else if( columnConfig.type === 'date' ){
			
			return new DateColumnTransformer( columnConfig, sourceColumnName );
			
		}else if( columnConfig.type === 'enum' ){

			return new EnumColumnTransformer( columnConfig, sourceColumnName );

		}
		
		throw new Error('invalid column type: ' + columnConfig.type );
	}

	transformRows( rows ){
		return _.map( rows, row => {
			const output = {};
			_.each( this.transformFuncs, transformFunc => {
				transformFunc( row, output );
			});
			return output;
		});
	}
	
	buildColumnTransformFuncs( columnTransformersConfigs, columnMappings ){
		// instantiate and index each column transformer by its output name
		const columnTransformerConfigsByOutputColumnName = {};
		_.each( columnTransformersConfigs, columnTransformersConfig => {
			const transformer = this.transformerForColumnConfig( columnTransformersConfig );
			columnTransformerConfigsByOutputColumnName[transformer.columnName] = columnTransformersConfig;
		});
		
		// Build a set of functions for each column to be invoked for all rows
		return _.map( columnMappings, ( inputColumnName, outputColumnName ) => {
			
			const columnTransformerConfig = columnTransformerConfigsByOutputColumnName[outputColumnName];
			if( !columnTransformerConfig ) throw new Error("Column transformer config not found: " + outputColumnName );

			const transformer = this.transformerForColumnConfig( columnTransformerConfig, inputColumnName );
			if( !transformer ) throw new Error("Column transformer could not be created: " + outputColumnName );

			return function( row, output ){
				const value = row[inputColumnName];
				output[transformer.columnName] = transformer.transform( value );
			};
		});
	}
}

module.exports = FileTransformer;