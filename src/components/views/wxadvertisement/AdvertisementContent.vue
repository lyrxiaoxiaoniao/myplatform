<template> 
  <div class="sc-advertisement">
	  <div class="sc-main-content">
		<el-row class="sc-top-header">
		  <el-col :span="12">
        <el-button type="primary" class="sc-top-btn" @click="toAddPoints">新增</el-button>
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
	      <el-table :data="data.data" border stripe>
	        <el-table-column type="index" label="ID" width="50"></el-table-column>
	        <el-table-column prop="title" label="广告标题" ></el-table-column>
	        <el-table-column prop="type" label="广告分类" width="120"></el-table-column>
	        <el-table-column prop="clickcount" label="点击量" width="80"></el-table-column>
	        <el-table-column prop="watchcount" label="展示量" width="80"></el-table-column>
	        <el-table-column prop="createdAt" label="上线时间" width="180px"></el-table-column>
          <el-table-column label="状态" width="100px">
            <template scope="scope">
              <el-switch
                v-model="scope.row.state"
                on-text="开"
                off-text="关"
                @change="toswitch(scope.row.state, scope.row.id)">
              </el-switch>
            </template> 
          </el-table-column>
	        <el-table-column label="操作" width="210">
	          <template scope="scope">
	            <el-button size="small" icon="edit" @click="onEditAdvertisement(scope.row.id)" title="修改"></el-button>
	            <el-button size="small" icon="information" @click="toAdvertisementDetail(scope.row.id)" title="查看"></el-button>
	            <el-button size="small" icon="delete2" @click="onDeleteAdvertisement(scope.row.id)" title="删除"></el-button>
              <el-button size="small" icon="date" @click="onUpAdv(scope.row.id)" title="上画"></el-button>
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
	            :current-page="data.currentPage"
	            :page-sizes="[10, 20, 50, 100]"
	            :page-size="data.pageSize"
	            :total="data.count"
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
      options: [{
        value: '1',
        label: '广告标题'
      }, {
        value: '2',
        label: '广告分类'
      }],
      value: '',
      data: {},
      deleteId: null,
      keyword: null
    }
  },
  computed: {
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
      console.log(state)
      // updateStateAdvPointAPI
      var obj = {
        id: id,
        state: this.changeNum(state)
      }
      api.POST(config.updatestateAdvAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.$message('修改状态成功！！！')
        }
      })
    },
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss
    transformDate (res) {
      res.data.forEach(v => {
        if (v.createdAt) {
          v.createdAt = this.formatDate(v.createdAt)
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
    // 页面表格列表展示
    showList () {
      console.log(config.advertisementListAPI)
      api.GET(config.advertisementListAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.data = this.transformDate(response.data.data)
          }
        })
    },
    // 跳转新增广告页面
    toAddPoints () {
      this.$router.push({
        path: 'addadvcontent'
      })
    },
    /**
     * 跳转编辑广告页面
     * id ： 当前所在行id
     * */
    onEditAdvertisement (id) {
      this.$router.push({
        path: 'editadvcontent',
        query: {
          id: id
        }
      })
    },
     /**
     * 跳转广告页面详情
     * id ： 当前所在行id
     * */
    toAdvertisementDetail (id) {
      this.$router.push({
        path: 'advdetail',
        query: {
          id: id
        }
      })
    },
    onUpAdv (id) {
      this.$router.push({
        path: 'upad',
        query: {
          id: id
        }
      })
    },
     /**
     * 删除该条广告信息
     * id ： 当前所在行deleteId
     * */
    onDeleteAdvertisement (id) {
      this.deleteId = id
      // console.log(this.deleteId)
      this.$confirm('此操作将删除该广告点位，删除后，数据无法恢复。是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        api.POST(config.deleteAdvertisementAPI, {id: this.deleteId})
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
    /**
     * 根据搜索关键字来搜索匹配的字段
    */
    searchKeyword () {
      console.log(this.keyword)
      if (this.value === '1') {
        this.updateList({
          title: this.keyword
        })
      }
      if (this.value === '2') {
        this.updateList({
          type: this.keyword
        })
      }
    },
    handleSizeChange (value) {
      this.updateList({
        currentPage: this.data.currentPage,
        pageSize: value
      })
    },
    handleCurrentChange (value) {
      this.updateList({
        currentPage: value,
        pageSize: this.data.pageSize
      })
    },
    // 为调接口
    updateList (obj) {
      api.GET(config.advertisementListAPI, obj)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            // console.log(response.data.data)
            this.data = this.transformDate(response.data.data)
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
    /*background-color: #fff;*/
  }
  .sc-top-header {
	margin-bottom: 1rem;
	padding: 0 1rem;
  }
  .hover-search:hover {
	color: #108ce8;
  }
  .SC-imgContent {
  	margin-top: 5px;
    margin-bottom: 5px;
    width: 56px;
    height: 56px;
  }
</style>