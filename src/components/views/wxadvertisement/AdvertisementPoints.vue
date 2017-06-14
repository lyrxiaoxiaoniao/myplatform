<template> 
  <div class="sc-advertisement">
  	<el-button type="primary" class="sc-top-btn" @click="toAddPoints">新增广告点位</el-button>
	  <div class="sc-main-content">
		<el-row class="sc-top-header">
		  <el-col :span="19"><div class="grid-content sc-font">分类列表</div></el-col>
		  <el-col :span="5">
        <div class="grid-content">
          <el-input placeholder="请输入内容" v-model="keyword">
            <el-button slot="append" icon="search" class="hover-search" @click="searchKeyword()"></el-button>
          </el-input>
        </div>
      </el-col>
		</el-row>
	  	<div class="sc-article-table-content">
	      <el-table :data="response.data" border stripe>
	        <el-table-column type="index" label="ID" width="50"></el-table-column>
	        <el-table-column prop="slug" label="点位标识" min-width="100"></el-table-column>
	        <el-table-column prop="spacename" label="点位名称" width="150"></el-table-column>
	        <el-table-column prop="typename" label="点位类型" width="120"></el-table-column>
	        <el-table-column prop="description" label="具体描述"></el-table-column>
	        <el-table-column prop="createdAt" label="创建时间" width="180px"></el-table-column>
	        <el-table-column label="操作" width="180">
	          <template scope="scope">
	            <el-button size="small" icon="edit" @click="onEditAdvertisement(scope.row.id)" title="修改"></el-button>
	            <el-button size="small" icon="information" @click="toAdvertisementDetail(scope.row.id)" title="查看"></el-button>
	            <el-button size="small" icon="delete2" @click="onDeleteAdvertisement(scope.row.id)" title="删除"></el-button>
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
  </div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        response: {},
        keyword: null,
        deleteId: null
      }
    },
    methods: {
      // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss
      transformDate (res) {
        res.data.forEach(v => {
          if (v.createdAt) {
            v.createdAt = this.formatDate(v.createdAt)
          }
          if (v.beginTime) {
            v.beginTime = this.formatDate(v.beginTime)
          }
          if (v.endTime) {
            v.endTime = this.formatDate(v.endTime)
          }
        })
        return res
      },
      // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
      formatDate (value) {
        let date = new Date(value)
        let M = date.getMonth() + 1
        M = M < 10 ? ('0' + M) : M
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        // let h = date.getHours()
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
        return value
      },
      showList () {
        api.GET(config.advPointListAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            console.log(response.data.data)
            this.response = this.transformDate(response.data.data)
          }
        })
      },
      toAddPoints () {
        console.log(1)
        this.$router.push({
          path: 'addpoint'
        })
      },
      onEditAdvertisement (id) {
        console.log('edit')
        this.$router.push({
          path: 'editpoint',
          query: {
            id: id
          }
        })
      },
      toAdvertisementDetail (id) {
        console.log('查看')
        this.$router.push({
          path: 'pointdetail',
          query: {
            id: id
          }
        })
      },
      onDeleteAdvertisement (id) {
        this.deleteId = id
        this.$confirm('你确定要删除本广告位吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('确定')
          api.POST(config.deleteAdvPointAPI, {id: this.deleteId})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.showList()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
        }).catch(() => {
          console.log('取消')
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 关键字搜索
      searchKeyword () {
        console.log(this.keyword)
        this.updateList({
          keyword: this.keyword
        })
      },
      handleSizeChange (value) {
        this.updateList({
          currentPage: this.response.currentPage,
          pageSize: value
        })
      },
      handleCurrentChange (value) {
        this.updateList({
          currentPage: value,
          pageSize: this.response.pageSize
        })
      },
      // 为调接口
      updateList (obj) {
        api.GET(config.advPointListAPI, obj)
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.response = this.transformDate(response.data.data)
            }
          })
      }
    },
    mounted () {
      this.showList()
    }
  }
</script>
<style scoped>
  .sc-advertisement {
    margin-top: 1rem;
    padding:2rem 1rem;
  }
  .sc-main-content {
	  border-top: 1px solid lightgray;
    padding: 1rem 1rem 2rem;
  }
  .sc-top-btn {
  	margin-bottom: 1rem;
  }
  .sc-font {
	font-size: 2.5rem;
	font-weight: 500;	
  }
  .sc-top-header {
	margin-bottom: 1rem;
	padding: 0 1rem;
  }
  .hover-search:hover {
	color: #50bfff;
  }
</style>