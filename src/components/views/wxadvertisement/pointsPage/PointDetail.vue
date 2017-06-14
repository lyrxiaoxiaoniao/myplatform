<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;">
    <el-form-item label="点位名称">
      <p v-text="ruleForm.spacename"></p>
    </el-form-item>
    <el-form-item label="点位标识">
      <p v-text="ruleForm.slug"></p>
    </el-form-item>
    <el-form-item label="点位类型">
      <el-radio-group v-model="ruleForm.typename">
        <el-radio label="图文链接"></el-radio>
        <el-radio label="文字链接"></el-radio>
        <el-radio label="视频链接"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="创建时间">
      <p v-text="ruleForm.createdAt"></p>
    </el-form-item>
    <el-form-item label="具体描述">
      <p v-text="ruleForm.description"></p>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">确定修改</el-button>
      <el-button @click="resetForm()">返回</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        ruleForm: {
          description: '',
          slug: '',
          spacename: '',
          typename: '',
          createdAt: null
        }
      }
    },
    methods: {
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
      },
      getData () {
        const id = this.$route.query.id
        // api.GET(config.showAdvertisementAPI, {id: id})
        api.GET(config.showAdvPointAPI, {id: id})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000' && response.data.data) {
              const res = response.data.data
              this.ruleForm = res
              this.ruleForm.createdAt = this.formatDate(res.createdAt)
              console.log(res)
            }
          })
      },
      submitForm () {
        console.log('submit!')
        const id = this.$route.query.id
        this.$router.push({
          path: 'editpoint',
          query: {
            id: id
          }
        })
      },
      resetForm () {
        console.log('restSubmit!')
        this.$router.push({
          path: 'advertisementpoint'
        })
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style scoped>
	
</style>