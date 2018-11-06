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
			
			output[this._extractionKeyName(extraction)] = this._extractValue( extraction, dataValue );
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
		if( _.isString( cell.row ) ) cell.row = parseInt( cell.row, 10 );
		if( _.isString( cell.col ) ) cell.col = parseInt( cell.col, 10 );
		return cell;
	}
	
}

export default AbstractReader;
