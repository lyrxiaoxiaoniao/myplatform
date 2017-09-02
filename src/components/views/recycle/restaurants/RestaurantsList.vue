<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="15">
          <el-button type="primary" @click="openDialog('新增专题')">添加</el-button>
        </el-col>
        <el-col :span="2" style="margin-right:10px;">
          <el-select v-model="selectValue" placeholder="所有信息" style="width:105px;">
            <el-option
              v-for="item in selectCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.keyword" placeholder="" class="sc-table-header-select">
            <el-button slot="append" class="sc-table-search-btn" @click="onKeywordSearch" icon="search"></el-button>
          </el-input>
        </el-col>
        <el-button @click="openDialog('高级搜索')" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
        <el-button type="primary" icon="upload2"></el-button>
        <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table 
        :data="response.data"
        border
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="display_name" label="专题名称"></el-table-column>
        <el-table-column prop="articleCount" label="文章数" width="120"></el-table-column>
        <el-table-column prop="sort" label="排序" width="120"></el-table-column>
        <el-table-column prop="is_recommend" label="是否推荐" width="120">
          <template scope="scope">
            <el-switch on-text="开" off-text="关" v-model="scope.row.is_recommend" @change="toggleSwicth(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template scope="scope">
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
            <el-button size="small" icon="edit" @click="openDialog('修改专题',scope.row.id)" title="修改"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="kobe-table-footer" class="kobe-table-footer">
      <el-row type="flex" justify="center">
        <el-button type="text" style="color: #48576a; padding:5px 0;" @click="deleteData()">删除</el-button>
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
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="top-ruleForm">
          <el-form-item label="专题名称" prop="display_name" style="margin-bottom:30px;">
            <el-input v-model="ruleForm.display_name" placeholder="简单为宜" @blur="checkSubjectName"></el-input>
          </el-form-item>
          <el-form-item label="专题排序" prop="sort">
            <el-input-number v-model="ruleForm.sort" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="是否推荐" required>
            <el-switch
              v-model="ruleForm.is_recommend"
              on-text="开"
              off-text="关">
            </el-switch>
          </el-form-item>
          <el-form-item label="专题说明" prop="description">
            <el-input type="textarea" :rows="3" v-model="ruleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="标题图" prop="logo">
            <el-upload
              class="avatar-uploader"
              :action="uploadURL"
              :show-file-list="false"
              :on-success="iconHandleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.logo" :src="ruleForm.logo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容图" prop="banners">
            <el-upload
              :action="uploadURL"
              list-type="picture-card"
              :on-success="bannersHandleAvatarSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog v-model="bannersVisible">
              <img width="100%" v-for="value in ruleForm.banners" :src="value" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item v-if="dialogTitle === '修改专题'">
            <el-row type="flex" justify="end">
              <el-button size="small" icon="delete2" title="删除" @click="deleteArticles"></el-button>
            </el-row>
          </el-form-item>
          <el-form-item v-if="dialogTitle === '修改专题'">
            <el-table
              :data="articleData.data"
              style="width: 100%"
              @selection-change="handleArticleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="created_at" label="日期" width="150"></el-table-column>
              <el-table-column prop="author" label="作者" width="100"></el-table-column>
              <el-table-column prop="title" label="标题"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="dialogTitle === '修改专题'">
            <el-row type="flex" justify="center">
              <el-pagination
                @current-change="handleArticleDataCurrentChange"
                :current-page="articleData.currentPage"
                :total="articleData.count"
                layout="total, prev, pager, next, jumper">
              </el-pagination>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" v-if="dialogTitle === '新增专题'">保存</el-button>
          <el-button type="primary" @click="editForm" v-if="dialogTitle === '修改专题'">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </kobe-table>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-restaurants-table',
    data () {
      return {
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        ruleForm: {
          keyword: '',
          start_time: '',
          end_time: '',
          states: [],
          types: [],
          author: ''
        }
      }
    },
    computed: {},
    methods: {
      getList (data = {}) {
        api.GET(config.categoryIndexAPI, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      transformData (res) {
        res.data.forEach(v => {
          if (v.created_at) {
            v.created_at = this.formatDate(v.created_at)
          }
          if (v.status === 0) {
            v.status = '待审核'
          }
          if (v.status === 1) {
            v.status = '已审核'
          }
          if (v.status === 2) {
            v.status = '退回'
          }
          if (v.status === 3) {
            v.status = '已归档'
          }
          if (v.status === 4) {
            v.status = '出档'
          }
          switch (v.active) {
            case 0:
              v.active = false
              break
            case 1:
              v.active = true
              break
          }
        })
        return res
      },
      // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
      formatDate (value) {
        let date = new Date(value)
        let M = date.getMonth() + 1
        M = M < 10 ? ('0' + M) : M
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        // let h = date.getHours()
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
        return value
      }
    },
    components: {
    },
    mounted () {
      this.getList()
    }
  }
</script>

<style scoped>
  .sc-report-table {
    margin-left: 2rem;
    margin-right: 2rem;
    padding-bottom: 1rem;
  }

  .search-form {
    padding: 1rem;
  }

  .sc-report-table-header {
    margin: 1rem 2rem;
    padding-bottom: 1rem;
  }

  .sc-report-table-content {
    margin-bottom: 20px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .top-ruleForm .el-form-item {
    margin-bottom: 10px;
  }
</style>