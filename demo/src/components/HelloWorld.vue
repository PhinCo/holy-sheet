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
		
		<div class="row" v-if="columnMappings">
			<div class="col">
				<table class="table">
					<tr>
						<th>Field</th>
						<th>matches column from<br/><small>{{filename}}</small></th>
					</tr>
					<tr v-for="column in columnMappings" :key="column.columnName">
						<td>
							<strong>{{column.columnName}}</strong><br/>
							<small>{{column.description}}</small>
						</td>
						<td class="chooseColumn">
							<div class="currentSelection" v-if="columnSelections[column.columnName]">
								<strong>{{columnSelections[column.columnName].inputColumnName}}</strong><br/>
								<small>{{columnSelections[column.columnName].exampleData.join(', ')}}</small>
							</div>
							<div v-else>
								Skipped
							</div>
							<b-dropdown class="columnDropdown" variant="outline-secondary" size="sm">
								<b-dropdown-item class="columnSelection" v-for="possible in column.possibleInputFileColumns" :key="column.columnName + '-' + possible.inputColumnName" @click="select( column, possible )">
									{{possible.inputColumnName}}<br/>
									<small>{{possible.exampleData.join(', ')}}</small>
								</b-dropdown-item>
								<b-dropdown-divider></b-dropdown-divider>
								<b-dropdown-item @click="deselect( column )">Skip Column</b-dropdown-item>
							</b-dropdown>
						</td>
					</tr>
				</table>
			</div>
		</div>

	</div>
</template>

<script>
import holysheet from '../../..'

export default {
  name: 'HelloWorld',
  data () {
		return {
			dragging: false,
			columnMappings: null,
			filename: null,
			columnSelections: {}
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
		const file = files[0]
		this.filename = file.name
		const result = await holysheet.prepareColumnMappingInfo( file, {
			fileTypes: ['xls'],
			headerRowNumber: 10,
			skipRowsFromHeader: [1, 2, 3],
			columns: [
				{
					columnName: 'Serial Number',
					columnNameAliases: ['DATE CODE/SERIAL#'],
					outputKeyName: 'serial_number',
					description: 'Use this field to provide helpful information',
					type: 'string',
				},
				{
					columnName: 'pH 7 mv',
					columnNameAliases: ['pH 7 Buffer Value (mV)'],
					outputKeyName: 'ph_7_mv',
					description: 'Use this field to provide helpful information',
					type: 'float'
				},
				{
					columnName: 'pH 4 mv',
					columnNameAliases: ['pH 4 Buffer Value (mV)'],
					outputKeyName: 'ph_4_mv',
					description: 'Use this field to provide helpful information',
					type: 'float'
				},
				{
					columnName: 'pH 10 mv',
					columnNameAliases: ['pH 10 Buffer Value (mV)'],
					outputKeyName: 'ph_10_mv',
					description: 'Use this field to provide helpful information',
					type: 'float'
				},
				{
					columnName: 'pH Slope',
					columnNameAliases: ['Slope (calculated)'],
					outputKeyName: 'ph_slope_mv',
					description: 'Use this field to provide helpful information',
					type: 'float'
				},
				{
					columnName: 'ORP mV',
					columnNameAliases: ['ORP (mV) in Zobells'],
					outputKeyName: 'orp_mv',
					description: 'Use this field to provide helpful information',
					type: 'float'
				},
				{
					columnName: 'Temperature ( therm kOhm )',
					columnNameAliases: ['Temperature (kohm)'],
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
						row: 11,
						col: 'E' // or 5
					},
					regexp: {
						match: /^([\d\.]*)\s.*/g,
						replace: '$1'
					},
					type: 'float'
				},
				{
					name: 'pH Solution ( 4 or 10 )',
					outputKeyName: 'ph_n',
					cell: {
						row: 10,
						col: 'C' // or 3
					},
					regexp: {
						match: /^pH\s(\d*)\s.*/gi,
						replace: '$1'
					},
					type: 'float'
				}
			],
			visitRow( row, metadata, extractions ){
				row.orp_solution_mv = extractions.orp_solution_mv;
				row.ph_n = extractions.ph_n;
				return row;
			}
		});
		this.columnMappings = result;

		for( let column of this.columnMappings ){
			const candidate = column.possibleInputFileColumns[0];
			this.select( column, candidate );
		}

	},
	_fileChanged () {

	},
	select( column, columnMapping ){
		this.$set( this.columnSelections, column.columnName, columnMapping ); // need to use $set or reactivity doesn't work
	},
	deselect( column ){
		this.$set( this.columnSelections, column.columnName, null );
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
