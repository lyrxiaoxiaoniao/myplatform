<template>
  <div class="kobe-tutorial-category">
    <el-form-item
      :label="data.title">
      <el-cascader
        style="width:100%;"
        v-if="categories"
        clearable
        change-on-select
        expand-trigger="hover"
        :options="categories"
        @change="handleCatlgChange"
        v-model="selected"
        >
      </el-cascader>
  </el-form-item>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'kobe-tutorial-category',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      categoryID: 14,
      categories: null,
      selected: []
    }
  },
  methods: {
    handleCatlgChange (value) {
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: value
          }]
        }
      }
      this.$emit('change', data)
    },
    transformTreeData (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id.toString()
        category.label = item.name
        if (item.children && item.children.length !== 0) {
          const children = this.transformTreeData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    },
    getCategoryList () {
      api.GET(config.tutorial.category, {
        p_id: 0,
        catgr_id: 14
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.categories = this.transformTreeData(response.data.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    init () {
      if (this.data.values && this.data.values.length) {
        const value = this.data.values[0]
        this.selected = JSON.parse(value.value)
        let data = {
          index: this.index,
          data: {
            id: this.data.id,
            type_key: this.data.type_key,
            options: [{
              title: this.selected
            }]
          }
        }
        this.$emit('change', data)
      }
    }
  },
  mounted () {
    this.getCategoryList()
    this.init()
  }
}
</script>
