<template>
  <div class="sc-auth-menu-component" v-if="linkMenu && unLinkMenu">
    <el-row type="flex" class="sc-auth-menu-content">
      <el-col :span="12" class="sc-auth-link-menu">
        <kobe-table>
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
              <el-col :span="7">
                <el-input v-model="linkMenuForm.keyword" placeholder="请输入关键字">
                  <el-button slot="append" @click="onLinkMenuSearch" icon="search"></el-button>
                </el-input>
              </el-col>
            </el-row>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              border
              stripe
              :data="linkMenu.data"
              >
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="name" label="菜单名"></el-table-column>
              <el-table-column prop="displayName" label="菜单显示名"></el-table-column>
              <el-table-column 
                width="80"
                label="操作"
                >
                <template scope="scope">
                  <el-button @click="onUnLink(scope.row.id)" type="small">解除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="linkMenu.count > 10" slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex">
              <el-col :span="12">
                <el-pagination
                  @size-change="onLinkSizeChange"
                  @current-change="onLinkCurrentChange"
                  :current-page="linkMenu.currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="linkMenu.pageSize"
                  :total="linkMenu.count"
                  layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </kobe-table>
      </el-col>

      <el-col :span="12" class="sc-auth-unlink-menu">
        <kobe-table>
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
              <el-col :span="7">
                <el-input v-model="unLinkMenuForm.keyword" placeholder="请输入关键字">
                  <el-button slot="append" @click="onUnLinkMenuSearch" icon="search"></el-button>
                </el-input>
              </el-col>
            </el-row>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              border
              stripe
              :data="unLinkMenu.data"
              >
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="name" label="菜单名"></el-table-column>
              <el-table-column prop="displayName" label="菜单显示名"></el-table-column>
              <el-table-column 
                width="80"
                label="操作"
                >
                <template scope="scope">
                  <el-button @click="onLink(scope.row.id)" type="small">关联</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="unLinkMenu.count > 10" slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex">
              <el-col :span="12">
                <el-pagination
                  @size-change="onUnLinkSizeChange"
                  @current-change="onUnLinkCurrentChange"
                  :current-page="unLinkMenu.currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="unLinkMenu.pageSize"
                  :total="unLinkMenu.count"
                  layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </kobe-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'
export default {
  name: 'sc-auth-menu',
  data () {
    return {
      id: this.$route.query.id,
      error: null,
      linkMenu: null,
      unLinkMenu: null,
      linkMenuForm: {
        keyword: ''
      },
      unLinkMenuForm: {
        keyword: ''
      }
    }
  },
  methods: {
    onUnLink (id) {
      api.POST(config.auth.unLinkMenu, {
        permissions: [this.id],
        menus: [id]
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.getLinkMenu()
          this.getUnlinkMenu()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onLinkMenuSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.linkMenu.pageSize,
        ...this.linkMenuForm
      }
      this.getLinkMenu(data)
    },
    onUnLinkMenuSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.unLinkMenu.pageSize,
        ...this.unLinkMenuForm
      }
      this.getUnlinkMenu(data)
    },
    onLink (id) {
      api.POST(config.auth.linkMenu, {
        permissions: [this.id],
        menus: [id]
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.getLinkMenu()
          this.getUnlinkMenu()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onLinkSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.linkMenu.currentPage,
        ...this.linkMenuForm
      }
      this.getLinkMenu(data)
    },
    onLinkCurrentChange (value) {
      const data = {
        pageSize: this.linkMenu.pageSize,
        currentPage: value,
        ...this.linkMenuForm
      }
      this.getLinkMenu(data)
    },
    onUnLinkSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.unLinkMenu.currentPage,
        ...this.unLinkMenuForm
      }
      this.getUnlinkMenu(data)
    },
    onUnLinkCurrentChange (value) {
      const data = {
        pageSize: this.unLinkMenu.pageSize,
        currentPage: value,
        ...this.unLinkMenuForm
      }
      this.getUnlinkMenu(data)
    },
    getLinkMenu (data = {}) {
      api.GET(config.auth.relatedMenu, {
        permissionId: this.id,
        ...data
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }
        if (response.data.errcode === '0000') {
          this.linkMenu = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getUnlinkMenu (data = {}) {
      api.GET(config.auth.unrelatedMenu, {
        permissionId: this.id,
        ...data
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }
        if (response.data.errcode === '0000') {
          this.unLinkMenu = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getLinkMenu()
    this.getUnlinkMenu()
  }
}
</script>

<style>
</style>
