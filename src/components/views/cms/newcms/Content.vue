<template>
  <div class="GD-container">
    <div class="GD-left">
      <el-tree :data="data" :props="defaultProps"
              accordion
              :highlight-current="true"
              node-key="id"
              @node-click="handleNodeClick"
              style="max-height:600px;overflow:auto;">
      </el-tree>
    </div>
    <div class="GD-right">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="14">
              <el-button @click="openDialog" type="primary">添加栏目</el-button>
              <el-button type="primary">刷新</el-button>
              <el-select v-model="operation" placeholder="批量" style="width:150px;" @change="open3">
                <el-option label="移动" value="移动"></el-option>
                <el-option label="删除" value="删除"></el-option>
                <el-option label="复制" value="复制"></el-option>
                <el-option label="审核" value="审核"></el-option>
                <el-option label="通知" value="通知"></el-option>
                <el-option label="提交" value="提交"></el-option>
                <el-option label="推送至专题" value="推送至专题"></el-option>
                <el-option label="保存固顶" value="保存固顶"></el-option>
                <el-option label="推送到微信" value="推送到微信"></el-option>
                <el-option label="群发微信通知" value="群发微信通知"></el-option>
                <el-option label="归档" value="归档"></el-option>
                <el-option label="出档" value="出档"></el-option>
              </el-select>
            </el-col>
            <el-select v-model="form.value" placeholder="所有信息" style="width:120px;">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button @click="showDialog = true" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
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
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="title" label="栏目名称" width="120"></el-table-column>
            <el-table-column prop="type_key" label="访问路径" width="130"></el-table-column>
            <el-table-column prop="brief" label="创建时间"></el-table-column>
            <el-table-column prop="sort" label="顺序" width="80"></el-table-column>
            <el-table-column label="显示" width="80">
              <template scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.state,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column 
              width="100"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button>
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
    <el-dialog title="高级搜索" v-model="showDialog" size="tiny">
        <el-form :model="classData" label-width="80px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="关键字">
                        <el-input v-model="classData.explain"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="栏目">
                        <el-select v-model="classData.region" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="发布时间">
                        <el-col :span="11">
                            <el-date-picker type="datetime" placeholder="选择开始时间" v-model="classData.date1" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">~~</el-col>
                        <el-col :span="11">
                            <el-date-picker type="datetime" placeholder="选择结束时间" v-model="classData.date2" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="文章状态">
                        <el-select v-model="classData.region" placeholder="请选择活动区域" multiple style="width:100%;">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="文章类型">
                        <el-select v-model="classData.region" placeholder="请选择活动区域" multiple style="width:100%;">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="推荐固顶">
                        <el-checkbox-group v-model="classData.type">
                            <el-checkbox label="固顶文章" name="type"></el-checkbox>
                            <el-checkbox label="推荐文章" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="作者">
                        <el-input v-model="classData.explain"></el-input>
                    </el-form-item>
                </el-col>
            </el-row> 
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">取消</el-button>
            <el-button type="primary">搜索</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: [],
      multipleSelection: [],
      option: [{
        value: '1',
        label: '所有信息'
      }, {
        value: '2',
        label: '栏目名称'
      }, {
        value: '3',
        label: '访问路径'
      }],
      options: [{
        value: '1',
        label: '草稿'
      }, {
        value: '2',
        label: '待审核'
      }, {
        value: '3',
        label: '已审核'
      }, {
        value: '4',
        label: '退回'
      }],
      response: {
        data: null
      },
      operation: '',
      classData: {
        selectedOptions: [],
        state: false,
        num1: '',
        region: '',
        date1: '',
        date2: '',
        type: []
      },
      showDialog: false,
      tableData: null,
      form: {
        keyword: '',
        value: ''
      }
    }
  },
  methods: {
    // 树形结构选择
    handleChange (value) {
      console.log(value)
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.showFileList({id: this.parentId})
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
      console.log(this.multipleSelection)
    },
    // 删除表单
    deleteType (id) {
      this.$confirm('是否确认删除该表单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // api.POST(config.removeActivityFieldAPI, {
        //   id: id
        // })
        // .then(response => {
        //   if (response.data.errcode === '0000') {
        //     this.onSuccess('删除成功')
        //   } else {
        //     this.$message.error('发生错误，请重试')
        //   }
        // })
      })
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
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    getList (data = {}) {
      console.log(1)
      // api.GET(config.activity.typeList, data)
      // .then(response => {
      //   this.response = response.data.data
      // })
      // .catch(error => {
      //   this.$message.error(error)
      // })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    open3() {
      this.$confirm('此操作将删除文章', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(({ value }) => {
        this.$notify({
          type: 'success',
          message: '操作成功'
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '取消操作'
        })
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style scoped>
.GD-container{
    height: 100%;
    margin-top: 1.5rem;
    padding: 1rem 2rem;
    position: relative;
}
.GD-left{
  width: 15%;
}
.GD-right{
    width:83%;
    position: absolute;
    top: 0;
    right: 0;
}
</style>

