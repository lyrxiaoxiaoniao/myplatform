<template>
  <li class="pageLink">
    <div @click='toggle' class="display-text">
      <i v-if='isFolder' :class="model.icon"></i>
      <!--isFolder判断是否存在子级改变图标-->
      {{model.displayName}}
      <i v-show="isFolder" :class="[showopen? 'fa-angle-down':'fa-angle-left']" class="fa arrow"></i>
    </div>
    <transition name="slide">
      <ul v-show="showopen" v-if='isFolder'>
        <template v-for="item in model.children" v-if="(model.children && model.children.length)">
          <sidebar-menu :model="item"/>
        </template>
        <!--<sidebar-menu v-for='cel in model.children' :model='cel' v-if="(model && model.length)"></sidebar-menu>-->
      </ul>
    </transition>
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
      toggle: function () {
        if (this.isFolder) {
          this.showopen = !this.showopen
        }
      }
    }
  }
</script>
<style>
  /* override default */
  .sidebar-menu > .pageLink:hover {
    background-color: #233;
    cursor: pointer;
  }

  .sidebar-menu > .pageLink > ul {
    background-color: #344;
  }

  .sidebar-menu > .pageLink  ul {
    padding-left: 2rem;
  }

  .sidebar-menu > .pageLink > ul .display-text {
    color: #bbb;
  }

  .sidebar-menu > .pageLink > ul .display-text:hover {
    color: white;
  }

  .sidebar-menu > li > a {
    padding: 12px 15px 12px 15px;
  }

  .arrow {
    padding-right: 1rem;
    float: right;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-45deg);
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

  .slide-enter-active, .slide-leave-active {
    transition: all 1s;
    overflow: hidden;
    max-height: 800px;
  }

  .slide-enter,
  .slide-leave-active {
    max-height: 0;
  }

</style>
