<template>
  <li
    :class="[!isFolder ? 'pageLink' : '', 'treeview']"
    @click="!isFolder ? toggleMenu : ''"
    >
    <a v-if="isFolder" href="#">
      <i :class="model.icon"></i>
      <span class="treeview-display-name">{{ model.displayName }}</span>
      <span class="pull-right-container">
        <i class="fa fa-angle-left fa-fw pull-right" v-show="isFolder"></i>
      </span>
    </a>
    <router-link class="sidebar-routes" v-if="!isFolder" :to="{ path: model.url }">
      <i :class="model.icon"></i>
      <span class="page treeview-display-name">{{ model.displayName }}</span>
      <span class="pull-right-container">
          <i class="fa fa-angle-left fa-fw pull-right" v-show="isFolder"></i>
      </span>
    </router-link>
    <ul class="treeview-menu" v-if="isFolder">
      <template v-for="item in model.children" v-if="(model.children && model.children.length > 0)">
        <sidebar-menu class="siderbar-menu-item" :model="item"/>
      </template>
    </ul>
  </li>
</template>
<script>
export default {
  name: 'SidebarMenu',
  props: ['model'],
  components: {},
  data () {
    return {
      showopen: false
    }
  },
  computed: {
    isFolder: function () {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    toggleMenu (event) {
      console.log(event)
      var active = document.querySelector('li.pageLink.active')

      if (active) {
        active.classList.remove('active')
      }
      event.toElement.parentElement.className = 'pageLink active'
    },
    toggle: function () {
      if (this.isFolder) {
        this.showopen = !this.showopen
      }
    }
  },
  mounted () {
  }
}
</script>
<style>
  /* override default */
  .sidebar-menu > .pageLink:hover {
    background-color: #233;
    cursor: pointer;
  }

  .iconfont {
    font-size: 14px !important;
  }

  .treeview-display-name {
    z-index: 1;
    height: 100%;
    width: 100%;
    font-size: 13px;
    margin-left: 5px;
  }

  .sidebar-menu > .pageLink > ul {
    background-color: #344;
  }

  .sidebar-menu > .pageLink ul {
    padding-left: 2rem;
  }

  .sidebar-menu > .pageLink > ul .display-text {
    color: #bbb;
  }

  .sidebar-menu > .pageLink > ul .display-text:hover {
    color: white;
  }

  .sidebar-menu .treeview-menu {
    padding-left: 10px;
  }

  .sidebar-menu .treeview-menu > li :hover>a {
     color: white;
  }

  .siderbar-menu-item {
    font-size: 12px;
  }

  li.siderbar-menu-item:hover {
     color: #fff; 
  }

  .siderbar-menu-item span {
    margin-left: 5px;
  }

  .arrow {
    padding-right: 1rem;
    float: right;
  }

  .pull-right-container i.fa.pull-right {
    margin-right: 1rem;
  }
  .pull-right-container {
    height: 45px;
  }
  /*.sidebar-menu li.active > a > .fa-angle-left, .sidebar-menu li.active > a > .pull-right-container > .fa-angle-left {*/
  .sidebar-menu li.active>a>.fa-angle-left, .sidebar-menu li.active>a>.pull-right-container>.fa-angle-left {
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

  .display-text {
    font-size: 1rem;
    color: white;
    padding: 1rem;
  }

  .fa-mobile {
    font-size: 20px;
  }

  .router-link-active .treeview-display-name {
    color: #000;
  }

  .router-link-active .iconfont {
    color: #000;
  }

  .skin-blue-light .sidebar-menu>li:hover>a, .skin-blue-light .sidebar-menu>li.active>a {
    color: #000;
    /* background: #f4f4f5; */
    background: #e1e1e8;
  }
</style>
