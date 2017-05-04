<template>
  <div class="sc-table">
    <div class="sc-table-header">
      <el-row type="flex" justify="space-around">
        <el-col :span="16">
          <el-row type="flex">
            <el-col :span="4">
              <el-select v-model="value" placeholder="请选择">
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
              <el-input v-model="input" placeholder="请输入内容" class="sc-table-header-select"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button class="sc-table-search-btn" type="primary">搜索</el-button>
              <el-button type="primary" icon="search">高级搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="end">
            <el-button type="primary" icon="plus"></el-button>
            <el-button type="primary" icon="upload2"></el-button>
            <el-button type="primary" icon="setting"></el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div v-if="response" class="sc-table-content">
      <el-table :data="response.data" border stripe :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80" sortable></el-table-column>
        <el-table-column prop="createdAt" label="创建日期" width="150" sortable></el-table-column>
        <el-table-column prop="username" label="用户名" width="100"></el-table-column>
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
              @blur="handleInputConfirm(scope.row.id)"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row.id)">+ New Tag

            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small">详情</el-button>
            <el-button size="small">修改</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-table-footer">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-pagination
            :current-page="response.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            :total="response.count"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'sc-user-table',
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      input: '',
      contentTotal: 1000,
      userListURL: 'http://192.168.1.2:8080/admin/user/index',
      response: null,
      error: null
    }
  },
  computed: {
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
      this.tableData[parseInt(id) - 1].inputVisible = false
      this.tableData[parseInt(id) - 1].inputValue = ''
    },
    createdTime (time) {
      console.log(new Date(time))
      return '111'
    },
    getUserLists () {
      axios.get('http://192.168.1.2:8080/admin/user/index')
      .then(response => {
        console.log(response)

        if (response.status !== 200) {
          this.error = response.statusText
          return
        }

        if (response.data.errcode === '0000') {
          this.response = response.data.data
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  mounted () {
    console.log('222')
    this.getUserLists()
  }
}
</script>
<style scoped>
.sc-table {
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
.sc-table-search-btn {
  margin-left: 20px;
}
</style>
