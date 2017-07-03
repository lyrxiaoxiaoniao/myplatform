<template>
  <div class="kobe-tag-group">
    <el-tag
      class="kobe-tag"
      :closable="closeable"
      v-for="(tag, index) in dynamicTags"
      :type="types[index % 5]"
      @close="onClose(tag)"
      >
      {{ tag }}
    </el-tag>
    <el-input
      size="small"
      v-if="inputVisible"
      v-model="inputValue"
      ref="tagInput"
      @keyup.enter.native="onInputConfirm"
      @blur="onInputBlur"
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
          '标签四',
          '标签五',
          '标签六'
        ]
      }
    },
    closeable: {
      type: Boolean,
      default: true
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
        this.inputValue = ''
        this.inputVisible = false
      }
    },
    onInputBlur () {
      this.inputVisible = false
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.tagInput.$refs.input.focus()
      })
    }
  },
  mounted () {
  }
}
</script>   

<style>
.kobe-tag {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
