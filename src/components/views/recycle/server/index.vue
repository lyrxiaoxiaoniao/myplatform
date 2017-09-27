<template>
  <div>
    <div class="lh-bottom">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="14">
              <el-button @click="enterAdd" type="primary">添加</el-button>           
              <el-dropdown @command="handleCommand" style="margin-left:10px;">
                <el-button type="primary">
                                   批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="批量删除">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-select v-model="form.audit_state" slot="prepend" placeholder="所有信息" style="width:105px;">
                  <el-option
                    v-for="item in option"
                    :key="item.audit_state"
                    :label="item.label"
                    :value="item.audit_state">
                  </el-option>
                </el-select>
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button type="primary" @click="dialogAdvance = true" style="margin-left:10px;">高级</el-button>
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
            <el-table-column prop="name" label="物业公司名称"></el-table-column>
            <el-table-column prop="title" label="所属街道" width="100"></el-table-column>
            <el-table-column prop="duty_name" label="联系人" width="95"></el-table-column>
            <el-table-column prop="mobile" label="联系电话" width="110"></el-table-column>
            <el-table-column prop="count" label="服务小区数量" width="120"></el-table-column>
            <el-table-column prop="logo" label="营业执照" width="95">
              <template scope="scope">
                <img style="width:58px;height:58px;" :src="scope.row.license" @click="bigImg(scope.row.license)" alt="">
              </template>
            </el-table-column>
            <el-table-column label="审核状态" width="90">
              <template scope="scope">
                <el-switch
                  style="width:60px;"
                  v-model="scope.row.audit_state"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.audit_state,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template scope="scope">
                <el-button @click="edit(scope.row.id)" size="small" icon="edit"></el-button>
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button @click="enterRel(scope.row.id)" size="small" icon="information"></el-button>
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
      <!-- 营业执照弹框 -->
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- 高级搜索模态框 -->
    <el-dialog title="高级搜索" v-model="dialogAdvance">
        <el-form :model="advancedSearch" label-position="right" :label-width="formLabelWidth">
           <el-form-item label="物业公司名称">
             <el-input v-model="advancedSearch.keyword" placeholder="请输入物业公司名称"></el-input>
           </el-form-item>
           <el-form-item label="小区名称">
              <el-input v-model="advancedSearch.name" placeholder="请输入小区名称"></el-input>
            </el-form-item>  
            <el-form-item label="公司地址">
              <el-input v-model="advancedSearch.address" placeholder="请输入公司地址"></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码">
              <el-input v-model="advancedSearch.org_code" placeholder="请输入组织机构代码"></el-input>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="advancedSearch.duty_name" placeholder="请输入联系人"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAdvance = false">取 消</el-button>
            <el-button type="primary" @click="adSearch">确 定</el-button>
        </span>
    </el-dialog>
    </div>
  </div>      
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      formLabelWidth: '100px',
      response: {
        data: null
      },
      dialogAdvance: false,
      adSwitch: true,
      multipleSelection: [],
      ids: [],
      option: [{
        audit_state: null,
        label: '所有信息'
      }, {
        audit_state: '1',
        label: '已审核'
      }, {
        audit_state: '0',
        label: '待审核'
      }],
      form: {
        keyword: '',
        audit_state: ''
      },
      dialogVisible: false,
      dialogImageUrl: '',
      advancedSearch: {
        keyword: '',
        name: '',
        address: '',
        org_code: '',
        duty_name: ''
      }
    }
  },
  methods: {
    // 高级搜索
    adSearch () {
      this.adSwitch = false
      this.dialogAdvance = false
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.advancedSearch
      }
      api.GET(config.server.advanced, data)
      .then(response => {
        if (response.data.errcode === '5000') {
          this.response.data = null
          this.response.count = 0
          this.response.currentPage = 1
          this.response.pageSize = 10
        }
        this.response = this.transformDate(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 进入小区详情页
    edit (id) {
      this.$router.push({ path: '/admin/recycle/server/detail', query: { 'id': id } })
    },
    enterRel(id) {
      this.$store.commit('SET_TOKEN', id)
      this.$router.push({ path: '/admin/recycle/server/relvillage', query: { 'id': id } })
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      if (this.adSwitch) {
        this.getList(data)
      } else {
        this.adSwitch = true
      }
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      if (this.adSwitch) {
        this.getList(data)
      } else {
        this.adSwitch = true
      }
    },
    // 批量处理
    handleCommand (command) {
      if (command === '批量删除') {
        this.deleteType()
      }
    },
    // 表单处理
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
        this.$confirm('请进行正确操作，请优先勾选表单？', '错误', {
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
      this.$confirm('此操作将删除选定小区,是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.server.delete, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    // 获取表单
    getList (data = null) {
      if (data === null) {
        data = {
          currentPage: 1,
          pageSize: 10
        }
      }
      api.GET(config.server.index, data)
      .then(response => {
        if (response.data.errcode === '5000') {
          this.response.data = null
          this.response.count = 0
          this.response.currentPage = 1
          this.response.pageSize = 10
        }
        this.response = this.transformDate(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 操作成功信息提示
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 转换数据
    transformDate (res) {
      res.data.forEach(v => {
        if (v.audit_state === 0) {
          v.audit_state = false
        }
        if (v.audit_state === 1) {
          v.audit_state = true
        }
        v.count = v.rubCommunityTenementVOS[0].count
        v.title = v.rubRegionVO.title
      })
      return res
    },
    // 审核状态处理
    toswitch (active, id) {
      if (active) {
        active = 1
      } else {
        active = 0
      }
      console.log(active, id)
      api.POST(config.server.audit, {id: id, audit_state: active})
      .then(response => {
        this.getList()
        this.onSuccess('启用操作成功！')
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 搜索框
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    enterAdd () {
      this.$router.push('/admin/recycle/server/add')
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.lh-container {
    padding: 1rem 2rem;
    padding-top:0;
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
      .lh-form {
        margin: 1rem 2rem;
      }
    }
    .lh-bottom {
      margin-top: 1rem;
      width: 100%;
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