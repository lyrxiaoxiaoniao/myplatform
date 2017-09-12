<template>
    <div class="lh-container">
		<div class="lh-top">
            <div class="lh-header">
                <div>车辆信息</div>
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
                            <el-button @click="addCar" type="primary">添 加</el-button>
                            <el-button @click="handleCommand" type="primary">批量删除</el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                            <el-button slot="append" @click="onSearch" icon="search"></el-button>
                            </el-input>
                        </el-col>
                          <el-button icon="search" type="primary" style="margin-left:10px;">高级</el-button>
                          <el-button icon="upload2" type="primary"></el-button>
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
                        <el-table-column prop="number" label="车牌号" width="150"></el-table-column>
                        <el-table-column prop="brand" label="品牌" width="150"></el-table-column>
                        <el-table-column prop="gpsSlug" label="GPS标识" width="150"></el-table-column>
                        <el-table-column prop="companyName" label="所属清运公司"></el-table-column>
                        <!-- <el-table-column prop="id" label="线路"></el-table-column> -->
                        <el-table-column prop="weight" label="车重(kg)" width="120"></el-table-column>
                        <el-table-column prop="maxWeight" label="最大承载(kg)" width="120"></el-table-column>
                        <el-table-column width="140" label="操作">
                        <template scope="scope">
                            <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2" title="删除"></el-button>
                            <el-button @click="editCar(scope.row)" size="small" icon="edit" title="修改"></el-button>
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
                   <el-form :model="selected" label-width="80px" ref="selected">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="车牌号">
                          <el-input v-model="selected.number" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="车辆品牌">
                          <el-input v-model="selected.brand" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="GPS标识">
                          <el-input v-model="selected.gpsSlug" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="所属公司">
                          <el-input v-model="selectedEdit.companyName" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="12">
                        <el-form-item label="车重"
                            prop="weight"
                            :rules="[
                              { required: true, message: '车重不能为空,单位： kg'},
                              { type: 'number', message: '车重必须为数字值,单位： kg'}
                            ]">
                           <el-input v-model.number="selected.weight" placeholder="单位： kg"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="12">
                        <el-form-item label="最大承重"
                            prop="maxWeight"
                            :rules="[
                              { required: true, message: '车重不能为空,单位： kg'},
                              { type: 'number', message: '车重必须为数字值,单位： kg'}
                            ]">
                          <el-input v-model.number="selected.maxWeight" placeholder="单位： kg"></el-input>
                        </el-form-item>
                      </el-col>  
                      <!-- <el-col :span="24">
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
                      </el-col> -->
                    </el-row>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDialogadd">取 消</el-button>
                    <el-button @click="addConfirm('selected')" type="primary">添 加</el-button>
                  </span>
                </el-dialog>
                <el-dialog title="修改车辆" v-model="showDialogEdit">
                   <el-form :model="selectedEdit" label-width="80px" ref="selectedEdit">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="车牌号">
                          <el-input v-model="selectedEdit.brand" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="车辆品牌">
                          <el-input v-model="selectedEdit.number" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="GPS标识">
                          <el-input v-model="selectedEdit.gpsSlug" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="24">
                        <el-form-item label="所属公司">
                          <el-input v-model="selectedEdit.companyName" placeholder="请输入"></el-input>
                        </el-form-item>
                      </el-col>
                       <el-col :span="12">
                        <el-form-item label="车重"
                            prop="weight"
                            :rules="[
                              { required: true, message: '车重不能为空,单位： kg'},
                              { type: 'number', message: '车重必须为数字值,单位： kg'}
                            ]">
                           <el-input v-model.number="selectedEdit.weight" placeholder="单位： kg"></el-input>
                        </el-form-item>
                      </el-col>  
                      <el-col :span="12">
                        <el-form-item label="最大承重"
                            prop="maxWeight"
                            :rules="[
                              { required: true, message: '车重不能为空,单位： kg'},
                              { type: 'number', message: '车重必须为数字值,单位： kg'}
                            ]">
                          <el-input v-model.number="selectedEdit.maxWeight" placeholder="单位： kg"></el-input>
                        </el-form-item>
                      </el-col>  
                      <!-- <el-col :span="8">
                        <el-form-item label="行车路线">
                          <el-select v-model="selectedEdit.businessType" class="fullwidth" placeholder="请选择业务类型">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col> -->
                    </el-row>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDialogedit">取消</el-button>
                    <el-button @click="editConfirm('selectedEdit')" type="primary">修改</el-button>
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
      showDialogEdit: false,
      selected: {
        companyName: '',
        gpsSlug: '',
        maxWeight: null,
        number: '',
        weight: null,
        brand: ''
      },
      selectedEdit: {
        companyName: '',
        gpsSlug: '',
        maxWeight: null,
        number: '',
        weight: null,
        brand: ''
      },
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
    closeDialogadd () {
      this.showDialog = false
    },
    closeDialogedit () {
      this.showDialogEdit = false
    },
    addCar () {
      Object.keys(this.selected).forEach(k => {
        this.selected[k] = null
      })
      this.showDialog = true
    },
    editCar (data) {
      this.selectedEdit = {
        ...this.selectedEdit,
        ...data
      }
      console.log(this.selectedEdit, 11111111111)
      this.showDialogEdit = true
    },
    addConfirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.POST(config.recovery.carAdd, this.selected)
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('添加成功')
              this.closeDialogadd()
            } else {
              this.$message.error(response.data.errmsg)
            }
          })
        } else {
          return false
        }
      })
    },
    editConfirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.POST(config.recovery.carEdit, this.selectedEdit)
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('修改成功')
              this.showDialogEdit = true
            } else {
              this.$message.error(response.data.errmsg)
            }
          })
        } else {
          return false
        }
      })
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
        api.POST(config.recovery.carRemove, {
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
      api.GET(config.recovery.carIndex, data)
      .then(response => {
        this.response = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
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