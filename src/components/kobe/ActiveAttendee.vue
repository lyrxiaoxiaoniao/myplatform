<template>
  <el-card class="box-card kobe-active-attendee">
    <div slot="header" class="clearfix">
      <span class="card-title">活动指定参加人员</span>
    </div>
    <div v-for="item, index in data.data">
      <el-form-item
        :label="item.title"
        v-if="item.type === 'switch'"
        >
        <el-switch
          v-model="toggleSwitch"
          on-text="开"
          off-text="关"
          on-color="#13ce66"
          off-color="#ff4949"
          @change="onSwitchChange(index)"
          >
        </el-switch>
      </el-form-item>
      <div v-if="toggleSwitch && userList">
        <el-row type="flex" justify="end">
          <el-button @click="openDialog">添加人员</el-button>
        </el-row>
        <el-table
          class="attendee-user-table"
          border
          stripe
          :data="userList.data">
          <el-table-column
            prop="nickname"
            label="微信用户">
          </el-table-column>
          <el-table-column
            prop="realname"
            label="真实姓名">
          </el-table-column>
          <el-table-column
            prop="company"
            label="单位">
          </el-table-column>
          <el-table-column
            width="80px"
            label="操作"
            >
            <template scop="scope">
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-pagination
              @size-change="handleSelectedSizeChange"
              @current-change="handleSelectedCurrentChange"
              :current-page="userList.currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="userList.pageSize"
              :total="userList.count"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>

    <kobe-table-dialog
      @close="onUserListClose"
      @confirm="onUserListConfirm"
      @sizeChange="onUserListSizeChange"
      @pageChange="onUserListPageChange"
      :tableData="tableData"
      title="用户选择"
      :show="showDialog"
      v-if="tableData"
      >
      <div slot="table">
        <el-table
          border
          stripe
          :data="tableData.data"
          ref="userTable"
          @select="onUserTableSelection"
          @selection-change="onUserSelection">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="nickname"
            label="微信用户">
          </el-table-column>
          <el-table-column
            prop="realname"
            label="真实姓名">
          </el-table-column>
          <el-table-column
            prop="company"
            label="单位">
          </el-table-column>
        </el-table>
      </div>
    </kobe-table-dialog>
  </el-card>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  // active attendee toggle card
  // used for kobe active form
  name: 'kobe-active-attendee',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      showDialog: false,
      cachedUserList: {
        data: []
      },
      userList: {
        count: 0,
        data: [],
        pateSize: 10,
        currentPage: 1
      },
      tableData: null,
      toggleSwitch: true,
      form: [
      ]
    }
  },
  methods: {
    openDialog () {
      this.showDialog = true
    },
    onUserListClose () {
      this.showDialog = false
    },
    onUserListSizeChange (value) {
      this.getUserList(value)
    },
    onUserListPageChange (value) {
      this.getUserList(value)
    },
    onSwitchChange(index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        index: index,
        type_key: obj.type_key,
        options: [{
          title: this.toggleSwitch ? 1 : 0
        }]
      }
      this.form[index] = item
      this.$emit('attendee', this.form)
    },
    onUserTableSelection (selection, row) {
    },
    onUserListConfirm (value) {
      this.showDialog = false
    },
    onUserSelection (value) {
      this.userList.data = value
      this.userList.count = this.userList.data.length
    },
    handleSelectedSizeChange (value) {
    },
    handleSelectedCurrentChange (value) {
    },
    getUserList (data = null) {
      api.GET(config.wxUserListAPI, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.tableData = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>

<style>
.kobe-active-attendee {
  margin-top: 1rem;
}
.attendee-user-table {
  margin-top: 1rem;
}
</style>
