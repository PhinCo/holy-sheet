import _ from 'lodash';
import FileTransformer from '../transformers/FileTransformer';

class AbstractReader {

	constructor( transformer ){
		this.transformer = transformer;
	}

	readFile(){
		throw new Error('must be subclassed');
	}

	/**
	 * @param {*} rows - array of arrays or objects
	 */
	performExtractions( rows ){
		if( !this.transformer.extractions ) return null;

		this.fileTransformer = new FileTransformer( this.transformer );

		const output = {};
		for( let extraction of this.transformer.extractions ){
			const cell = this._normalizeCellLocation( extraction.cell );
			if( !cell ) break;

			const dataRow = rows[cell.row - 1];
			const dataValue = dataRow[cell.col - 1];
			const extractedValue = this._extractValue( extraction, dataValue );

			output[this._extractionKeyName(extraction)] = {
				value: extractedValue,
				name: extraction.name,
				description: extraction.description
			};
		}
		return output;
	}

	_extractValue( extraction, dataValue ){
		const transformer = this.fileTransformer.transformerForColumnConfig( extraction );
		return transformer.transform( dataValue );
	}

	_extractionKeyName( extraction ){
		return extraction.outputKeyName || extraction.name;
	}

	/**
	 * Can be overriden by subclasses if they use differnt cell addressing schemes
	 * 
	 * @param {*} cell 
	 */
	_normalizeCellLocation( cell ){
		const row = _.isString( cell.row ) ? parseInt( cell.row, 10 ) : cell.row;
		const col = _.isString( cell.col ) ? parseInt( cell.col, 10 ) : cell.col;
		return {
			row,
			col
		};
	}
	
}

export default AbstractReader;
