import StringTransformer from './StringTransformer';
import IntegerTransformer from './IntegerTransformer';
import FloatTransformer from './FloatTransformer';
import BooleanTransformer from './BooleanTransformer';
import DateTransformer from './DateTransformer';
import EnumTransformer from './EnumTransformer';
import _ from 'lodash';
import validator from '../validator';


class FileTransformer {
	
	constructor( transformerConfig, columnMappings ){
		validator.validateTransformer( transformerConfig ); // throws if there's a problem
		if( columnMappings ){
			validator.validateColumnMapping( transformerConfig, columnMappings ); // throws if there's a problem
			this.transformFuncs = this.buildColumnTransformFuncs( transformerConfig.columns, columnMappings );
		}
	}
	
	transformerForColumnConfig( columnConfig ){
		if( columnConfig.type === 'string' ){
			
			return new StringTransformer( columnConfig );
			
		}else if( columnConfig.type === 'integer' ){
			
			return new IntegerTransformer( columnConfig );
			
		}else if( columnConfig.type === 'float' ){
			
			return new FloatTransformer( columnConfig );
			
		}else if( columnConfig.type === 'boolean' ){
			
			return new BooleanTransformer( columnConfig );
			
		}else if( columnConfig.type === 'date' ){
			
			return new DateTransformer( columnConfig );
			
		}else if( columnConfig.type === 'enum' ){

			return new EnumTransformer( columnConfig );

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
			if( !columnTransformerConfig ) throw new Error('Column transformer config not found: ' + outputColumnName );

			const transformer = this.transformerForColumnConfig( columnTransformerConfig, inputColumnName );
			if( !transformer ) throw new Error('Column transformer could not be created: ' + outputColumnName );

			return function( row, output ){
				const value = row[inputColumnName];
				output[transformer.columnName] = transformer.transform( value );
			};
		});
	}
}

export default FileTransformer;
