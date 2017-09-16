<template>
  <div class="sc-upload-test">
    <el-card class="box-card">
      <div class="clearfix"
           slot="header">
        <el-button @click="back"
                   type="primary"
                   icon="d-arrow-left">
          返回
        </el-button>
      </div>
      <div class="uploadWrapper">
        <div class="title">上传题目文件：</div>
        <el-upload class="upload-demo"
                   action="https://jsonplaceholder.typicode.com/posts/"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :file-list="fileList">
          <el-button size="small"
                     type="primary">点击上传</el-button>
        </el-upload>
        <div class="download">
          <el-button type="primary"
                     size="small">
            <i class="fa fa-download"
               aria-hidden="true"></i>
          </el-button>
          点击下载题库模板文件</div>
      </div>
      <div class="desc">
        <div class="title">说明：</div>
        <ul>
          <li class="descItem warning">请不要随意变更模板文件中单元格的样式，例如合并单元格，随意增删列等</li>
          <li class="descItem">支持题型为：单选题，多选题，判断题，单项填空题、多项填空题、简单题，文字拼写务必以此为准</li>
          <li class="descItem">选择题的选项可以2-8项均可； 每题的选项数量务必与选项内容数量一致，否则不能导入</li>
          <li class="descItem">选择题答案务必大写格式，多选项字母务必连着拼写，不要有空格或者符号间隔</li>
          <li class="descItem">填空题最多支持10个空，每个答案间务必使用“@@”隔开，考生作答内容跟录入内容完全一致时，系统会自动判分</li>
          <li class="descItem warning">难度分五级：1星难度，2星难度，3星难度，4星难度，5星难度，务必填写整数，1星难度最简单，5星难度最难</li>
          <li class="descItem">问答题的选项数量、答案，两项内容，可以不填写；填空题的答案，可以不填</li>
          <li class="descItem">题分：支持整数或一位小数；题干或选项：不支持指数、分数、编辑器公式，不支持图片、音频等格式</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<style>
.sc-upload-test {
  margin: 1rem 2rem;
  font-size: 14px;
}

.uploadWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rem;
}

.download {
  margin-left: 50px;
}

.desc {
  width: 90%;
  margin: 0 auto;

  background-color: #efefef;
  padding: 40px;
  border-radius: 5px;
}

.title {
  margin-bottom: 10px;
}

.desc ul,
.descItem {
  list-style: none;
  color: #1F2D3D;
}

.descItem {
  margin-bottom: 5px;
  position: relative;
}

.warning {
  color: #FF4949;
}

.descItem::before {
  position: absolute;
  content: '';
  top: calc(50% - 5px);
  left: -20px;
  width: 10px;
  height: 10px;

  border-radius: 10px;
  background-color: #20A0FF;
}
</style>
