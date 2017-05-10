<template>
  <div class="articleDetail">
    <el-row type="flex" justify="center">
      <el-col :span="15" class="articleDetailPanel">
        <el-row>
          <h2>{{ article.title }}</h2>
        </el-row>
        <el-row>
          <el-col :span="18">
            发布时间:{{ article.time }} 作者:{{ article.author }} 浏览次数:{{ article.views }}
          </el-col>
          <el-col :span="6">
            <el-checkbox>通过审查</el-checkbox>
            <el-button icon="edit" size="mini" type="primary">编辑</el-button>
            <el-button icon="delete" size="mini" type="danger">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          {{ article.summary }}
        </el-row>
        <el-row type="flex" justify="center">
          {{ article.content }}
        </el-row>
        <el-row type="flex" justify="end">
          <el-button icon="caret-top" size="mini">{{ article.star }}</el-button>
          <el-checkbox>推荐</el-checkbox>
          <el-checkbox>置顶</el-checkbox>
          <el-checkbox>热点</el-checkbox>
        </el-row>
        <el-row type="flex" justify="space-between">
          <span><el-button>上一篇</el-button>{{ article.pre }}</span>
          <span>{{ article.next }}<el-button>下一篇</el-button></span>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
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
        }
      }
    },
    methods: {
      updateData (data) {
        this.form.comment = data
      }
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
