<template>
  <div class="sc-tutorial-manage-component">
    <el-row type="flex">
      <el-col :span="4">
        <kobe-category-tree
          :title="'课程分类'"
          >
        </kobe-category-tree>
      </el-col>

      <el-col :span="20">
        <kobe-table v-if="response" class="sc-tutorial-manage-table">
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex">
              <el-col :span="17">
                <el-button type="primary" @click="onPublishTutorial">发布课程</el-button>
                <el-button type="primary" @click="onRefresh">刷新</el-button>
                <el-select clearable v-model="mutilAction" placeholder="批量操作">
                  <el-option
                    v-for="item in mutilActionOptions"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
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
              >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="title" label="课程名称"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column label="创建时间" width="150">
                <template scope="scope">
                  {{ scope.row.created_at | toDateTime }}
                </template>
              </el-table-column>
              <el-table-column prop="click" label="点击"></el-table-column>
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
                  <el-button @click="onEdit(scope.row)" size="small" icon="edit"></el-button>
                  <el-button @click="onShow(scope.row.id)" size="small" icon="information"></el-button>
                  <el-button @click="onDelete(scope.row.id)" size="small" icon="delete2"></el-button>
                </template>
              </el-table-column>
            </el-table>
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
      searchDialogVisiable: false,
      mutilAction: '',
      mutilActionOptions: [{
        label: '删除',
        value: 'del'
      }, {
        label: '移动',
        value: 'move'
      }, {
        label: '设置为推荐课程',
        value: 'recommand'
      }, {
        label: '设置为置顶课程',
        value: 'upmost'
      }, {
        label: '上线',
        value: 'on'
      }, {
        label: '下线',
        value: 'offline'
      }],
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
    onRefresh () {
      this.getClassList()
    },
    onChangeSwitch (data) {
      api.POST(config.tutorial.toggleActive, {
        ids: [data.id],
        active: data.active === 1
      })
      .then(response => {
        if (response.data.errcode === '0000') {
        } else {
          const data = {
            pageSize: this.response.pageSize,
            currentPage: this.response.currentPage,
            ...this.advancedForm
          }
          this.getClassList(data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
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
        // TODO
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        const data = {
          pageSize: this.response.pageSize,
          currentPage: this.response.currentPage,
          ...this.advancedForm
        }
        this.getClassList(data)
      })
    },
    onEdit (value) {
    },
    handleSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.advancedForm
      }
      this.getClassList(data)
    },
    handleCurrentChange (value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.advancedForm
      }
      this.getClassList(data)
    },
    transformData (data) {
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
          }
        })
        arr.push(obj)
      })
      return arr
    },
    getClassList (data = null) {
      api.GET(config.tutorial.class, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          this.response.data = this.transformData(this.response.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getClassList()
  }
}
</script>

<style>
</style>
