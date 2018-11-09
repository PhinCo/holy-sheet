<template>
	<div>
		<div class="row" v-show="!file">
			<div class="col">
				<drop-zone ref="dropZone" @file-changed="_fileChanged"></drop-zone>
			</div>
		</div>

		<div class="row" v-if="extractions && !previewRows">
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
		
		<div class="row" v-if="columnMappings && !previewRows">
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
								Skipped
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
				<b-button size="lg" variant="primary" @click="previewTransformations">Next</b-button>
			</div>
		</div>

		<div class="row" v-if="previewRows && transformedRowErrors.length === 0">
			<div class="col">
				<h4>Transformed {{transformedRowsCount}} rows</h4>
				<b-table striped hover :items="transformedRows" :per-page="previewRowErrorsPageSize" :current-page="previewRowsPage"></b-table>
				<b-pagination align="center" size="md" v-model="previewRowsPage" :total-rows="transformedRows.length" :per-page="previewRowErrorsPageSize"></b-pagination>

				<br/>

				<b-button size="lg" variant="outline-secondary" class="mr-2" @click="backToMappings">Back</b-button>
				<b-button size="lg" variant="primary" @click="upload">Upload {{transformedRowsCount}} rows</b-button>
			</div>
		</div>

		<div class="row" v-if="transformedRowErrors.length > 0">
			<div class="col">
				<h4>{{transformedRowErrors.length}} errors</h4>
				<b-table striped hover :fields="transformedRowErrorsFields" :items="transformedRowErrors" :per-page="transformedRowErrorsPageSize" :current-page="currentTransformedRowErrorPage"></b-table>
				<b-pagination align="center" size="md" v-model="currentTransformedRowErrorPage" :total-rows="transformedRowErrors.length" :per-page="transformedRowErrorsPageSize"></b-pagination>
			
				<br/>

				<b-button size="lg" variant="outline-secondary" class="mr-2" @click="backToMappings">Back</b-button>
			</div>
		</div>

	</div>
</template>

<script>
import holysheet from '../../..'
import DropZone from './DropZone'

const transformer = {
	fileTypes: ['xls'],
	headerRowNumber: 10,
	skipRowsFromHeader: [1, 2, 3],
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
			name: 'pH 7 mv',
			aliases: ['pH 7 Buffer Value (mV)'],
			outputKeyName: 'ph_7_mv',
			description: 'Use this field to provide helpful information',
			type: 'float',
			validate: function( value ){
				if( value < -100 || value > 100 ){
					return new Error('pH 7 is out of bounds');
				}
			}
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
	DropZone
  },
  data () {
		return {
			columnMappings: null,
			colmnMappingHeaders: null,
			file: null,
			columnSelections: {},
			extractions: null,
			previewRows: null,
			transformedRows: null,
			transformedRowsCount: null,
			transformedRowErrors: null,
			transformedRowErrorsPageSize: 10,
			currentTransformedRowErrorPage: 1,
			transformedRowErrorsFields: [
				{
					key: 'rowNumber',
					sortable: true
				},
				{
					key: 'inputColumnName',
					sortable: true
				},
				{ 
					key: 'transformedValue',
					sortable: true
				},
				{
					key: 'error',
					sortable: true
				}
			],
			previewRowErrorsPageSize: 10,
			previewRowsPage: 1
		};
  },
  methods: {
	async _fileChanged( file ){
		console.log("FILE CHANGED", file );

		this.clearSuggestions(); // in case a file was previously loaded

		this.file = file;

		// Caching the read result so i can use it later - don't want it to be reactive for performance reasons
		this.readResult = await holysheet.readFileForTransformer( this.file, transformer );
		console.log( "read result", this.readResult );

		const { suggestions, extractions } = await holysheet.prepareColumnMappingInfo( this.readResult );

		this.columnMappings = suggestions;
		this.extractions = extractions;

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

		console.log("mappings", mappings, this.readResult);
		const result = await holysheet.transform( this.readResult, mappings );
		this.transformedRows = result.transformedRows;
		this.transformedRowErrors = result.errors;

		this.previewRows = this.transformedRows.slice( 0, 10 );

		const columnMappingHeaders = _.map( this.columnMappings, function( columnMapping ){
			return columnMapping.name;
		});

		const keysFromFirstRow = Object.keys( this.previewRows[0] );

		const extraKeys = []
		for( let key of keysFromFirstRow ){
			if( columnMappingHeaders.indexOf( key ) === -1 ){
				extraKeys.push( key );
			}
		}

		this.previewHeaders = [...columnMappingHeaders, ...extraKeys];
		this.transformedRowsCount = this.transformedRows.length;
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
		this.previewRows = null;
		this.transformedRows = null;
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
