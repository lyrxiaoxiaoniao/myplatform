<template>
  <li class="pageLink">
    <div @click='toggle' class="display-text">
      <i v-if='isFolder' class="fa " :class="[showopen?'fa-folder-open':'fa-folder']"></i>
      <!--isFolder判断是否存在子级改变图标-->
      <i v-if='!isFolder' class="fa fa-file-textpageLink"></i> {{model.display_name}}
    </div>
    <ul v-show="showopen" v-if='isFolder'>
      <template v-for="item in model.children" v-if="(model.children && model.children.length)">
        <sidebar-menu :model="item"/>
      </template>
      <!--<sidebar-menu v-for='cel in model.children' :model='cel' v-if="(model && model.length)"></sidebar-menu>-->
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
      showopen: false,
      isFolder: true
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
  .sidebar-menu>li>a {
    padding: 12px 15px 12px 15px;
  }

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
    font-size: 18px;
    color: white;
    padding-top: 20px;
    padding-left: 20px;
  }
</style>
