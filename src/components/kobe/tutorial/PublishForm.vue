<template>
  <div class="kobe-tutorial-publish">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
      <template v-for="item, index in properties">
        <kobe-tutorial-category
          v-if="item.type === 'select'"
          :data="item"
          :index="index"
          >
        </kobe-tutorial-category>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-publish',
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
    }
  },
  mounted () {
  }
}
</script>
