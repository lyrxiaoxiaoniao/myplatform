<template>
  <div v-if="response" class="sc-article-table">
    <transition name="">
      <el-form v-show="advancedForm" class="search-form" :model="searchForm" :label-width="'80px'">
      </el-form>
    </transition>
    <div class="sc-article-table-header">
      <el-row type="flex" justify="space-between">
        <el-col :span="15">
          <el-button type="primary" icon="edit" @click="onPublish">发布</el-button>
          <el-select v-model="selectedCatlg" placeholder="请选择">
            <el-option
              v-for="item in articleCatlg"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
          <el-select v-model="selectedFeature" clearable></el-select>
          <el-button type="primary" icon="search">搜索</el-button>
          <el-button type="primary">高级搜索</el-button>
        </el-col>
        <el-col :span="5">
          <span>排序</span>
          <el-button size="small">时间</el-button>
          <el-button size="small">点击</el-button>
          <el-button size="small">ID</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="sc-article-table-content">
      <el-table :data="response.data" border stripe>
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
        <el-table-column prop="title" label="文章标题" min-width="100"></el-table-column>
        <el-table-column prop="category.name" label="类别" width="100"></el-table-column>
        <el-table-column prop="user.nickname" label="发布者"></el-table-column>
        <el-table-column prop="createdAt" label="发布时间" sortable></el-table-column>
        <el-table-column prop="state" label="状态" width="120px"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button size="small" icon="information"></el-button>
            <el-button size="small" icon="edit"></el-button>
            <el-button size="small" icon="delete2" @click="onDeleteArticle(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-article-table-footer">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="response.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="response.pageSize"
            :total="response.count"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'
import axios from 'axios'

export default {
  name: 'sc-article-table',
  data () {
    return {
      response: null,
      articleCatlg: [],
      selectedCatlg: '',
      selectedFeature: '',
      advancedForm: false,
      searchForm: {
      },
      error: null
    }
  },
  computed: {
  },
  methods: {
    handleSizeChange (value) {
      this.updateArticleList({
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.searchForm
      })
    },
    handleCurrentChange (value) {
      this.updateArticleList({
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.searchForm
      })
    },
    onPublish () {
      this.$router.push('articleadd')
    },
    onDeleteArticle (id) {
      this.$confirm('是否确认删除该篇文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.request('POST', config.deleteArticleAPI, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            let data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.searchForm
            }
            this.updateArticleList(data)
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除失败'
            })
          }
        })
      })
    },
    transformData (res) {
      res.data.forEach(item => {
        switch (item.state) {
          case 0:
            item.state = '未审核'
            break
          case 1:
            item.state = '审核通过'
            break
          case 2:
            item.state = '审核未通过'
            break
        }
        if (item.createdAt) {
          let date = new Date(item.createdAt)
          const month = date.getMonth() + 1
          item.createdAt = `${date.getFullYear()}-${month}-${date.getDate()}`
        }
      })

      return res
    },
    updateArticleList (data) {
      const URL = config.serverURI + config.articleAPI
      console.log(data)
      axios.get(URL, {
        params: data
      })
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            this.response = this.transformData(response.data.data)
          }
        })
        .catch(error => {
          this.error = error
        })
    },
    // Get Article List
    getArticleList () {
      api.request('GET', config.articleAPI)
        .then(response => {
          console.log(response.data.data)

          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            this.response = this.transformData(response.data.data)
          }
        })
        .catch(error => {
          this.error = error
        })
    },
    // Get Article Category List
    getArticleCatlg () {
      api.request('GET', config.articleCatlgAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            response.data.data.data.forEach(item => {
              let object = {
                value: item.name,
                label: item.name
              }
              this.articleCatlg.push(object)
            })
          }
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
    this.getArticleCatlg()
  }
}
</script>

<style scoped>
  .sc-article-table-header {
    margin: 10px 20px;
    padding-top: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid lightgray;
  }

  .sc-article-table-content {
    margin: 0 1rem;
    margin-bottom: 20px;
  }
</style>
