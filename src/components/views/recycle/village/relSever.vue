<template>
<div>
    <kobe-table class="border margin" style="margin: 20px 40px;background-color: white;">
      <div slot="kobe-table-header" class="kobe-table-header" style="border-bottom: 1px solid gainsboro">
         <el-row>
             <el-col :span="18" style="color: black;font-size: 13px;line-height: 36px;font-weight: bold">文锦湖贝小区</el-col>
             <el-col :offset="2" :span="4">
                 <el-button @click="back">返回</el-button>   
             </el-col>
         </el-row>  
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-form  class="padding" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
              <el-row class="text-decoration">
                <el-col :span="10">          
                    <div>联系人：{{info.duty_name}}</div>       
                </el-col>
                <el-col :offset="4" :span="10">                 
                    <div>联系人电话：{{info.mobile}}</div>                 
                 </el-col>
              </el-row>
                <el-row class="text-decoration">
                <el-col :span="10">               
                    <div>详细地址：{{info.detail_address}}</div>          
                </el-col>
                <el-col :offset="4" :span="10">                 
                    <div>已关联物业数量：{{info.count}}</div>                 
                 </el-col>
              </el-row>            
          </el-form>
      </div>
    </kobe-table>
    <el-tabs class="margin" v-model="activeName" @tab-click="handleClick" style="margin:0 40px">
      <el-tab-pane label="已关联物业" name="first"></el-tab-pane>
      <el-tab-pane label="未关联物业" name="second"></el-tab-pane>
      <el-tab-pane label="历史关联" name="third"></el-tab-pane>    
    </el-tabs>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
         
      <el-row type="flex" justify="center">
        <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button icon="upload2" type="primary" style="margin-left:10px;"></el-button>
            <el-button icon="setting" type="primary"></el-button>
      </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-table
            ref="multipleTable"
            border
            stripe
            :data="response.data"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="物业名称" width="150"></el-table-column>
            <el-table-column prop="duty_name" label="联系人" width="95">
            </el-table-column>
            <el-table-column prop="mobile" label="联系电话"></el-table-column>
            <el-table-column prop="region_id" label="公司地址"></el-table-column>
            <el-table-column 
              width="150"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button>
                <el-button @click="deleteType(scope.row.id)" size="small">
                  关联
                </el-button>
                <el-button  size="small" icon="home1"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
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
      </kobe-table>


</div>
</template>
<script type="text/javascript">
import config from 'src/config/recycle.js'
import api from 'src/api'
export default {
  data () {
    return {
      data: [],
      response: {
        data: null
      },
      info: {
        duty_name: '贾克斯',
        mobile: '14718436328',
        detail_address: '深圳',
        count: '1'
      },
      activeName: 'first',
      form: {
        keyword: '',
        value: ''
      }
    }
  },
  methods: {
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    getList (data = {}) {
      api.GET(config.village.list, data)
      .then(response => {
        this.response = this.transformDate(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transformDate (res) {
      if (res) {
        res.data.forEach(v => {
          if (v.audit_state === 1) {
            v.audit_state = false
          }
          if (v.audit_state === 0) {
            v.audit_state = true
          }
        })
      }
      return res
    },
    back: function () {
      this.$router.push('/admin/recycle/village/index')
    }
  }
}

</script>
<style type="text/css">
.border {
  border: 1px solid gainsboro;
  border-radius: 5px;
}
.padding {
  padding: 30px 50px 30px 100px;
}
.text-decoration {
  line-height: 36px;
}
</style>