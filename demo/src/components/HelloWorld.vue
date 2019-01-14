<template>
	<div>
		<div class="row" v-show="!file">
			<div class="col">
				<drop-zone ref="dropZone" @file-changed="_fileChanged"></drop-zone>
			</div>
		</div>

		<div class="row" v-if="extractions && !transformedRows">
			<div class="col">
				<h3>Metadata</h3>
				<table class="table">
					<tr v-for="( extraction, key ) in extractions" :key="key">
						<th>{{extraction.name}}<br/><small>{{key}}</small></th>
						<td>{{extraction.description}}</td>
						<td>{{extraction.value}}</td>
					</tr>
				</table>
			</div>
		</div>
		
		<div class="row" v-if="columnMappings && !transformedRows">
			<div class="col">
				<h3>Columns</h3>
				<table class="table">
					<tr>
						<th></th>
						<th>match to column of<br/><b-badge variant="primary">{{file.name}}</b-badge></th>
					</tr>
					<tr v-for="column in columnMappings" :key="column.name">
						<td>
							<strong>{{column.name}}</strong><br/>
							<small>{{column.description}}</small>
						</td>
						<td class="chooseColumn">
							<div class="currentSelection" v-if="columnSelections[column.name]">
								<strong>{{columnSelections[column.name].inputColumnName}}</strong><br/>
								<small>{{columnSelections[column.name].exampleData.join(', ')}}</small>
							</div>
							<div v-else>
								Not Matched
							</div>
							<b-dropdown class="columnDropdown" variant="outline-secondary" size="sm">
								<b-dropdown-item class="columnSelection" v-for="possible in column.possibleInputFileColumns" :key="column.name + '-' + possible.inputColumnName" @click="select( column, possible )">
									{{possible.inputColumnName}}<br/>
									<small>{{possible.exampleData.join(', ')}}</small>
								</b-dropdown-item>
							</b-dropdown>
						</td>
					</tr>
				</table>
				<br/>
				<b-button size="lg" variant="outline-secondary" class="mr-2" @click="startOver">Start Over</b-button>
				<b-button size="lg" variant="primary" @click="previewTransformations">Transform {{rowCount}} rows</b-button>
			</div>
		</div>

		<div class="row" v-if="transformedRows && transformedRowErrors && transformedRowErrors.length === 0">
			<div class="col">
				<data-preview :rows="transformedRows" :columnNamesInOrder="transformedOutputKeyNamesInOrder"></data-preview>
	
				<br/>

				<b-button size="lg" variant="outline-secondary" class="mr-2" @click="backToMappings">Back</b-button>
				<b-button size="lg" variant="primary" @click="upload">Upload {{rowCount}} rows</b-button>
			</div>
		</div>

		<div class="row" v-if="transformedRowErrors && transformedRowErrors.length > 0">
			<div class="col">
				<data-errors :rows="transformedRowErrors"></data-errors>

				<br/>

				<b-button size="lg" variant="outline-secondary" class="mr-2" @click="backToMappings">Back</b-button>
			</div>
		</div>

	</div>
</template>

<script>
import holysheet from '../../..'
import DropZone from './DropZone'
import DataPreview from './DataPreview'
import DataErrors from './DataErrors';

const transformer = {
	fileTypes: ['xls'],
	headerRowNumber: 10,
	skipRowsFromHeader: [1, 2, 3],
	sendUnmappedColumnsInColumnNamed: 'unmappedColumns',
	columns: [
		{
			name: 'Serial Number',
			aliases: ['DATE CODE/SERIAL#'],
			outputKeyName: 'serial_number',
			description: 'Use this field to provide helpful information',
			type: 'string',
			validate: /^\d{4}P\d*$/gi
		},
		{
			name: 'fuck you',
			aliases: ['fuck you'],
			outputKeyName: 'ph_7_mv',
			description: 'Use this field to provide helpful information',
			type: 'float',
			// validate: function( value ){
			// 	if( value < -10 || value > 10 ){
			// 		return new Error('pH 7 is out of bounds');
			// 	}
			// }
		},
		{
			name: 'pH N mv',
			aliases: ['pH 4 Buffer Value (mV)', 'pH 10 Buffer Value (mV)'],
			outputKeyName: 'ph_n_mv',
			description: 'Use this field to provide helpful information',
			type: 'float'
		},
		{
			name: 'pH Slope',
			aliases: ['Slope (calculated)'],
			outputKeyName: 'ph_slope_mv',
			description: 'Use this field to provide helpful information',
			type: 'float'
		},
		{
			name: 'ORP mV',
			aliases: ['ORP (mV) in Zobells'],
			outputKeyName: 'orp_mv',
			description: 'Use this field to provide helpful information',
			type: 'float',
			validate: function( value ){
				if( value < -100 || value > 500 ){
					return new Error('ORP mV is out of bounds');
				}
			}
		},
		{
			name: 'Temperature ( therm kOhm )',
			aliases: ['Temperature (kohm)'],
			outputKeyName: 'temp_kohm',
			description: 'Use this field to provide helpful information',
			type: 'float'
		}
	],
	extractions: [
		{
			name: 'ORP Solution mV',
			outputKeyName: 'orp_solution_mv',
			description: 'The baseline mV reading of the ORP test solution.',
			cell: {
				col: 'E',
				row: 11
			},
			regex: {
				match: /^([\d\.]*)\s.*/g,
				replace: '$1'
			},
			type: 'float'
		},
		{
			name: 'pH Solution ( 4 or 10 )',
			outputKeyName: 'ph_n',
			description: 'The baseline pH reading of the non-7 pH test solution; usually 4 or 10.',
			cell: {
				col: 'C',
				row: 10
			},
			regex: {
				match: /^pH\s(\d*)\s.*$/gi,
				replace: '$1'
			},
			type: 'float'
		}
	],
	visitRow( row, extractions ){
		row.orp_solution_mv = extractions.orp_solution_mv.value;
		row.ph_n_value = extractions.ph_n.value;
		row.sensor_manufacturer = 'ASI';
		row.manufacture_date = null;
		return row;
	}
};


export default {
  name: 'HelloWorld',
  components: {
	DropZone,
	DataPreview,
	DataErrors
  },
  data () {
		return {
			columnMappings: null,
			colmnMappingHeaders: null,
			file: null,
			columnSelections: {},
			extractions: null,
			rowCount: null,
			transformedRows: null,
			transformedRowsCount: null,
			transformedRowErrors: null
		};
  },
  methods: {
	async _fileChanged( file ){
		console.log("FILE CHANGED", file );

		this.clearSuggestions(); // in case a file was previously loaded

		this.file = file;
		if( !this.file ) return;

		// Caching the read result so i can use it later - don't want it to be reactive for performance reasons
		try {
			this.readResult = await holysheet.readFileForTransformer( this.file, transformer );
			console.log( "read result", this.readResult );
		}catch ( e ){
			console.log( "Error reading input file", e );
			this.readResult = null;
			this.file = null;
			return;
		}
		

		const { suggestions, extractions } = await holysheet.prepareColumnMappingInfo( this.readResult );

		this.columnMappings = suggestions;
		this.extractions = extractions;
		this.rowCount = this.readResult.dataRows.length;

		for( let column of this.columnMappings ){
			const candidate = column.possibleInputFileColumns[0];
			if( candidate.isLikelyMatch ) this.select( column, candidate );
		}
	},
	async previewTransformations(){
		const mappings = {};
		for( let columnName in this.columnSelections ){
			const column = this.columnSelections[columnName];
			if( column ) mappings[columnName] = column.inputColumnName;
		}

		const result = await holysheet.transform( this.readResult, mappings );
		this.transformedRows = result.transformedRows;
		this.transformedRowErrors = result.errors;
		this.transformedRowsCount = this.transformedRows.length;
		this.transformedOutputKeyNamesInOrder = result.outputKeyNamesInOrder;
		console.log("Transform result", result );
	},
	clearSuggestions () {
		this.columnMappings = null;
		this.extractions = null;
		this.colmnMappingHeaders = null;
		this.file = null;
		this.columnSelections = {};
		this.readResult = null; // let go of the in-memory file
	},
	clearMappings () {
		this.transformedRowsCount = null;
		this.transformedRows = null;
		this.transformedRowErrors = null;
	},
	select( column, columnMapping ){
		this.$set( this.columnSelections, column.name, columnMapping ); // need to use $set or reactivity doesn't work
	},
	deselect( column ){
		this.$set( this.columnSelections, column.name, null );
	},
	startOver () {
		this.$refs.dropZone.clear();
		this.file = null;
		this.clearMappings();
		this.clearSuggestions();
	},
	backToMappings () {
		this.clearMappings();
	},
	upload () {

	}
  }
}
</script>

<style scoped lang="scss">
	h3 {
		margin: 40px 0 0;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	.chooseColumn {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		.currentSelection{
			display: inline-block;
			
			small {
				font-size: 11px;
				color: #666;
			}
		}

		.columnDropdown{
			margin-left: 10px;
		}

		.columnSelection{
			margin: 0;

			small {
				font-size: 11px;
				color: #666;
			}
		}
	}

	.transformerTable {
		min-width: 70%;
	}

	.transformerTable th{
		padding: 4px 5% 4px 0;
		text-align: left;
	}

	.transformerTable td{
		padding: 4px 5% 4px 0;
		text-align: left;
	}

</style>
