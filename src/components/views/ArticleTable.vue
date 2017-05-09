<template>
  <div v-if="response" class="sc-article-table">
    <div class="sc-article-table-header">
      <el-button type="primary" icon="edit">发布</el-button>
    </div>
    <div class="sc-article-table-content"></div>
    <div class="sc-article-table-footer"></div>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-article-table',
  data () {
    return {
      response: null,
      articleCatlg: null,
      error: null
    }
  },
  computed: {
  },
  methods: {
    getArticleList () {
      api.request('GET', config.articleAPI)
        .then(response => {
          this.response = response.data.data
          console.log(response.data.data)
        })
        .catch(error => {
          this.error = error
        })
    },
    getArticleCatlg () {
      api.request('GET', config.articleCatlgAPI)
        .then(response => {
        })
        .catch(error => {
          this.error = error
        })
    }
  },
  components: {
  },
  mounted () {
    this.getArticleList()
  }
}
</script>

<style scoped>
  .sc-article-table-header {
    margin: 0 20px;
    padding-top: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid lightgray;
  }
</style>
