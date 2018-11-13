<template>
	<div>
		<div class="row">
			<div class="col">
				<b-alert show variant="danger">
					<strong>Oops! There were {{rowCount}} transformation errors.</strong><br/>
					You must correct all errors in your input file before you can upload. Please review the errors below and make
					the necessary corrections in your input file.
				</b-alert>

				<b-table striped hover :fields="fields" :items="rows" :per-page="pageSize" :current-page="pageNumber"></b-table>
				<b-pagination align="center" size="sm" v-model="pageNumber" :total-rows="rowCount" :per-page="pageSize"></b-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'DataErrors',
  props: {
	  rows: {
		  type: Array,
		  required: true
	  }
  },
  data () {
		return {
			pageSize: 10,
			pageNumber: 1,
			fields: [
				{
					key: 'rowNumber',
					label: 'Input Row Number',
					sortable: true
				},
				{
					key: 'inputColumnName',
					label: 'Column Name',
					sortable: true
				},
				{
					key: 'inputValue',
					label: 'Raw Value',
					sortable: true
				},
				{
					key: 'transformedValue',
					label: 'Transformed Value',
					sortable: true
				},
				{
					key: 'error',
					label: 'Error',
					sortable: true
				}
			]
		};
  },
  computed: {
	  rowCount () {
		  if( !this.rows ) return 0;
		  return this.rows.length;
	  }
  },
  methods: {
	
  }
}
</script>

<style scoped lang="scss">
	
</style>
