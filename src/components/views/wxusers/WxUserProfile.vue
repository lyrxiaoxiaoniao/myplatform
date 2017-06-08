<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'sc-wechat-user-profile',
  data () {
    return {
      response: null,
      error: null,
      userID: this.$route.query.id
    }
  },
  methods: {
  },
  mounted () {
    console.log(this.$route.query.id)
  }
}
</script>

<style>
</style>
