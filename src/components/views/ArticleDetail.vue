<template>
  <div class="articleDetail">
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-row>
          <el-col :span="12">
            <h3>1234</h3>
          </el-col>
          <el-col :span="12">
            <el-button type="primary">通过审查</el-button>
            <el-button>编辑</el-button>
            <el-button type="danger">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          发布时间: 123456 123456  作者： 21312312  浏览次数： 13123123
        </el-row>
        <el-row>
          213213123123123123123123123
        </el-row>
        <el-row>
          <el-button type="primary" icon="caret-top"></el-button>
          <el-checkbox>推荐</el-checkbox>
          <el-checkbox>置顶</el-checkbox>
          <el-checkbox>热点</el-checkbox>
          <el-button icon="document">评论</el-button>
        </el-row>
        <el-row>
          <p>评论</p>
          <vue-html5-editor :content="article.comment" @change="updateData"></vue-html5-editor>
          <el-checkbox>匿名评论</el-checkbox>
          <el-button>发布评论</el-button>
        </el-row>
        <el-row>
          <p>热门评论</p>
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
          title: '',
          comment: ''
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
</style>
