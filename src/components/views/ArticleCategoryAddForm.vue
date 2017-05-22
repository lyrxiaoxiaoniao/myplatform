<template>
  <div class="sc-article-category-add">
    <el-form>
      <el-form-item label="父级板块">
        <el-cascader
          :options="options"
          change-on-select
          :props="props"
          @change="handleChange"
          v-model="formData.valueList"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="板块名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="板块描述">
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="图标选择">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="同级排序">
        <el-input v-model="formData.sort"></el-input>
      </el-form-item>
      <el-form-item label="访问路径">
        <el-input v-model="formData.url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import api from '../../api/index'
  import config from '../../config/index'

  export default {
    data () {
      return {
        options: [],
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        formData: {
          name: '',
          description: '',
          parentId: 0,
          sort: '',
          url: '',
          valueList: [51]
        }
      }
    },
    mounted () {
      api.GET(config.articleCatlgAPI)
        .then(res => {
          console.log(res.data, 'config')
          let obj = res.data.data
          this.iteration(obj)
          obj.push({id: 0, name: '根级菜单', label: '根级菜单', value: 0})
          this.options = obj
        })
    },
    methods: {
      iteration (obj) {
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
      submit () {
        api.POST(config.addArticleCatlgAPI, this.formData)
          .then(res => {
            console.log(res)
          })
      },
      handleChange (value) {
        console.log(value)
        this.formData.parentId = value[value.length - 1]
        console.log(this.formData.parentId)
      },
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped></style>
