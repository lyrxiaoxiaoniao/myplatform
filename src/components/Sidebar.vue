<template>
  <aside class="main-sidebar">

    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">

      <!-- Sidebar user panel (optional) -->
      <div class="user-panel">
        <div class="pull-left image">
          <img :src="pictureUrl"/>
        </div>
        <div class="pull-left info">
          <div>
            <p class="white">{{ displayName }}</p>
          </div>
          <a href="javascript:;">
            <i class="fa fa-circle text-success"></i> Online
          </a>
        </div>
      </div>

      <!-- search form (Optional) -->
      <form v-on:submit.prevent class="sidebar-form">
        <div class="input-group">
          <input type="text"
                 name="search"
                 id="search"
                 class="search form-control"
                 data-toggle="hideseek" p
                 laceholder="Search Menus"
                 data-list=".sidebar-menu">
          <span class="input-group-btn">
            <button type="submit" name="search" id="search-btn" class="btn btn-flat">
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </form>
      <!-- /.search form -->

      <!-- Sidebar Menu -->
      <ul class="sidebar-menu">
        <template v-for="item in model">
          <sidebar-menu :model="item"/>
        </template>
      </ul>
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>
</template>
<script>
  import SidebarMenu from './SidebarMenu'
  import axios from 'axios'
  import config from 'src/config'

  export default {
    name: 'Sidebar',
    props: ['displayName', 'pictureUrl'],
    components: {SidebarMenu},
    data () {
      return {
        model: null,
        error: null
      }
    },
    computed: {
      menuURL () {
        return config.serverURI + config.menuAPI
      }
    },
    methods: {
      callMenuLeft () {
        const _this = this
        axios.get(this.menuURL)
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            _this.model = response.data.data
          })
          .catch(error => {
            this.error = error.response.statusText
            this.$message.error(error)
          })
      }
    },
    mounted () {
      this.callMenuLeft()
    }
  }
</script>
<style>
  .user-panel .image img {
    border-radius: 50%;
  }
</style>
