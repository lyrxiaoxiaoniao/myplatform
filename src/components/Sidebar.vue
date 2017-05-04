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
      <div class="sidebar-menu-container">
        <ul class="sidebar-menu">
          <template v-for="item in model">
            <sidebar-menu :model="item"/>
          </template>
        </ul>
      </div>

      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>
</template>
<script>
  import SidebarMenu from './SidebarMenu'
  import axios from 'axios'

  export default {
    name: 'Sidebar',
    props: ['displayName', 'pictureUrl'],
    components: {SidebarMenu},
    data () {
      return {
        menuURL: 'http://192.168.1.2:8080/admin/menu/show_left',
        model: null,
        error: null
      }
    },
    methods: {
      callMenuLeft () {
        const _this = this
        axios.get(this.menuURL)
          .then(response => {
            console.log('menuleft Response:', response.data)

            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            console.log(response.data.data)
            _this.model = response.data.data
          })
          .catch(error => {
            // Request failed.
            console.log('error', error.response)
            this.error = error.response.statusText
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

  /* override default */
  .sidebar-menu > li > a {
    padding: 12px 15px 12px 15px;
  }

  .sidebar-menu li.active > a > .fa-angle-left, .sidebar-menu li.active > a > .pull-right-container > .fa-angle-left {
    animation-name: rotate;
    animation-duration: .2s;
    animation-fill-mode: forwards;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-90deg);
    }
  }



  .main-sidebar {
    position: fixed;
    width: 230px;
    top: 0;
    bottom: 20px;
    left: 0;
    z-index: 2;
    overflow-y: scroll;
  }

  ul {
    list-style-type: none;
  }
</style>
