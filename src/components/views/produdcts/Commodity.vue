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
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <!--<el-button @click="openDialog" icon="plus" type="primary"></el-button>-->
            <el-button icon="upload2" type="primary" style="margin-left:10px;"></el-button>
            <el-button icon="setting" type="primary"></el-button>
          </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-table
            border
            stripe
            :data="response.data"
            >
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="title" label="栏目名称" width="120"></el-table-column>
            <el-table-column prop="type_key" label="图片" width="130"></el-table-column>
            <el-table-column prop="brief" label="创建时间"></el-table-column>
            <el-table-column prop="sort" label="顺序" width="80"></el-table-column>
            <el-table-column label="启用" width="80">
              <template scope="scope">
                {{ scope.row.active | isOpen }}
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: {},
      response: {
        data: null
      },
      error: null,
      showDialog: false,
      isDialogDisabled: false,
      showStepsDialog: false,
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      },
      selected: {
        id: '',
        title: '',
        type_key: '',
        content: '',
        active: '',
        brief: '',
        sort: '',
        url: ''
      }
    }
  },
  methods: {
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.showFileList({id: this.parentId})
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
    }
  }
}
</script>
