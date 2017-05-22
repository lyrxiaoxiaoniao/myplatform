<template>
  <div v-if="response" class="sc-article-table">
    <transition name="fade">
      <el-form v-show="advancedForm" class="search-form" :model="searchForm" :label-width="'80px'">
        <el-row>
          <el-col :span="8">
            <el-form-item label="ID">
              <el-input v-model="searchForm.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文章标题">
              <el-input v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作者">
              <el-input v-model="searchForm.author"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-form-item label="创建时间">
            <el-date-picker type="date" placeholder="开始日期" v-model="searchForm.startTime"></el-date-picker>
            <el-date-picker type="date" placeholder="结束日期" v-model="searchForm.endTime"></el-date-picker>
          </el-form-item>
          <el-col :span="8">
            <el-select v-model="searchForm.cateId" placeholder="文章分类" clearable>
              <el-option
                v-for="item in articleCatlg"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form>
    </transition>
    <div class="sc-article-table-header">
      <el-row type="flex" justify="space-between">
        <el-col :span="15">
          <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
          <el-button type="primary" @click="onAdvancedSearch">高级搜索</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="onNewest">最新</el-button>
          <el-button @click="onMostClick">点击</el-button>
          <el-button type="primary" icon="plus" @click="onPublish"></el-button>
        </el-col>
      </el-row>
    </div>
    <div class="sc-article-table-content">
      <el-table :data="response.data" border stripe>
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
        <el-table-column prop="title" label="文章标题" min-width="100"></el-table-column>
        <el-table-column prop="category.name" label="类别" width="100"></el-table-column>
        <el-table-column prop="author" label="发布者"></el-table-column>
        <el-table-column prop="createdAt" label="发布时间" sortable></el-table-column>
        <el-table-column prop="click" label="点击量" width="100px" sortable></el-table-column>
        <el-table-column prop="state" label="状态" width="120px"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button size="small" icon="information" @click="toArticleDetail(scope.row.id)"></el-button>
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
      advancedForm: false,
      searchForm: {
        id: '',
        title: '',
        author: '',
        startTime: '',
        endTime: '',
        feature: '',
        cateId: ''
      },
      error: null
    }
  },
  computed: {
  },
  methods: {
    onSearch () {
      if (this.advancedForm) {
        const data = {
          currentPage: this.response.currentPage,
          pageSize: this.response.pageSize,
          ...this.searchForm
        }

        this.updateArticleList(data)
      } else {
        // Single Search
      }
    },
    onNewest () {
      this.searchForm.feature = 1
      const data = {
        currentPage: this.response.currentPage,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }

      this.updateArticleList(data)
    },
    onMostClick () {
      this.searchForm.feature = 2
      const data = {
        currentPage: this.response.currentPage,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }

      this.updateArticleList(data)
    },
    onAdvancedSearch () {
      this.advancedForm = !this.advancedForm
    },
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
    transformSearhForm (data) {
      if (data.startTime && data.startTime !== '') {
        const start = new Date(data.startTime.toString()).getTime()
        data.startTime = start
      }
      if (data.endTime && data.endTime !== '') {
        const end = new Date(data.endTime.toString()).getTime()
        data.endTime = end
      }
      return data
    },
    toArticleDetail (id) {
      this.$router.push({
        path: 'articledetail',
        query: {
          id: id
        }
      })
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
    updateArticleList (object) {
      const URL = config.serverURI + config.articleAPI
      const data = this.transformSearhForm(object)
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
          this.$message.error(error)
        })
    },
    // Get Article List
    getArticleList () {
      api.request('GET', config.articleAPI)
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
          this.$message.error(error)
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
                value: item.id,
                label: item.name
              }
              this.articleCatlg.push(object)
            })
          }
          this.$store.commit('SET_ARTICLE_CATLG', this.articleCatlg)
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
  .sc-article-table {
    border-top: 1px solid lightgray;
    padding-top: 2rem;
    margin-left: 2rem;
    margin-top: 2rem;
    margin-right: 2rem;
  }

  .sc-article-table-header {
    margin-bottom: 20px;
  }

  .sc-article-table-content {
    margin: 0 1rem;
    margin-bottom: 20px;
  }

  .search-form {
    border: 1px solid lightgray;
    padding: 20px;
    margin-bottom: 10px;
  }
</style>
