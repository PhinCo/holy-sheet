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

		if( columnMappings ){
			// Sometimes this is used to perform extractions and no columnMappings are provided
			validator.validateColumnMapping( this.transformer, columnMappings ); // throws if there's a problem
			this.transformFuncs = this.buildColumnTransformFuncs( this.transformer.columns, columnMappings );
	
			const selectedColumns = _.values( columnMappings );
			this.unmappedColumnNames = _.difference( this.fileReadResult.columnHeaders, selectedColumns );
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
		let allErrors = [];

		const transformedRows = _.map( self.fileReadResult.dataRows, row => {
			let output = {};
			let rowErrors = [];

			_.each( self.transformFuncs, transformFunc => {
				transformFunc( row, output, rowErrors );
			});

			// Included unmapped columns if requested by transformer
			if( self.transformer.sendUnmappedColumnsInColumnNamed ){
				const unmappedData = {};
				_.each( self.unmappedColumnNames, unmappedColumnName => {
					unmappedData[unmappedColumnName] = row[unmappedColumnName];
				});
				output[self.transformer.sendUnmappedColumnsInColumnNamed] = unmappedData;
			}
			
			if( _.isFunction( self.transformer.visitRow ) ){
				// Allow transformer configs to add extra keys or do manual work on each row
				output = self.transformer.visitRow( output, self.fileReadResult.extractions );
			}

			if( rowErrors.length > 0 ){
				allErrors = allErrors.concat( rowErrors );
			}

			return output;
		});

		allErrors = _.sortBy( allErrors, 'rowNumber' );
	
		const outputKeyNamesInOrder = _.map( this.transformer.columns, t => t.outputKeyName );
		if( self.transformer.sendUnmappedColumnsInColumnNamed && _.size( this.unmappedColumnNames ) ) outputKeyNamesInOrder.push( self.transformer.sendUnmappedColumnsInColumnNamed );

		return {
			transformedRows,
			errors: allErrors,
			unmappedColumnNames: this.unmappedColumnNames,
			outputKeyNamesInOrder
		};
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

			return function( row, output, errors ){
				const value = row[inputColumnName];
				const outputKeyName = transformer.outputKeyName || transformer.name;
				const transformedValue = transformer.transform( value );
				const validationResult = transformer.validate( transformedValue );

				// Add this value to the output row
				output[outputKeyName] = transformedValue;

				// If it's invalid - flag it in the errors
				if( validationResult && !validationResult.valid ){
					const validationError = {
						rowNumber: row.__rowNumber,
						key: outputKeyName,
						inputValue: value,
						transformedValue,
						inputColumnName: inputColumnName,
						error: validationResult.error
					}; 
					errors.push( validationError );
				}
			};
		});
	}
}

export default FileTransformer;
