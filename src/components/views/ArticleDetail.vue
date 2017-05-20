<template>
  <div class="articleDetail" v-if="response">
    <el-row type="flex" justify="center">
      <el-col :span="15" class="articleDetailPanel">
        <el-row>
          <h2>{{ response.title }}</h2>
        </el-row>
        <el-row>
          <el-col :span="18">
            发布时间:{{ response.createdAt }} 作者:{{ response.author }} 浏览次数:{{ response.click}}
          </el-col>
        </el-row>
        <el-row>
          {{ response.summary }}
        </el-row>
        <el-row type="flex" justify="center" v-html="response.content">
        </el-row>
        <el-row type="flex" justify="end">
          <el-button icon="caret-top" size="mini">{{ article.star }}</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
import config from 'src/config'

export default {
  data () {
    return {
      article: {
        title: '1234',
        time: '2016',
        author: '江鹏',
        views: '1234',
        summary: '摘要',
        content: '正文',
        star: 20,
        top: true,
        pre: '123',
        next: '345'
      },
      response: null
    }
  },
  methods: {
    updateData (data) {
      this.form.comment = data
    }
  },
  created () {
    const id = this.$route.query.id
    const URL = config.serverURI + config.articleDetailAPI
    axios.get(URL, {
      params: {
        id
      }
    })
    .then(response => {
      this.response = response.data.data
    })
    .catch(error => {
      this.$message.error(error)
    })
  }
}
</script>
<style scoped>
  .articleDetail {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid lightgray;
  }
  .articleDetailPanel {
    padding: 2rem;
    background-color: white;
    box-shadow: 1px 1px 1px 1px lightgrey;
  }
</style>
