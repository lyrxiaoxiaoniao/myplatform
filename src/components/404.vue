<template>
  <div class="container container-table">
      <div class="row vertical-10p">
        <div class="container">
          <div class="text-center col-sm-6 col-sm-offset-3">
            <h3>页面丢失了</h3>
            <router-link class="sc-page-404" to="/admin">回到首页</router-link>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'NotFound',
    data () {
      return {
      }
    }
  }
</script>

<style>
.sc-page-404 {
  font-size: 2rem;
}
</style>
