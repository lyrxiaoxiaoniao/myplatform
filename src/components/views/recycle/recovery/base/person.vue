<template>
    <div class="lh-container">
		<div class="lh-top">
            <div class="lh-header">
                <div>人员信息</div>
                <!-- <div>
                    <el-button>返回</el-button>
                    <el-button type="primary">修改</el-button>
                </div> -->
            </div>
            <div class="lh-form">
                <kobe-table>
                    <div slot="kobe-table-header" class="kobe-table-header">
                      <el-row type="flex" justify="end">
                        <el-col :span="16">
                            <el-button @click="handleCommand" type="primary">批量删除</el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                            <el-button slot="append" @click="onSearch" icon="search"></el-button>
                            </el-input>
                        </el-col>
                          <!-- <el-button icon="search" type="primary" style="margin-left:10px;">高级</el-button> -->
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
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
                        <el-table-column prop="id" label="员工姓名" width="150"></el-table-column>
                        <el-table-column prop="id" label="登录名" width="150"></el-table-column>
                        <el-table-column prop="id" label="联系电话" width="150"></el-table-column>
                        <el-table-column prop="id" label="所属部门"></el-table-column>
                        <el-table-column prop="id" label="职务" width="150"></el-table-column>
                        <el-table-column width="140" label="操作">
                        <template scope="scope">
                            <el-button @click="deleteType(scoped.row.id)" size="small" icon="delete2" title="删除"></el-button>
                            <el-button @click="editPerson" size="small" icon="edit" title="修改"></el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    </div>
                    <div slot="kobe-table-footer" class="kobe-table-footer">
                        <el-row type="flex" justify="center">
                        <el-col :span="8">
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
                <el-dialog title="添加车辆" v-model="showDialog">
                   <el-form :model="selected" label-width="80px">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="车牌号">
                          <el-input v-model="selected.phone" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="车辆品牌">
                          <el-input v-model="selected.phone" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="GPS标识">
                          <el-input v-model="selected.phone" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="所属公司">
                          <el-select v-model="selected.businessType" class="fullwidth" placeholder="请选择所属公司">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="12">
                        <el-form-item label="车重">
                          <el-input v-model="selected.phone" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="12">
                        <el-form-item label="最大承重">
                          <el-input v-model="selected.phone" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="行车路线">
                          <el-select v-model="selected.businessType" class="fullwidth" placeholder="请选择行车路线">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button>取 消</el-button>
                    <el-button type="primary">添 加</el-button>
                  </span>
                </el-dialog>
            </div>
        </div>
    </div>    
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  props: ['id'],
  data () {
    return {
      response: {
        data: null
      },
      showDialog: false,
      selected: {
        businessType: '',
        phone: ''
      },
      options: [{
        value: 1,
        label: '街道1'
      }, {
        value: 2,
        label: '街道2'
      }],
      multipleSelection: [],
      ids: [],
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    handleCommand (command) {
      this.deleteType()
    },
    editPerson () {
      this.showDialog = true
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选评论信息？', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          return
        }).catch(() => {
          return
        })
        return
      }
      this.$confirm('此操作将删除该敏感字。是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.newcms.removeNcmsSensitiveAPI, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
          } else {
            this.$message.error(response.data.errmsg)
          }
        })
      })
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    getList (data = {}) {
      console.log(1111)
      // api.GET(config.showWordSourceListAPI, data)
      // .then(response => {
      //   this.response = response.data.data
      // })
      // .catch(error => {
      //   this.$message.error(error)
      // })
    }
  },
  mounted () {
    this.getList({id: this.id})
  }
}
</script>
<style lang="scss" scoped>
.lh-container {
    // padding: 1rem 2rem;
    .lh-top {
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 100%;
        background-color: #fff;
        padding-bottom: 1rem;
        .lh-header {
            padding: 0 2rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            border-bottom: 1px solid lightgray;
            div:nth-of-type(1){
                font-size: 16px;
            }
        }
    }
}
</style>