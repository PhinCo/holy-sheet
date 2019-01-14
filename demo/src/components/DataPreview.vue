<template>
	<div>
		<div class="row">
			<div class="col">
				<h4>Previewing {{rowCount}} rows</h4>
				<b-table striped hover :fields="fields" :items="rows" :per-page="pageSize" :current-page="pageNumber">
					 <template slot="unmappedColumns" slot-scope="data">
						<div v-for="(value, key) in data.value" :key="key">
							{{ key }} = {{ value }}
						</div>
					</template>
				</b-table>
				<b-pagination align="center" size="sm" v-model="pageNumber" :total-rows="rowCount" :per-page="pageSize"></b-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'PreviewRows',
  props: {
	  rows: {
		  type: Array,
		  required: true
	  },
	  columnNamesInOrder: {
		  type: Array
	  }
  },
  data () {
		return {
			pageSize: 10,
			pageNumber: 1
		};
  },
  computed: {
	  rowCount () {
		  if( !this.rows ) return 0;
		  return this.rows.length;
	  },
	  fields (){
		  if( !this.columnNamesInOrder ) return null
		  return this.columnNamesInOrder.map( n => {
			  return {
				key: n,
			  	label: n
			  }
		  });
	  }
  },
  methods: {
	
  }
}
</script>

<style scoped lang="scss">
	
</style>
