<template>
  <div class="hello">
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
	<input ref="fileInput" 
		class="file-input"
		type="file"
		@change.stop.prevent="_fileChanged" />
	</div>

	<div v-if="columnMappings">
		<table class="transformerTable">
			<tr>
				<th>Field</th>
				<th>Type</th>
				<th>matches column from<br/><small>{{filename}}</small></th>
			</tr>
			<tr v-for="column in columnMappings" :key="column.columnName">
				<td>
					<strong>{{column.columnName}}</strong><br/>
					<small>{{column.description}}</small>
				</td>
				<td>{{column.transformer.type}}</td>
				<td>
					<ul class='dropdown'>
						<li>
							<div class="currentSelection">
								<h4>{{columnSelections[column.columnName].inputColumnName}}</h4>
								<span class="exampleData">{{columnSelections[column.columnName].exampleData.join(', ')}}</span>
							</div>
							<ul class="dropdown-box">
								<li class="candidateSelection" v-for="possible in column.possibleInputFileColumns" :key="column.columnName + '-' + possible.inputColumnName" @click="select( column, possible )">
									<h4>{{possible.inputColumnName}}</h4>
									<span class="exampleData">{{possible.exampleData.join(', ')}}</span>
								</li>
							</ul>
						</li>
					</ul>
				</td>
			</tr>
		</table>
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
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

	a {
		color: #42b983;
	}

	.dropElement {
		width: 400px;
		height: 100px;
		border: 4px dashed silver;
	}

	.dragging {
		border: 4px dashed red;
	}

	.dropdown {
		display: inline-block;
		position: relative;
	}

	.dropdown > li {
		padding: 0;
		margin: 0;
	}

	.dropdown, .dropdown ul {
		border: 1px solid silver;
		background: white;
	}

	.dropdown ul {
		position: absolute;
		min-width: 300px;
		max-width: 600px;
		list-style-type: none;
		padding: 0;
		margin: 0;
		left: 0;
		height: 0;
		overflow: hidden;
		border-color: transparent;
		background-clip: padding-box;
	}

	.dropdown:hover ul {
		height: auto;
		border-color: silver;
	}

	.dropdown li:nth-child(n+2) {
		border-top: 1px solid silver;
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

	.currentSelection {
		padding: 4px 30px 4px 6px;
	}

	.currentSelection h4{
		margin: 0;
		overflow: hidden;
	}

	.currentSelection .exampleData{
		font-size: 12px;
		color: #555;
	}

	.candidateSelection {
		padding: 4px 30px 4px 6px;
		width: 100%;
		cursor: pointer;
	}

	.candidateSelection:hover {
		background-color: #eee;
	}

	.candidateSelection h4{
		margin: 0;
		overflow: hidden;
	}

	.candidateSelection .exampleData{
		font-size: 12px;
		color: #555;
	}

</style>
