import StringTransformer from './StringTransformer';
import IntegerTransformer from './IntegerTransformer';
import FloatTransformer from './FloatTransformer';
import BooleanTransformer from './BooleanTransformer';
import DateTransformer from './DateTransformer';
import EnumTransformer from './EnumTransformer';
import _ from 'lodash';
import validator from '../validator';


class FileTransformer {
	
	constructor( fileReadResult, columnMappings ){
		this.fileReadResult = fileReadResult;
		this.transformer = this.fileReadResult.transformer;

		if( columnMappings ){ // TODO: need this?
			validator.validateColumnMapping( this.transformer, columnMappings ); // throws if there's a problem
			this.transformFuncs = this.buildColumnTransformFuncs( this.transformer.columns, columnMappings );
		}
	}
	
	transformerForColumnConfig( config ){
		if( config.type === 'string' ){
			
			return new StringTransformer( config );
			
		}else if( config.type === 'integer' ){
			
			return new IntegerTransformer( config );
			
		}else if( config.type === 'float' ){
			
			return new FloatTransformer( config );
			
		}else if( config.type === 'boolean' ){
			
			return new BooleanTransformer( config );
			
		}else if( config.type === 'date' ){
			
			return new DateTransformer( config );
			
		}else if( config.type === 'enum' ){

			return new EnumTransformer( config );

		}
		
		throw new Error('invalid column type: ' + config.type );
	}

	transform(){
		const self = this;
		return _.map( self.fileReadResult.dataRows, row => {
			let output = {};
			_.each( self.transformFuncs, transformFunc => {
				transformFunc( row, output );
			});
			if( _.isFunction( self.transformer.visitRow ) ){
				output = self.transformer.visitRow( output, self.fileReadResult.extractions );
			}
			return output;
		});
	}
	
	buildColumnTransformFuncs( columnTransformersConfigs, columnMappings ){
		// instantiate and index each column transformer by its output name
		const columnTransformerConfigsByOutputColumnName = {};
		_.each( columnTransformersConfigs, columnTransformersConfig => {
			const transformer = this.transformerForColumnConfig( columnTransformersConfig );
			columnTransformerConfigsByOutputColumnName[transformer.name] = columnTransformersConfig;
		});
		
		// Build a set of functions for each column to be invoked for all rows
		return _.map( columnMappings, ( inputColumnName, outputColumnName ) => {
			
			const columnTransformerConfig = columnTransformerConfigsByOutputColumnName[outputColumnName];
			if( !columnTransformerConfig ) throw new Error('Column transformer config not found: ' + outputColumnName );

			const transformer = this.transformerForColumnConfig( columnTransformerConfig, inputColumnName );
			if( !transformer ) throw new Error('Column transformer could not be created: ' + outputColumnName );

			return function( row, output ){
				const value = row[inputColumnName];
				output[transformer.name] = transformer.transform( value );
			};
		});
	}
}

export default FileTransformer;
