<template>
  <div class="kobe-tag-group">
    <el-tag
      :closable="true"
      v-for="(tag, index) in dynamicTags"
      :type="types[index % 5]"
      @close="onClose(tag)"
      >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      v-model="inputValue"
      @keyup.enter.native="onInputConfirm"
      @blur="onInputConfirm"
      >
    </el-input>
    <el-button
      v-else
      @click="showInput"
      size="mini"
      >
      添加标签
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'kobe-tag-group',
  props: {
    tags: {
      type: Array,
      default: () => {
        return [
          '标签一',
          '标签二',
          '标签三',
          '标签一',
          '标签二',
          '标签三'
        ]
      }
    }
  },
  data () {
    return {
      types: [
        'gray',
        'primary',
        'success',
        'warning',
        'danger'
      ],
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    dynamicTags () {
      return this.tags
    }
  },
  methods: {
    onClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.$emit('change', this.dynamicTags)
    },
    onInputConfirm () {
      if (this.inputValue !== '') {
        this.dynamicTags.push(this.inputValue)
        this.$emit('change', this.dynamicTags)
      }
    },
    showInput () {
      this.inputVisible = true
    }
  },
  mounted () {
  }
}
</script>   

<style>
</style>
