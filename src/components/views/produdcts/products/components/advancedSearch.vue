<template>
  <section>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="关键字">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="分类">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-select v-model="value5" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="时间">
        <el-date-picker
          v-model="value1"
          type="datetime"
          placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker
          v-model="value1"
          type="datetime"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.name" class="number-input-two"></el-input>
        ~~
        <el-input v-model="form.name" class="number-input-two"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="库存">
            <el-input v-model="form.name" class="number-input-four"></el-input>
            ~~
            <el-input v-model="form.name" class="number-input-four"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销量">
            <el-input v-model="form.name" class="number-input-four"></el-input>
            ~~
            <el-input v-model="form.name" class="number-input-four"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row type="flex" justify="end">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="onAdvancedSearch">搜索</el-button>
      </el-row>
    </div>
  </section>
</template>

<script>
  // import config from 'src/config'
  // import api from 'src/api'

  export default {
    data () {
      return {
        form: {}
      }
    },
    methods: {
      closeDialog () {
        this.$emit('closeDialog')
      },
      onAdvancedSearch () {
        this.$emit('onAdvancedSearch', this.form)
      }
    },
    mounted () {
      // this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  .number-input-two {
    width: 15%;
  }
  .number-input-four {
    width: 34%;
  }
  .dialog-main {
    padding-bottom: 20rem;
  }
</style>