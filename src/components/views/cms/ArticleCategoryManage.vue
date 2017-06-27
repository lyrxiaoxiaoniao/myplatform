<template>
  <div class="sc-article-category-manage">
    <el-button class="category-add-button" @click="addMenu" type="primaty">新增文章板块</el-button>
    <el-tree :data="data" :props="defaultProps" node-key="id" accordion :expand-on-click-node="true" :render-content="renderContent">
    </el-tree>
    <el-dialog title="提示" v-model="deleteVisible" size="tiny">
      <span>确认要删除该板块吗？(将删除所有的子板块)</span>
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
        <el-form-item label="板块名称" required>
          <el-input v-model="formData.name" placeholder="示例:admin-rules"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" required>
          <el-input v-model="formData.displayName"></el-input>
        </el-form-item>
        <el-form-item label="板块描述">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>
        <!--<el-form-item label="图标选择">
                    <el-input v-model="formData.logo"></el-input>
                  </el-form-item>-->
        <el-form-item label="同级排序">
          <el-input v-model="formData.sort"></el-input>
        </el-form-item>
        <el-form-item label="访问路径">
          <el-input v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item label="图标选择">
          <el-upload class="upload" ref="upload" :action="uploadUrl" :on-success="uploadSuccess" :on-remove="uploadRemove" :file-list="fileList" list-type="picture">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-row type="flex" justify="space-around">
          <el-button type="primary" @click="addSubmit" size="large">提交</el-button>
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
        label: 'displayName'
      },
      newCategory: '',
      newMenu: '',
      deleteVisible: false,
      addVisible: false,
      deletedId: '',
      options: [],
      props: {
        children: 'children',
        label: 'displayName',
        value: 'id'
      },
      fileList: [],
      formData: {
        id: 0,
        name: '',
        displayName: '',
        description: '',
        parentId: 0,
        sort: '',
        url: '',
        logo: '',
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
      uploadUrl: config.serverURI + config.uploadImgAPI
    }
  },
  methods: {
    uploadSuccess(res, file, fileList) {
      this.fileList = [file]
      this.formData.logo = res.data[0]
    },
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
        if (key === 'id' || key === 'parentId') {
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
      api.GET(config.articleCatlgAPI)
        .then(res => {
          let obj = res.data.data
          this.iteration(obj)
          obj.push({ id: 0, displayName: '根级菜单', label: '根级菜单', value: 0 })
          this.options = obj
        })
    },
    addMenu() {
      this.clearFormData()
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
        this.formData.parentId = node.parent.data.id
      }
      this.formData.displayName = data.displayName
      this.formData.name = data.name
      this.formData.id = data.id
      this.formData.url = data.url
      this.formData.description = data.description
      this.formData.logo = data.logo
      this.formData.sort = data.sort
      this.fileList[0] = {name: this.formData.displayName, url: this.formData.logo}
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
      api.GET(config.articleCatlgAPI)
        .then(res => {
          this.data = res.data.data
        })
    },
    deleteCategory() {
      api.POST(config.removeArticleCatlgAPI, { id: this.deletedId })
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
      this.formData.parentId = value[value.length - 1]
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span style="float: right; margin-right: 20px">
            <el-button size="mini" on-click={(e) => this.edit(e, node, store, data)}>编辑</el-button>
            <el-button size="mini" on-click={(e) => this.remove(e, store, data)}>删除</el-button>
          </span>
        </span>)
    },
    addSubmit() {
      let obj = {}
      obj.name = this.formData.name
      obj.displayName = this.formData.displayName
      obj.parentId = this.formData.parentId
      obj.description = this.formData.description
      obj.sort = this.formData.sort
      obj.url = this.formData.url
      obj.logo = this.formData.logo
      if (this.isEditing) {
        obj.id = this.formData.id
      }

      if (obj.parentId === '') {
        this.$notify.error({
          title: '错误',
          message: '请提交必须参数'
        })
        this.isClicked = false
        return
      }

      let url = this.isEditing ? config.editArticleCatlgAPI : config.addArticleCatlgAPI
      api.POST(url, obj)
        .then(res => {
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
.sc-article-category-manage {
  margin-top: 2rem;
  border-top: 1px solid lightgray;
  padding: 2rem 4rem;
}

.category-add-button {
  margin-bottom: 1rem;
}
</style>
