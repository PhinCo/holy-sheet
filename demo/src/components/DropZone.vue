<template>
	<div 
		ref="dropElement"
		class="dropElement"
		:class="{ dragging: dragging }"
		draggable="true"
		@dragenter.stop.prevent="_dragEnter"
		@dragleave.stop.prevent="_dragLeave"
		@dragover.stop.prevent="_dragOver"
		@drop.stop.prevent="_drop"
		@click="_click"
	>
		<input type="file" ref="fileInput" class="fileInput" multiple="false"/>
		<div class="label" v-if="!file">Drag and drop a <strong>.csv</strong> or <strong>.xlsx</strong> file here</div>
		<div class="label" v-if="file">{{file.name}}</div>
	</div>
</template>

<script>
import holysheet from '../../..'

export default {
  name: 'DropZone',
  data () {
		return {
			dragging: false,
			file: null
		};
  },
  methods: {
	_click () {
		this.$refs.fileInput.click();
	},
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
		this.file = e.dataTransfer.files[0];
	},
	_fileChanged( e ){
		this.file = this.$refs.fileInput.files[0];
	},
	clear () {
		this.file = null;
	}
  },
  mounted () {
	this.$watch( 'file', function(){
		this.$emit( 'file-changed', this.file );
		this.dragging = false
	});
  }
}
</script>

<style scoped lang="scss">

	.fileInput{
		display: none;
	}

	.dropElement {
		position: relative;
		width: 100%;
		text-align: center;
		padding: 60px 6px;
		border: 4px dashed silver;
		cursor: pointer;
		border-radius: 6px;
		color: #666;
		font-size: 20px;
		font-weight: 100;
	}

	.dragging {
		border: 4px dashed rgba(9, 131, 226, 1.0);
		background-color: rgba(9, 131, 226, 0.1)
	}

	.label {
		pointer-events: none;
	}
</style>
