import _ from 'lodash';

async function extract( inputRows, transformer ){
	if( !transformer.extractions ) return null;

	const output = {};
	for( let extraction of transformer.extractions ){
		const cell = _normalizeCellLocation( extraction.cell );
		debugger;
	}

	return output;
}



export default {
	extract
};
