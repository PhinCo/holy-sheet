<template>
	<div>
		<div class="row">
			<div class="col">
				<h4>Previewing {{rowCount}} rows</h4>
				<b-table striped hover :xfields="fields" :items="rows" :per-page="pageSize" :current-page="pageNumber"></b-table>
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
		  type: Object,
		  required: true
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
	  fields () {

	  }
  },
  methods: {
	
  }
}
</script>

<style scoped lang="scss">
	
</style>
