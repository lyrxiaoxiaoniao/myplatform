<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="8">
          <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
          <el-button slot="append" @click="onSearch" icon="search"></el-button>
          </el-input>
        </el-col>
        <el-button @click="openDialog" icon="plus" type="primary"></el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
    </div>

    <div slot="kobe-table-content" class="kobe-table">
      <el-table
        border
        stripe
        :data="response.data"
        >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="类型名称" width="120"></el-table-column>
        <el-table-column prop="key" label="类型键名" width="130"></el-table-column>
        <el-table-column prop="brief" label="描述"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="url" label="链接"></el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column prop="active" label="状态"></el-table-column>
        <el-table-column 
          width="180"
          label="操作"
          >
          <template scope="scope">
            <el-button size="small" icon="edit"></el-button>
            <el-button size="small" icon="information"></el-button>
            <el-button size="small" icon="delete2"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="selected.title ? selected.title : '活动详情'" v-model="showDialog">
        <el-form :model="selected" label-width="120px">
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item label="分类名称" required>
                <el-input v-model="selected.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" required>
                <el-input v-model="selected.sort"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item label="链接">
                <el-input v-model="selected.url"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" required>
                <el-select v-model="selected.active">
                  <el-option label="开启" value="1"></el-option>
                  <el-option label="关闭" value="2"></el-option>
                </el-select>  
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="selected.brief"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button @click="createType" v-if="dialogType === 'add'">确定</el-button>
          <el-button @click="editType" v-if="dialogType === 'edit'">确定</el-button>
        </div>
      </el-dialog>
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
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-activity-category',
  data () {
    return {
      response: null,
      error: null,
      showDialog: false,
      dialogType: '',
      form: {
        keyword: ''
      },
      selected: {
        id: '',
        title: '',
        content: '',
        active: '',
        brief: '',
        sort: '',
        url: ''
      }
    }
  },
  methods: {
    openDialog () {
      this.showDialog = true
      this.dialogType = 'add'
    },
    closeDialog () {
      this.showDialog = false
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
      api.GET(config.activity.typeList, data)
      .then(response => {
        console.log('2222')
        this.response = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
