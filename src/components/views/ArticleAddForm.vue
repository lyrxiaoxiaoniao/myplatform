<template>
  <div class="articleAddForm">
    <el-row type="flex">
      <el-col :span="12" :offset="2">
        <el-form ref="form" :model="form" labelWidth="80px">
          <el-form-item label="板块">
            <el-select v-model="form.class" placeholder="请选择文章分类">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input type="text" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="摘要">
            <el-input type="text" placeholder="请输入文章摘要"></el-input>
          </el-form-item>
          <el-form-item label="封面">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="form.fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="正文">
            <vue-html5-editor :content="inputContent" @change="updateData"></vue-html5-editor>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-button type="primary">确认提交</el-button>
      <el-button>返回上一页</el-button>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          class: '',
          fileList: [],
          summary: '',
          inputContent: ''
        }
      }
    },
    methods: {
      updateData (data) {
        this.form.inputContent = data
      }
    }
  }
</script>
<style scoped>
  .articleAddForm {
    padding-top: 2rem;
    margin-top: 2rem;
    border-top: 1px solid lightgray;
  }

  .btnWrapper {
    margin-top: 2rem;
    padding-top: 2rem;
  }
</style>
