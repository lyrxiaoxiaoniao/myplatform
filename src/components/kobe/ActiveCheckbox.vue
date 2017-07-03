<template>
  <el-form-item :label="data.title">
    <el-checkbox-group
      v-model="checkList" @change="onChange">
      <el-checkbox
        :label="item.title"
        v-for="item in checkboxs"
        >
      </el-checkbox>
    </el-checkbox-group>
    <el-input
      size="small"
      v-if="inputVisible"
      v-model="inputValue"
      ref="checkboxInput"
      @keyup.enter.native="onInputConfirm"
      @blur="onInputBlur"
      >
    </el-input>
    <el-button
      size="mini"
      v-if="canAdd && !inputVisible"
      @click="showInput"
      >
      自定义
    </el-button>
  </el-form-item>
</template>

<script>
export default {
  name: 'kobe-active-checkbox',
  data () {
    return {
      checkList: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  props: {
    data: {
      type: Object,
      default: {
      }
    },
    index: {
      type: Number
    },
    canAdd: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    checkboxs () {
      let arr = [
        ...this.data.options
      ]
      return arr
    }
  },
  methods: {
    onInputBlur () {
      this.inputVisible = false
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.checkboxInput.$refs.input.focus()
      })
    },
    onChange () {
      let list = []
      this.checkList.forEach(item => {
        let obj = {
          title: item
        }
        list.push(obj)
      })
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: list
        }
      }
      this.$emit('checklist', data)
    }
  },
  mounted () {
  }
}
</script>
