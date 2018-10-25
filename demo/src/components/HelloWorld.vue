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
		<div class="column" v-for="column in columnMappings" :key="column.columnName">
			<h3>{{column.columnName}}, {{column.description}}, {{column.transformer.type}}</h3>
			<div class="possible" v-for="possible in column.possibleInputFileColumns" :key="possible.inputColumnName">
				<h4>{{possible.inputColumnName}}</h4>
				<ul v-for="example in possible.exampleData" :key="example">
					<li>{{example}}</li>
				</ul>
			</div>
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
			columnMappings: null
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
		const result = await holysheet.prepareColumnMappingInfo( files[0], {
			columns: [
				{
					columnName: 'OutputColumnName',
					description: 'Use this field to provide helpful information',
					type: 'string'
				}
			]
		});
		this.columnMappings = result;
		console.log( result )
	},
	_fileChanged () {

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

	.column{
		padding: 20px;
		border: 1px solid silver;
	}
</style>
