<template>
  <el-row class="test-class-container">
    <el-col :span="4">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-col>
    <el-col :span="20">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="15">
              <el-button type="primary" @click="toAddStatus">添加分类</el-button>
              <el-button type="primary" @click="deleteData()">批量删除</el-button>
              <el-button type="primary" @click="refresh" style="margin-right: 10px">刷新</el-button>
            </el-col>
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入内容名称" class="sc-table-header-select">
                <el-button slot="append" class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button type="primary" icon="upload2" style="margin-left: 10px"></el-button>
            <el-button type="primary" icon="setting"></el-button>
          </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-table
            ref="multipleTable"
            border
            stripe
            :data="response.data"
            @selection-change="getCheckedIds">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="title" label="分类名称"></el-table-column>
            <el-table-column prop="created_at" label="分类图片" width="150"></el-table-column>
            <el-table-column prop="click" label="创建时间" width="130"></el-table-column>
            <el-table-column prop="author" label="顺序" width="70"></el-table-column>
            <el-table-column prop="status" label="显示" width="100"></el-table-column>
            <el-table-column 
              width="120"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="toEditStatus(scope.row.id)" size="small" icon="edit"></el-button>
                <el-button @click="deleteData(scope.row.id)" size="small" icon="delete2"></el-button>
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
    </el-col>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
      <el-form :model="testClassInfo" :rules="rules" ref="testClassInfo" label-width="100px">
        <el-form-item label="上级分类：" prop="name">
          <el-input v-model="testClassInfo.name" placeholder="请选择题目类型"></el-input>
        </el-form-item>
        <el-form-item label="分类名称：" prop="detailAddress">
          <el-input v-model="testClassInfo.detailAddress" placeholder="请选择题目难度"></el-input>
        </el-form-item>
        <el-form-item label="分类说明：" prop="mobile">
          <el-input type="textarea" v-model="testClassInfo.mobile" placeholder="请输入题干关键字"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="同级排序：" prop="mobile">
              <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>   
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否显示：" prop="orgCode">
              <el-switch v-model="value1" on-text="开" off-text="关"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分类图片：" prop="dutyName">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row type="flex" justify="end">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" v-show="dialogTitle==='新增分类'" @click="add">保存</el-button>
          <el-button type="primary" v-show="dialogTitle==='编辑分类'" @click="update">保存</el-button>
        </el-row>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-test-class-table',
    data() {
      return {
        response: {
          data: null
        },
        treeData: [],
        form: {
          keyword: ''
        },
        testClassInfo: {},
        dialogTitle: '',
        dialogFormVisible: false,
        selectedIds: [],
        editingId: 0
      }
    },
    computed: {},
    methods: {
      getList (data = {}) {
        api.GET(config.restaurants.index, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      async deleteData (value) {
        // next表示是否进行下一步
        var next = true
        if (!this.selectedIds.length) {
          this.selectIds(value)
        }
        if (!this.selectedIds.length) {
          next = await this.warnSelection(next)
        }
        if (next) {
          next = await this.confirmOperation(next, '此操作将删除该分类，分类删除后，数据无法恢复。如果下属有子分类，将无法被删除。是否继续删除？')
        }
        if (next) {
          console.log('请求删除')
          // api.POST(config.restaurants.delete, {ids: this.selectedIds})
          //   .then(response => {
          //     if (response.status !== 200) {
          //       this.error = response.statusText
          //       return
          //     }
          //     if (response.data.errcode === '0000') {
          //       this.onSuccess('删除成功')
          //       this.selectedIds.length = 0
          //       this.getList()
          //     }
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        }
      },
      add () {
        console.log('添加数据')
      },
      update () {
        console.log('更新数据')
      },
      refresh () {
        this.getList()
      },
      // 搜索按钮
      onSearch () {
        let data = {
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
      transformData (res) {
        res.data.forEach(v => {
          if (v.created_at) {
            v.created_at = this.formatDate(v.created_at)
          }
          if (v.signState === 0) {
            v.signState = '未签约'
          }
          if (v.signState === 1) {
            v.signState = '已签约'
          }
          if (v.checkState === 0) {
            v.checkState = false
          }
          if (v.checkState === 1) {
            v.checkState = true
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
      // 确认是否已选择要操作的数据
      warnSelection (next) {
        return this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          next = false
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 确认是否执行操作
      confirmOperation (next, str) {
        return this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next = true
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      getCheckedIds (value) {
        let arr = value.map(v => {
          return v.id
        })
        this.selectedIds = JSON.parse(JSON.stringify(arr))
      },
      // 单行记录、未选择记录操作生成id数组
      selectIds (value) {
        this.selectedIds.length = 0
        console.log('value为' + value)
        // 单行记录操作传进来的参数是数字，多行记录操作传进来的参数是数组，未选择记录未传参数
        if (value !== undefined) {
          if (value.length === undefined) {
            this.selectedIds.push(value)
          }
        } else {
          this.selectedIds.length = 0
        }
      },
      toAddStatus () {
        this.openDialog('新增分类')
      },
      toEditStatus (id) {
        this.openDialog('编辑分类')
      },
      openDialog (value, id) {
        this.editingId = id
        this.dialogTitle = value
        this.dialogFormVisible = true
      },
      closeDialog () {
        this.dialogFormVisible = false
        this.dialogTitle = ''
      },
      onSuccess (string) {
        this.$notify({
          title: '成功',
          message: string,
          type: 'success'
        })
      }
    },
    components: {
    },
    mounted() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  .test-class-container {
    margin-top: 1.5rem;
  }
</style>