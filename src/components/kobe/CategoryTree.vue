<template>
  <div class="kobe-category-tree">
    <p>{{ title }}</p>
    <el-tree
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
      >
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'kobe-category-tree',
  data () {
    return {
    }
  },
  props: {
    title: {
      type: String,
      default: 'kobe-category-tree'
    },
    defaultProps: {
      children: 'children',
      label: 'label'
    },
    data: {
      type: Array,
      default: () => {
        return [{
          label: 'kobe-tree-main',
          children: [{
            label: '一级 1',
            children: [{
              label: '二级 1-1',
              children: [{
                label: '三级 1-1-1'
              }]
            }]
          }, {
            label: '一级 2',
            children: [{
              label: '二级 2-1',
              children: [{
                label: '三级 2-1-1'
              }]
            }, {
              label: '二级 2-2',
              children: [{
                label: '三级 2-2-1'
              }]
            }]
          }, {
            label: '一级 3',
            children: [{
              label: '二级 3-1',
              children: [{
                label: '三级 3-1-1'
              }]
            }, {
              label: '二级 3-2',
              children: [{
                label: '三级 3-2-1'
              }]
            }]
          }]
        }]
      }
    }
  },
  methods: {
    handleNodeClick (data) {
    }
  },
  mounted () {
  }
}
</script>

<style>
.kobe-category-tree {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid lightgray;
}
.kobe-category-tree p {
  text-align: center;
}
</style>
