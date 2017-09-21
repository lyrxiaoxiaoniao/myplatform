<template>
<div>
  <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
      <el-col :span="12">
         <!-- <el-button type="primary" @click="onFresh">反选</el-button> -->
        <el-button type="primary" @click="onFresh">刷新</el-button>
       <el-button type="primary" @click="onRelate">确定</el-button>
      </el-col>
       <el-col :span="12">
          <el-input
            placeholder="输入关键字进行过滤搜索"
            v-model="filterText">
          </el-input>
      </el-col>
      </el-row>
  </div>
  <div class="kobe-table">
      <el-tree
        class="filter-tree treeHeight"
        :data="data2"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        check-strictly='true'
        node-key="id"
        :default-checked-keys="checkKeys"
        :filter-node-method="filterNode"
        ref="tree"
        @check-change="handleNodeClick">
      </el-tree>
      <p style="margin-top:10px;">选择子菜单时，必须选择<span style="color: red;">父级菜单</span>。 已选择<span style="color: red;">{{checkKeys.length}}</span>个菜单</p>
  </div>
</div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'
export default {
  props: ['userid'],
  data () {
    return {
      filterText: '',
      checkKeys: [],
      old: [],
      new: [],
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      form: {
        keyword: ''
      },
      users: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    handleNodeClick() {
      this.checkKeys = this.$refs.tree.getCheckedKeys()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.display_name.indexOf(value) !== -1
    },
    onFresh() {
      // this.getList()
      this.getRelatedMenu()
    },
    iteration (obj) {
      obj.forEach(v => {
        if (v.display_name) {
          v.display_name = v.display_name + ' ' + ' ( ' + v.name + ' ) '
          if (v.children && v.children.length !== 0) {
            this.iteration(v.children)
          }
        }
      })
      return obj
    },
    getList (data = {}) {
      api.GET(config.menuAPI, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.data2 = this.iteration(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onRelate () {
      this.users = []
      this.users.push(this.userid)
      if (this.old.length === 0) {
        api.POST(config.authority.relatedmenuAdd, {
          permissions: this.users,
          menus: this.checkKeys
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('关联菜单成功')
          }
        })
      } else {
        api.POST(config.authority.relatedmenuDelete, {
          permissions: this.users,
          menus: this.old
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            api.POST(config.authority.relatedmenuAdd, {
              permissions: this.users,
              menus: this.checkKeys
            })
            .then(response => {
              if (response.data.errcode === '0000') {
                this.onSuccess('关联菜单成功')
              }
            })
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      }
    },
    getRelatedMenu (data = {}) {
      api.GET(config.authority.relatedmenu, {permission_id: this.userid, ...data})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.checkKeys = []
          this.old = []
          this.old = response.data.data
          response.data.data.forEach(v => {
            this.checkKeys.push(String(v))
          })
          this.getList()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    }
  },
  mounted () {
    this.getRelatedMenu()
    // this.getRelatedMenu()
  }
}
</script>
<style scoped>
.kobe-table-header {
  margin: 1rem 2rem;
  padding-bottom: 1rem;
}
.kobe-table {
  margin-left: 2rem;
  margin-right: 2rem;
  padding-bottom: 1rem;
}
.kobe-table-footer {
  padding-bottom: 1rem;
}
.treeHeight {
  max-height: 300px;
  overflow: auto;
}
</style>