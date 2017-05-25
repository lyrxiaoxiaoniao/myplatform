<template>
  <div class="article-detail" v-if="response">
    <div class="article-header">
      <el-row>
        <h3>{{ response.title }}</h3>
      </el-row>
      <el-row class="summary-text">
        <h4>{{ response.digest }}</h4>
      </el-row>
      <el-row class="extra-text" type="flex" justify="space-between">
        <el-col :span="6">
          发布时间:{{ response.createdAt | toDate }}
        </el-col>
        <el-col :span="6">
          作者:{{ response.author }}
        </el-col>
        <el-col :span="6">
          浏览次数:{{ response.click }}
        </el-col>
      </el-row>
    </div>

    <div class="article-content">
      <div v-html="response.content">
      </div>
    </div>

    <div class="article-footer">
      <el-row type="flex" justify="space-between">
        <el-col :span="15">
          <el-tag type="primary" class="article-tag" v-for="tag in response.tags">{{ tag.name }}</el-tag>
        </el-col>
        <el-button icon="caret-top" size="mini">{{ response.upvote }}</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'

export default {
  data () {
    return {
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
    const URL = config.articleDetailAPI
    api.GET(URL, {
      id: id
    })
    .then(response => {
      if (response.status !== 200) {
        this.error = response.statusText
        this.$message.error(this.error)
        return
      }

      if (response.data.errcode === '0000') {
        this.response = response.data.data
      }
    })
    .catch(error => {
      this.$message.error(error)
    })
  }
}
</script>
<style scoped>
  .article-detail {
    margin-left: 1rem;
    margin-top: 2rem;
    padding: 2rem;
    border-top: 1px solid lightgray;
    background-color: white;
    box-shadow: 1px 1px 1px 1px lightgrey;
    width: 900px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .summary-text h4 {
    color: gray;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .extra-text {
    color: gray;
  }
  .article-header {
    border-bottom: 1px solid gray;
    margin-bottom: 1rem;
  }
  .article-footer {
    margin-top: 1rem;
    border-top: 1px solid gray;
    padding: 1rem;
  }
  .article-tag {
    margin-right: 1rem;
  }
</style>
