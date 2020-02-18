<template>
  <div id="app">
      <m-header></m-header>
      <tab></tab>
      <keep-alive><router-view></router-view></keep-alive>
      <player></player>

  </div>
</template>

<script type="text/ecmascript-6">
    import Tab from "./components/tab/Tab";
    import MHeader from './components/m-header/m-header'
    import Player from "./components/player/Player";
    export default {
        components:{
            Player,
            MHeader,Tab
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  #app
    color:$color-theme
</style>
