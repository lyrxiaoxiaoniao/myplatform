<template>
  <div v-if="response" class="sc-user-table">
    <el-form :inline="true" v-if="advancedForm" class="search-form" :model="searchForm">
      <el-row :gutter="10">
        <el-span :xs="4" :sm="6" :md="4" :lg="3">
          <el-form-item label="ID">
            <el-input :model="advancedForm.id"></el-input>
          </el-form-item>
        </el-span>
        <el-span :xs="8" :sm="6" :md="8" :lg="9">
          <el-form-item label="用户名">
            <el-input :model="advancedForm.username"></el-input>
          </el-form-item>
        </el-span>
        <el-span :xs="4" :sm="6" :md="4" :lg="3">
          <el-form-item label="手机号">
            <el-input :model="advancedForm.phone"></el-input>
          </el-form-item>
        </el-span>
        <el-span :xs="8" :sm="6" :md="8" :lg="9">
          <el-form-item label="地址">
            <el-input :model="advancedForm.address"></el-input>
          </el-form-item>
        </el-span>
      </el-row>
      <el-form-item label="创建时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="开始日期" v-model="searchForm.startDate" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="结束日期" v-model="searchForm.endDate" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="sc-table-header">
      <el-row type="flex" justify="space-around">
        <el-col :span="16">
          <el-row type="flex">
            <el-col :span="4">
              <el-select v-model="searchSelect" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disbaled="true">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="searchInput" placeholder="请输入内容" class="sc-table-header-select"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button @click="onSingleSearch" class="sc-table-search-btn" type="primary">搜索</el-button>
              <el-button @click="onAdvancedSearch" type="primary" icon="search">高级搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="end">
            <el-button type="primary" icon="plus" @click="showDialogForm"></el-button>
            <el-button type="primary" icon="upload2"></el-button>
            <el-button type="primary" icon="setting"></el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="sc-table-content">
      <el-table :data="response.data" border stripe :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80" sortable></el-table-column>
        <el-table-column prop="username" label="用户名" width="100"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="120" sortable></el-table-column>
        <el-table-column prop="email" label="Email" width="190"></el-table-column>
        <el-table-column prop="address" label="地址" width="200"></el-table-column>
        <el-table-column
          prop="tags"
          label="标签"
          width="180">
          <template scope="scope">
            <el-tag
              :key="tag"
              v-for="tag in scope.row.tags"
              :closable="true"
              :close-transition="false"
              @close="handleClose(tag,scope.row.tags)">
              {{tag}}

            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="mini"
              @keyup.enter.native="handleInputConfirm(scope.row.id)"
              @blur="handleInputConfirm(scope.row.id)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row.id)">添加标签
            </el-button>
          </template>
        </el-table-column>
        <el-table-column class="user-status-column" @click.native="toggleStatus(scope.row.isLock)" prop="isLock" label="状态" width="70"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" icon="document"></el-button>
            <el-button size="small" icon="edit"></el-button>
            <el-button @click="onDeleteUser(scope.row.id)" size="small" type="danger" icon="delete2"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-table-footer">
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
    <div class="dialog">
      <el-dialog title="新增用户" v-model="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="'120px'">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="'120px'">
            <el-input :label-width="'120px'"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身份证正面照" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身份证反面照" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="用户个人头像" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="用户电话" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="联系地址" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人信息" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="用户类型" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from 'src/config'

export default {
  name: 'sc-user-table',
  data () {
    return {
      searchSelect: '',
      searchInput: '',
      advancedForm: false,
      searchForm: {
        id: '',
        username: '',
        phone: '',
        startDate: '',
        endDate: '',
        address: '',
        createdAt: ''
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      response: null,
      options: [],
      error: null
    }
  },
  computed: {
    userListURL () {
      return config.serverURI + config.userListAPI
    },
    removeUserURL () {
      return config.serverURI + config.removeUserAPI
    }
  },
  components: {},
  methods: {
    handleClose (tag, tagList) {
      //  todo
      tagList.splice(tagList.indexOf(tag), 1)
    },
    showInput (id) {
      this.tableData[parseInt(id) - 1].inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (id) {
      let inputValue = this.tableData[parseInt(id) - 1].inputValue
      if (inputValue) {
        this.tableData[parseInt(id) - 1].tags.push(inputValue)
      }
    },
    onSingleSearch () {
      if (this.searchSelect === '') {
        return
      } else if (this.searchInput === '') {
        return
      }

      // TODO search user
    },
    onAdvancedSearch () {
      this.advancedForm = !this.advancedForm
    },
    handleSizeChange (value) {
      console.log(this.response.currentPage)
      this.getUserLists(value, this.response.currentPage)
    },
    handleCurrentChange (value) {
      this.getUserLists(this.response.pageSize, value)
    },
    toggleStatus (isLock) {
      console.log('toggle')
      console.log(isLock)
    },
    onDeleteUser (id) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // delete user
        axios.post(this.removeUserURL, {
          id: id
        })
        .then(response => {
          console.log(`delete user ${response.data}`)
        })
        .catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    transformData (response) {
      if (this.options.length === 0) {
        for (let value in response.data[0]) {
          let object = {}
          object.value = value
          this.options.push(object)
        }
      }
      response.data.forEach(item => {
        for (let key in item) {
          if (key === 'isLock') {
            item[key] === '0' ? item[key] = '锁定' : item[key] = '正常'
          }
        }
      })
      return response
    },
    getUserLists (pageSize = 10, currentPage = 1) {
      axios.get(this.userListURL, {
        params: {
          pageSize,
          currentPage
        }
      })
      .then(response => {
        console.log(`user lists response ${response}`)

        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          this.transformData(this.response)
          console.log('user list')
          console.log(this.response)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    showDialogForm () {
      this.dialogFormVisible = true
      console.log(1, this.dialogFormVisible)
    }
  },
  mounted () {
    console.log('User Table mounted')
    console.log(config)
    this.getUserLists()
  }
}
</script>
<style scoped>
  .sc-user-table {
    border-top: 1px solid lightgray;
    padding-top: 2rem;
    margin-left: 2rem;
    margin-top: 2rem;
    margin-right: 2rem;
  }

  .sc-table-header {
    margin-bottom: 20px;
  }

  .sc-table-content {
    margin-bottom: 10px;
  }

  .search-form {
    border: 1px solid gray;
    padding: 20px;
    margin-bottom: 10px;
  }

  .sc-table-search-btn {
    margin-left: 20px;
  }

  .user-status-column:hover {
    cursor: pointer;
  }
</style>
