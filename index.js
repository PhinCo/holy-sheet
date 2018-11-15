
import { prepareColumnMappingInfo } from './lib/columnMatchupSuggestions';
import { transform } from './lib/transformingEngine';
import { readFileForTransformer } from './lib/readers';

export default {
	readFileForTransformer,
	prepareColumnMappingInfo,
	transform
};
