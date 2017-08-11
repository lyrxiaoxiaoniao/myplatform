<template>
  <div class="sc-tutorial-manage-component">
    <el-row type="flex">
      <el-col :span="4">
        <el-tree
          :default-expanded-keys="['0']"
          node-key="value"
          highlight-current
          :data="categories"
          @node-click="onClickNode"
          >
        </el-tree>
      </el-col>

      <el-col :span="20">
        <kobe-table v-if="response" class="sc-tutorial-manage-table">
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex">
              <el-col :span="17">
                <el-button type="primary" @click="onPublishTutorial">发布课程</el-button>
                <el-dropdown @command="handleDropDown">
                  <el-button type="primary">
                    批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                    <el-dropdown-item command="move">移动</el-dropdown-item>
                    <el-dropdown-item command="recommand">设置为推荐课程</el-dropdown-item>
                    <el-dropdown-item command="uppermost">设置为置顶课程</el-dropdown-item>
                    <el-dropdown-item command="online">上线</el-dropdown-item>
                    <el-dropdown-item command="offline">下线</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" @click="onRefresh">刷新</el-button>
              </el-col>
              <el-col :span="6">
                <el-input>
                  <el-button slot="append" icon="search"></el-button>
                </el-input>
              </el-col>
              <el-button @click="openSearchDialog" icon="search">高级</el-button>
            </el-row>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              border
              stripe
              :data="response.data"
              @selection-change="handleSelectionChange"
              >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="ID" width="70"></el-table-column>
              <el-table-column prop="title" label="课程名称" min-width="160"></el-table-column>
              <el-table-column prop="type" label="类型" width="100"></el-table-column>
              <el-table-column label="创建时间" width="150">
                <template scope="scope">
                  {{ scope.row.created_at | toDateTime }}
                </template>
              </el-table-column>
              <el-table-column prop="click_count" label="点击"></el-table-column>
              <el-table-column prop="speaker" label="主讲"></el-table-column>
              <el-table-column label="状态">
                <template scope="scope">
                  <el-switch
                    on-text="开"
                    off-text="关"
                    v-model="scope.row.active"
                    @change="onChangeSwitch(scope.row)"
                    >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column 
                width="180"
                label="操作"
                >
                <template scope="scope">
                  <el-button @click="onEdit(scope.row.id)" size="small" icon="edit"></el-button>
                  <el-button @click="onShow(scope.row.id)" size="small" icon="information"></el-button>
                  <el-button @click="onDelete(scope.row.id)" size="small" icon="delete2"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog title="移动课程" v-model="moveDialogVisiable">
              <el-form :model="moveForm" label-width="120px">
                <el-form-item label="上级分类">
                  <el-cascader
                    clearable
                    change-on-select
                    expand-trigger="hover"
                    :options="categories"
                    v-model="moveForm.id"
                    >
                  </el-cascader>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="closeMoveForm">取消</el-button>
                <el-button @click="onMoveTutorial">确定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="高级搜索" v-model="searchDialogVisiable">
              <el-form :model="advancedForm" label-width="120px">
                <el-form-item label="关键字">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item label="分类">
                  <el-select></el-select>
                </el-form-item>
                <el-form-item label="发布时间">
                  <el-row type="flex">
                    <el-date-picker></el-date-picker>
                    <el-date-picker></el-date-picker>
                  </el-row>
                </el-form-item>
                <el-form-item label="课程类型">
                  <el-checkbox-group>
                    <el-checkbox label="文本课程"></el-checkbox>
                    <el-checkbox label="视频课程"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="推荐置顶">
                  <el-checkbox-group>
                    <el-checkbox label="置顶课程"></el-checkbox>
                    <el-checkbox label="推荐课程"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否有效">
                  <el-checkbox-group>
                    <el-checkbox label="有效上线"></el-checkbox>
                    <el-checkbox label="失效下线"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="讲师">
                  <el-input></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="closeSearchForm">取消</el-button>
                <el-button @click="onAdvancedSearch">搜索</el-button>
              </div>
            </el-dialog>
          </div>
          <div slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-pagination
                  v-if="response"
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
    </el-row>

  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-manage',
  data () {
    return {
      error: null,
      response: null,
      tableSelection: [],
      searchDialogVisiable: false,
      moveDialogVisiable: false,
      categoryID: 14,
      categories: null,
      selectedNode: 0,
      moveForm: {
        id: []
      },
      advancedForm: {
      }
    }
  },
  methods: {
    openSearchDialog () {
      this.searchDialogVisiable = true
    },
    onAdvancedSearch () {
    },
    closeSearchForm () {
      this.searchDialogVisiable = false
    },
    closeMoveForm () {
      this.moveDialogVisiable = false
    },
    onRefresh () {
      this.getClassList()
    },
    onMoveTutorial () {
      if (this.moveForm.id.length === 0) {
        this.$message.info('请选择需要移动到的分类')
        return
      }
      let arr = []
      this.tableSelection.forEach(item => {
        arr.push(item.id)
      })
      this.moveForm.id.shift()
      this.moveDialogVisiable = false
      api.POST(config.tutorial.move, {
        ids: arr,
        p_ids: this.moveForm.id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '移动成功',
            type: 'success'
          })
          const data = {
            id: this.selectedNode,
            pageSize: this.response.pageSize,
            currentPage: this.response.currentPage,
            ...this.advancedForm
          }
          this.getClassList(data)
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onChangeSwitch (data) {
      api.POST(config.tutorial.toggleActive, {
        ids: [data.id],
        active: data.active ? 1 : 0
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        }
        const data = {
          id: this.selectedNode,
          pageSize: this.response.pageSize,
          currentPage: this.response.currentPage,
          ...this.advancedForm
        }
        this.getClassList(data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    handleSelectionChange (val) {
      this.tableSelection = val
    },
    multiOnLine () {
      let arr = []
      this.tableSelection.forEach(item => {
        arr.push(item.id)
      })
      api.POST(config.tutorial.toggleActive, {
        ids: arr,
        active: 1
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        }
        const data = {
          id: this.selectedNode,
          pageSize: this.response.pageSize,
          currentPage: this.response.currentPage,
          ...this.advancedForm
        }
        this.getClassList(data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    multiOffLine () {
      let arr = []
      this.tableSelection.forEach(item => {
        arr.push(item.id)
      })
      api.POST(config.tutorial.toggleActive, {
        ids: arr,
        active: 0
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
        }
        const data = {
          id: this.selectedNode,
          pageSize: this.response.pageSize,
          currentPage: this.response.currentPage,
          ...this.advancedForm
        }
        this.getClassList(data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    handleDropDown (val) {
      if (!this.tableSelection.length) {
        this.$message.info('请选择需要操作的数据')
        return
      }
      switch (val) {
        case 'delete':
          let arr = []
          this.tableSelection.forEach(item => {
            arr.push(item.id)
          })
          this.onDelete(arr)
          break
        case 'move':
          this.moveDialogVisiable = true
          break
        case 'recommand':
          break
        case 'uppermost':
          break
        case 'online':
          this.multiOnLine()
          break
        case 'offline':
          this.multiOffLine()
          break
      }
    },
    onPublishTutorial () {
      this.$router.push({
        path: '/admin/tutorial/publish'
      })
    },
    onShow (id) {
      this.$router.push({
        path: '/admin/tutorial/info',
        query: {
          id: id
        }
      })
    },
    onDelete (value) {
      this.$confirm('此操作将会删除选定的课程,课程将会进入课程回收站。是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = value.length ? [...value] : [value]
        api.POST(config.tutorial.delete, {
          ids: data
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const data = {
              id: this.selectedNode,
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.advancedForm
            }
            this.getClassList(data)
          }
        })
      })
    },
    onEdit (id) {
      this.$router.push({
        path: '/admin/tutorial/edit',
        query: {
          id: id
        }
      })
    },
    handleSizeChange (value) {
      const data = {
        id: this.selectedNode,
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.advancedForm
      }
      this.getClassList(data)
    },
    handleCurrentChange (value) {
      const data = {
        id: this.selectedNode,
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.advancedForm
      }
      this.getClassList(data)
    },
    transformData (data) {
      if (!data) return
      let arr = []
      data.forEach(item => {
        let obj = {
          ...item,
          active: item.active === 1
        }
        item.attributes.forEach(attr => {
          switch (attr.attr_key) {
            case 'activity_property_tutorial_title':
              obj.title = attr.attr_value
              break
            case 'activity_property_tutorial_content':
              obj.content = attr.attr_value
              break
            case 'activity_property_tutorial_speaker':
              obj.speaker = attr.attr_value
              break
            case 'activity_property_tutorial_digest':
              obj.digest = attr.attr_value
              break
            case 'activity_property_tutorial_type':
              obj.type = attr.attr_value
              break
          }
        })
        arr.push(obj)
      })
      return arr
    },
    transformTreeData (data) {
      if (!data) return
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id.toString()
        category.label = item.name
        if (item.children && item.children.length !== 0) {
          const children = this.transformTreeData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    },
    onClickNode (node) {
      this.selectedNode = node.value
      const data = {
        id: node.value,
        pageSize: this.response.pageSize,
        currentPage: 1
        // searchForm
      }
      this.getClassList(data)
    },
    getCategoryList () {
      api.GET(config.tutorial.category, {
        catgr_id: this.categoryID,
        p_id: 0
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          const data = this.transformTreeData(response.data.data.data)
          const root = [{
            value: '0',
            label: '根级分类',
            children: data
          }]
          this.categories = [...root]
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getClassList (data = null) {
      api.GET(config.tutorial.class, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          const data = this.transformData(response.data.data.data)
          this.response = response.data.data
          this.response.data = data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getClassList()
    this.getCategoryList()
  }
}
</script>

<style>
.sc-tutorial-manage-component .el-tree {
  margin-top: 1rem;
  margin-left: 1rem;
}
</style>
