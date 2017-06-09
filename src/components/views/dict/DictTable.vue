<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
    </div>
  </kobe-table>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-dict-table',
  data () {
    return {
    }
  },
  methods: {
    getDictList () {
      api.GET(config)
      .then(response => {
      })
    }
  },
  mounted () {
    this.getDictList()
  }
}
</script>

<style>
</style>
