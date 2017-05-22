<template>
  <div class="sc-article-category-manage">
    <el-button @click="addMenu">新增文章板块</el-button>
    <el-tree
      :data="data"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span>确认要删除该板块吗？(将删除所有的子板块)</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="danger" @click="deleteCategory">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api/index'
  import config from '../../config/index'

  export default {
    data () {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        newCategory: '',
        newMenu: '',
        dialogVisible: false,
        deletedId: ''
      }
    },
    methods: {
      addMenu () {
        this.$router.push('articlecategoryadd')
      },
      edit (node, store, data) {
        console.log(node, store, data)
      },
      remove (store, data) {
        this.dialogVisible = true
        this.deletedId = data.id
      },
      getData () {
        api.GET(config.articleCatlgAPI)
          .then(res => {
            console.log(res.data, 'config')
            this.data = res.data.data
          })
      },
      deleteCategory () {
        api.POST(config.removeArticleCatlgAPI, {id: this.deletedId})
          .then(res => {
            if (res.data.errcode === '0000') {
              console.log(res)
              this.dialogVisible = false
              this.getData()
            }
          })
      },
      renderContent (h, { node, data, store }) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button size="mini" on-click={ () => this.edit(node, store, data) }>编辑</el-button>
              <el-button size="mini" on-click={ () => this.remove(store, data) }>删除</el-button>
            </span>
          </span>)
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>

<style scoped>
  .sc-article-category-manage {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid lightgray;
  }
</style>
