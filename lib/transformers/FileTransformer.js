const StringColumnTransformer = require('./StringColumnTransformer');
const IntegerColumnTransformer = require('./IntegerColumnTransformer');
const FloatColumnTransformer = require('./FloatColumnTransformer');
const BooleanColumnTransformer = require('./BooleanColumnTransformer');
const DateColumnTransformer = require('./DateColumnTransformer');
const _ = require('lodash');
const validator = require('../validator');


class FileTransformer {
	
	constructor( transformerConfig, columnMappings ){
		validator.validateTransformer( transformerConfig ); // throws if there's a problem
		validator.validateColumnMapping( transformerConfig, columnMappings ); // throws if there's a problem
		this.transformFuncs = this.buildColumnTransformFuncs( transformerConfig.outputColumns, columnMappings );
	}
	
	transformerForColumnConfig( columnConfig ){
		if( columnConfig.type === 'string' ){
			
			return new StringColumnTransformer( columnConfig );
			
		}else if( columnConfig.type === 'integer' ){
			
			return new IntegerColumnTransformer( columnConfig );
			
		}else if( columnConfig.type === 'float' ){
			
			return new FloatColumnTransformer( columnConfig );
			
		}else if( columnConfig.type === 'boolean' ){
			
			return new BooleanColumnTransformer( columnConfig );
			
		}else if( columnConfig.type === 'date' ){
			
			return new DateColumnTransformer( columnConfig );
			
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
		const columnTransformersByOutputColumnName = {};
		_.each( columnTransformersConfigs, columnTransformersConfig => {
			const transformer = this.transformerForColumnConfig( columnTransformersConfig );
			columnTransformersByOutputColumnName[transformer.columnName] = transformer;
		});
		
		// Build a set of functions for each column to be invoked for all rows
		return _.map( columnMappings, ( inputColumnName, outputColumnName ) => {
			const columnTransformer = columnTransformersByOutputColumnName[outputColumnName];
			if( !columnTransformer ) throw new Error("Column transformer not found: " + name );

			return function( row, output ){
				const value = row[inputColumnName];
				output[columnTransformer.columnName] = columnTransformer.transform( value );
			};
		});
	}
}

module.exports = FileTransformer;