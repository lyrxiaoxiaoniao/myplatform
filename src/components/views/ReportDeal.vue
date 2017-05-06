<template>
  <div class="ReportDeal">
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <el-form>
          <el-form-item label="处理方式">
            <el-select>
              <el-option>选项1</el-option>
              <el-option>选项2</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理意见">
            <el-input type="textarea" autosize="{minRows:4 maxRows:6}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox label="是否短信通知"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button>确定</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formData: {
          data: ''
        }
      }
    }
  }
</script>
<style>
  .ReportDeal {
    border-top: 1px solid lightgray;
    margin-top: 2rem;
    padding-top: 2rem;
  }
</style>
