<template>
  <div class="sc-tutorial-category-component">
    <el-row tpye="flex">
      <el-col :span="4">
        <kobe-category-tree
          :title="'课程分类'"
          :data="categories"
          >
        </kobe-category-tree>
      </el-col>
      <el-col :span="20">
        <kobe-table>
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex">
              <el-col :span="12">
                <el-button @click="showAddDialog" type="primary">添加子分类</el-button>
                <el-button type="primary">修改属性</el-button>
                <el-button type="primary">更多操作</el-button>
                <el-button @click="onRefresh" type="primary">刷新</el-button>
              </el-col>
              <el-select></el-select>
              <el-col :span="8">
                <el-input>
                  <el-button slot="append" icon="search"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-dialog title="新增分类" v-model="addDialogVisiable">
              <el-form :model="addForm" label-width="120px" :rules="rules">
                <el-form-item label="上级分类">
                  <el-cascader
                    expand-trigger="hover"
                    :options="categories"
                    @change="handleCatlgChange"
                    v-model="selectedCategory"
                    >
                  </el-cascader>
                </el-form-item>
                <el-form-item label="分类名称">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-row type="flex">
                  <el-form-item label="分类排序">
                    <el-input-number></el-input-number>
                  </el-form-item>
                  <el-form-item label="是否启用">
                    <el-switch v-model="addForm.status"></el-switch>
                  </el-form-item>
                </el-row>
                <el-form-item label="分类说明">
                  <el-input type="textarea" v-model="addForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="分类图片">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadAction"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="closeAddDialog">取消</el-button>   
                <el-button @click="onAddCategory" type="primary">确定</el-button>   
              </div>
            </el-dialog>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              v-if="response"
              border
              stripe
              :data="response.data"
              >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="name" label="分类名称"></el-table-column>
              <el-table-column label="图片">
                <template scope="scope">
                  <img :src="scope.row.lb_img" alt="">
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="150">
                <template scope="scope">
                  {{ scope.row.create_at | toDateTime }}
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="顺序" width="80"></el-table-column>
              <el-table-column label="启用">
                <template scope="scope">
                  <el-switch v-model="scope.row.status" @click="toggleSwicth"></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                width="120"
                label="操作"
                >
                <template scope="scope">
                  <el-button size="small" icon="delete2"></el-button>
                  <el-button size="small" icon="edit"></el-button>
                </template>
              </el-table-column>
            </el-table>
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
  name: 'sc-tutorial-category',
  data () {
    return {
      categoryID: 14,
      error: null,
      response: null,
      addDialogVisiable: false,
      uploadAction: config.serverURI + config.uploadFilesAPI,
      imageUrl: '',
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        brief: [{ required: true, message: '请输入分类说明', trigger: 'blur' }]
      },
      addForm: {
        catgr_id: 14,
        p_id: '',
        name: '',
        brief: '',
        sort: '',
        status: true,
        lb_img: ''
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      categories: [],
      selectedCategory: []
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleCatlgChange (value) {
    },
    onAddCategory () {
      this.addForm.p_id = this.selectedCategory.shift()
      this.addDialogVisiable = false
      this.addForm.status = this.addForm.status ? 1 : 0
      api.POST(config.tutorial.categoryAdd, this.addForm)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          })
          this.getCategoryList()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    toggleSwicth (value) {
      console.log(value)
    },
    showAddDialog () {
      this.addDialogVisiable = true
    },
    closeAddDialog () {
      this.addDialogVisiable = false
    },
    onRefresh () {
      this.getCategoryList()
    },
    handleSizeChange (value) {
    },
    handleCurrentChange (value) {
    },
    transformTreeData (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id
        category.label = item.name
        if (item.children && item.children.length !== 0) {
          const children = this.transformTreeData(item.children)
          category.children = children
        } else {
          category.children = []
        }
        object.push(category)
      })

      return object
    },
    transformListData (data) {
      data.data.forEach(item => {
        item.status = !!item.status
      })
      return data
    },
    getCategoryList (data = null) {
      api.GET(config.tutorial.category, {
        catgr_id: this.categoryID,
        p_id: 0,
        ...data
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.transformListData(response.data.data)
          const data = this.transformTreeData(this.response.data)
          const root = {
            label: '根级分类',
            children: data,
            value: 0
          }
          this.categories = []
          this.categories.unshift(root)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
