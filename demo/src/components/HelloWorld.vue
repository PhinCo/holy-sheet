<template>
	<div>
		<div class="row">
			<div class="col">
				<div 
					ref="dropElement"
					class="dropElement"
					:class="{ dragging: dragging }"
					draggable="true"
					@dragenter.stop.prevent="_dragEnter"
					@dragleave.stop.prevent="_dragLeave"
					@dragover.stop.prevent="_dragOver"
					@drop.stop.prevent="_drop"
				>
				<b-form-file ref="fileInput" placeholder="Choose a file..." @change.stop.prevent="_fileChanged" ></b-form-file>
				</div>
			</div>
		</div>

		<div class="row" v-if="extractions">
			<div class="col">
				<h3>Extractions</h3>
				<table class="table">
					<tr v-for="( value, key ) in extractions" :key="key">
						<th>{{key}}</th>
						<td>{{value}}</td>
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
						<th>matches column from<br/><small>{{file.name}}</small></th>
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
									{{possible.nameSimilarity}}
								</b-dropdown-item>
								<b-dropdown-divider></b-dropdown-divider>
								<b-dropdown-item @click="deselect( column )">Skip Column</b-dropdown-item>
							</b-dropdown>
						</td>
					</tr>
				</table>
				<br/>
				<b-button size="lg" variant="primary" @click="next">Next</b-button>
			</div>
		</div>

		<div class="row" v-if="previewRows">
			<div class="col">
				<table class="table">
					<tr v-for="(row, index) in previewRows" :key="index">
						<td></td>
					</tr>
				</table>
			</div>
		</div>

	</div>
</template>

<script>
import holysheet from '../../..'

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
		},
		{
			name: 'pH 7 mv',
			aliases: ['pH 7 Buffer Value (mV)'],
			outputKeyName: 'ph_7_mv',
			description: 'Use this field to provide helpful information',
			type: 'float'
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
			type: 'float'
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
		row.orp_solution_mv = extractions.orp_solution_mv;
		row.ph_n_value = extractions.ph_n;
		row[`pH ${extractions.ph_n} mv`] = row['pH N mv'];
		return row;
	}
};


export default {
  name: 'HelloWorld',
  data () {
		return {
			dragging: false,
			columnMappings: null,
			file: null,
			columnSelections: {},
			extractions: null,
			previewRows: null
		};
  },
  methods: {
	_dragEnter () {
		this.dragging = true
	},
	_dragLeave () {
		this.dragging = false
	},
	_dragOver ( e ) {
		e.dataTransfer.dropEffect = 'copy';
	},
	async _drop ( e ) {
		const files = e.dataTransfer.files
		this.file = files[0]

		// Caching the read result so i can use it later - don't want it to be reactive for performance reasons
		this.readResult = await holysheet.readFileForTransformer( this.file, transformer );

		const { suggestions, extractions } = await holysheet.prepareColumnMappingInfo( this.readResult );

		this.columnMappings = suggestions;
		this.extractions = extractions;

		for( let column of this.columnMappings ){
			const candidate = column.possibleInputFileColumns[0];
			if( candidate.isLikelyMatch ) this.select( column, candidate );
		}
	},
	_fileChanged(){

	},
	select( column, columnMapping ){
		this.$set( this.columnSelections, column.name, columnMapping ); // need to use $set or reactivity doesn't work
	},
	deselect( column ){
		this.$set( this.columnSelections, column.name, null );
	},
	async next(){
		const mappings = {};
		for( let columnName in this.columnSelections ){
			const column = this.columnSelections[columnName];
			mappings[columnName] = column.inputColumnName;
		}

		console.log("mappings", mappings, this.readResult);
		this.transformedRows = await holysheet.transform( this.readResult, mappings );
		console.log( this.transformedRows );

		this.previewRows = this.transformedRows
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

	.dropElement {
		width: 400px;
		height: 100px;
		border: 4px dashed silver;
	}

	.dragging {
		border: 4px dashed red;
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
