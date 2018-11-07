
import { prepareColumnMappingInfo } from './lib/columnMatchupSuggestions';
import { transform, transformRows } from './lib/transformingEngine';
import { readerForFile, readFileForTransformer } from './lib/readers';

export default {
	readerForFile,
	readFileForTransformer,
	prepareColumnMappingInfo,
	transform,
	transformRows
};
