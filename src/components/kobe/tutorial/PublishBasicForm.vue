<template>
  <div class="kobe-tutorial-publish-basic">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
      <template v-for="item, index in properties">
        <kobe-tutorial-upload
          v-if="item.type === 'upload'"
          :data="item"
          :index="index"
          @upload="onChange"
          >
        </kobe-tutorial-upload>
        <kobe-tutorial-type
          v-if="item.type === 'select'"
          :data="item"
          :index="index"
          @change="onChange"
          >
        </kobe-tutorial-type>
        <kobe-active-input
          v-if="item.type === 'input'"
          :data="item"
          :index="index"
          @input="onChange"
          >
        </kobe-active-input>
        <kobe-tutorial-check
          v-if="item.type === 'checkbox-original'"
          :data="item"
          :index="index"
          @check="onChange"
          >
        </kobe-tutorial-check>
        <kobe-tutorial-check
          v-if="item.type === 'checkbox-recommend'"
          :data="item"
          :index="index"
          @check="onChange"
          >
        </kobe-tutorial-check>
        <kobe-tutorial-check
          class="margin-left-0"
          v-if="item.type === 'checkbox-uppermost'"
          :data="item"
          :index="index"
          @check="onChange"
          >
        </kobe-tutorial-check>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-publish-basic',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    properties () {
      const array = this.data.properties
      return array
    }
  },
  data () {
    return {
      form: {
        properties: [
        ]
      }
    }
  },
  methods: {
    onChange (value) {
      this.form.properties[value.index] = value.data
      this.onFormChange()
    },
    onFormChange () {
      const data = {
        id: this.data.id,
        index: this.index,
        type_key: this.data.type_key,
        ...this.form
      }
      this.$emit('form-change', data)
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
