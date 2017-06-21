<template> 
  <div class="sc-advertisement">
		<el-row class="sc-top-header">
		  <el-col :span="12">
        <el-button type="primary" class="sc-top-btn" @click="toAddPoints()">新增广告点位</el-button>
      </el-col>
		  <el-col :span="3">
         <template>
          <el-select v-model="value" placeholder="请选择" style="float:right;margin-right:10px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-col>
		  <el-col :span="6">
        <div class="grid-content">
          <el-input placeholder="请输入内容" v-model="keyword">
            <el-button slot="append" icon="search" class="hover-search" @click="searchKeyword()"></el-button>
          </el-input>
        </div>
      </el-col>
		  <el-col :span="3">
        <el-button icon="upload2" type="primary" style="margin-left:20px;"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-col>
		</el-row>
	  	<div class="sc-article-table-content">
	      <el-table :data="response.data" border stripe>
	        <el-table-column type="index" label="ID" width="50"></el-table-column>
	        <el-table-column prop="spacename" label="点位名称" min-width="100"></el-table-column>
	        <el-table-column prop="slug" label="点位标识" width="150"></el-table-column>
	        <el-table-column prop="typename" label="分类" width="120"></el-table-column>
	        <el-table-column prop="count" label="点击量"></el-table-column>
	        <el-table-column prop="createdAt" label="创建时间" width="180px"></el-table-column>
	        <el-table-column prop="upCount" label="当前上画" width="100px"></el-table-column>
	        <el-table-column label="状态" width="100px">
            <template scope="scope">
              <el-switch
                v-model="scope.row.state"
                on-text="开"
                off-text="关"
                @change="toswitch(scope.row.state,scope.row.id)">
              </el-switch>
            </template> 
          </el-table-column>
	        <el-table-column label="操作" width="210">
	          <template scope="scope">
	            <el-button size="small" icon="edit" @click="onEditAdvertisement(scope.row.id)" title="修改"></el-button>
	            <el-button size="small" icon="information" @click="toAdvertisementDetail(scope.row.id)" title="查看"></el-button>
	            <el-button size="small" icon="delete2" @click="onDeleteAdvertisement(scope.row.id)" title="删除"></el-button>
	            <el-button size="small" icon="date" @click="onUpadv(scope.row.id)" title="上画"></el-button>
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
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        options: [{
          value: '1',
          label: '点位标识'
        }, {
          value: '2',
          label: '点位名称'
        }],
        value: '',
        response: {},
        deleteId: null,
        keyword: null
      }
    },
    methods: {
      changeNum (val) {
        if (val) {
          val = 1
        } else {
          val = 0
        }
        return val
      },
      toswitch (state, id) {
        var obj = {
          id: id,
          state: this.changeNum(state)
        }
        api.POST(config.updateStateAdvPointAPI, obj)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '修改状态成功！！！',
              type: 'success'
            })
          }
        })
      },
      // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  state 状态值
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
          if (v.state === 1) {
            v.state = true
          }
          if (v.state === 0) {
            v.state = false
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
            this.response = this.transformDate(response.data.data)
          }
        })
      },
      toAddPoints () {
        this.$router.push({
          path: '/admin/ad/point/add'
        })
      },
      onEditAdvertisement (id) {
        this.$router.push({
          path: '/admin/ad/point/edit',
          query: {
            id: id
          }
        })
      },
      toAdvertisementDetail (id) {
        this.$router.push({
          path: '/admin/ad/point/detail',
          query: {
            id: id
          }
        })
      },
      onUpadv (id) {
        this.$router.push({
          path: '/admin/ad/upload/point',
          query: {
            id: id
          }
        })
      },
      onDeleteAdvertisement (id) {
        this.deleteId = id
        this.$confirm('此操作将删除该广告点位，删除后，数据无法恢复。是否继续删除？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          api.POST(config.deleteAdvPointAPI, {id: this.deleteId})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.showList()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
        }).catch(() => {
          this.$notify.info({
            title: '消息',
            message: '已取消删除'
          })
        })
      },
      // 关键字搜索
      searchKeyword () {
        if (this.value === '1') {
          this.updateList({
            slug: this.keyword
          })
        }
        if (this.value === '2') {
          this.updateList({
            spacename: this.keyword
          })
        }
      },
      handleSizeChange (value) {
        this.updateList({
          currentPage: this.response.currentPage,
          pageSize: value,
          ...this.response.data
        })
      },
      handleCurrentChange (value) {
        this.updateList({
          currentPage: value,
          pageSize: this.response.pageSize,
          ...this.response.data
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
    margin-top: 2rem;
    padding:2rem 1rem;
    border-top: 1px solid lightgray;
  }
  .sc-top-btn {
  	margin-bottom: 1rem;
  }
  .sc-top-header {
	margin-bottom: 1rem;
	padding: 0 2rem;
  }
  .hover-search:hover {
	color: #50bfff;
  }
</style>