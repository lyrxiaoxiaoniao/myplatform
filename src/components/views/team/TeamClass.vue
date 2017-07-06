<template>
  <div class="sc-report-category-manage">
    <el-button class="category-add-button" @click="addMenu" type="primaty">添加团队组织</el-button>
    <el-tree :data="data" :props="defaultProps" node-key="id" accordion :expand-on-click-node="true" :render-content="renderContent">
    </el-tree>
    <el-dialog title="提示" v-model="deleteVisible" size="tiny">
      <span>确认要删除该分类吗？(将删除所有的子类)</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteCategory">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="isEditing? '编辑' : '新增'" v-model="addVisible" size="tiny">
      <el-form labelPosition="right" label-width="90px">
        <el-form-item label="父级板块" required>
          <el-cascader :options="options" :change-on-select="true" :props="props" @change="handleChange" v-model="formData.valueList" v-if="!isEditing"></el-cascader>
          <el-input v-else v-model="formData.parentName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" required>
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="分类排序">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>
        <el-form-item label="分类说明">
          <el-input type="textarea" v-model="formData.sort"></el-input>
        </el-form-item>
        <el-row type="flex" justify="space-around">
          <el-button type="primary" @click="addSubmit" size="large" :disabled="isClicked">提交</el-button>
          <el-button @click="back" size="large">返回</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      newCategory: '',
      newMenu: '',
      deleteVisible: false,
      addVisible: false,
      deletedId: '',
      options: [],
      props: {
        children: 'children',
        label: 'name'
      },
      formData: {
        id: 0,
        name: '',
        description: '',
        catlgId: '',
        sort: '',
        valueList: [],
        parentName: ''
      },
      rules: {
        valueList: [
          { required: true, message: '请选择父级节点', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入节点名', trigger: 'blur' }
        ]
      },
      isClicked: false
    }
  },
  methods: {
    iteration(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] instanceof Object) {
            if (obj[key].length === 0) {
              obj[key] = null
            } else {
              this.iteration(obj[key])
            }
          }
        }
      }
    },
    clearFormData() {
      let obj = this.formData
      for (let key in obj) {
        if (key === 'id') {
          obj[key] = 0
        } else if (key === 'valueList') {
          obj[key] = []
        } else {
          obj[key] = ''
        }
      }
      this.formData = obj
    },
    getList() {
      api.GET(config.caseCatlgAPI)
        .then(res => {
          let obj = res.data.data
          this.iteration(obj)
          obj.push({ id: 0, name: '根级菜单', label: '根级菜单', value: 0 })
          this.options = obj
        })
    },
    addMenu() {
      this.clearFormData()
      this.getList()
      this.isEditing = false
      this.addVisible = true
    },
    edit(e, node, store, data) {
      e.stopPropagation()
      this.isEditing = true
      if (Array.isArray(node.parent.data)) {
        this.formData.parentName = '根级目录'
      } else {
        this.formData.parentName = node.parent.data.name
        this.formData.catlgId = node.parent.data.id
      }
      this.formData.name = data.name
      this.formData.id = data.id
      this.formData.description = data.description
      this.formData.sort = data.sort
      this.addVisible = true
    },
    remove(e, store, data) {
      e.stopPropagation()
      this.deleteVisible = true
      this.deletedId = data.id
    },
    back() {
      this.isEditing = true
      this.addVisible = false
    },
    getData() {
      api.GET(config.caseCatlgAPI)
        .then(res => {
          this.data = res.data.data
        })
    },
    deleteCategory() {
      api.POST(config.editCaseCatlgAPI, { id: this.deletedId })
        .then(res => {
          if (res.data.errcode === '0000') {
            this.deleteVisible = false
            this.$notify({
              title: '删除',
              message: '删除成功',
              type: 'success'
            })
            this.getData()
            this.getList()
          }
        })
    },
    handleChange(value) {
      this.formData.catlgId = value[value.length - 1]
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span style="float: right; margin-right: 20px">
            <el-button size="mini" on-click={(e) => this.edit(e, node, store, data)}>修改</el-button>
            <el-button size="mini" on-click={(e) => this.remove(e, store, data)}>删除</el-button>
          </span>
        </span>)
    },
    addSubmit() {
      this.isClicked = true
      let obj = {}
      obj.catlgId = this.formData.catlgId
      obj.name = this.formData.name
      obj.description = this.formData.description
      obj.sort = this.formData.sort
      if (this.isEditing) {
        obj.id = this.formData.id
      }
      let url = this.isEditing ? config.updateCaseCatlgAPI : config.addCaseCatlgAPI

      if (obj.catlgId === '') {
        this.$notify.error({
          title: '错误',
          message: '请提交必须参数'
        })
        this.isClicked = false
        return
      }
      if (!obj.name) {
        this.$notify.error({
          title: '错误',
          message: '请提交必须参数'
        })
        this.isClicked = false
        return
      }

      api.POST(url, obj)
        .then(res => {
          this.isClicked = false
          if (res.status === 200 && res.data.errcode === '0000') {
            if (this.isEditing) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
              this.isEditing = false
              this.addVisible = false
              this.getData()
              this.getList()
            } else {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              })
              this.isEditing = false
              this.addVisible = false
              this.getData()
              this.getList()
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '提交失败，请重试'
            })
          }
        })
        .catch(err => {
          this.isClicked = false
          if (err) {
            this.$notify.error({
              title: '错误',
              message: '提交失败，请重试'
            })
          }
        })
    }
  },
  mounted() {
    this.getData()
    this.getList()
  }
}
</script>

<style scoped>
.sc-report-category-manage {
  padding: 2rem 4rem;
}

.category-add-button {
  margin-bottom: 1rem;
}
</style>
