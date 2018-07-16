<template>
  <div class="sf-cloud">
    <sfHeader :activeIndex='activeIndex'></sfHeader>
    <div class="connent">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import sfHeader from './Header.vue'
import { navList } from '../../data/navData.js'
import { mapGetters } from 'vuex'
export default {
  beforeMount() {
    this.manageNavList()
  },
  data() {
    return {
      navList,
      activeIndex: ''
    }
  },
  mounted() {},
  computed: {
    ...mapGetters({
      getLocalNav: 'getLocalNav'
    })
  },
  methods: {
    manageNavList() {
      let nav = null
      if (this.getLocalNav) {
        nav = this.getLocalNav
        this.activeIndex = navList[nav].childNode[0].link
      }
    }
  },
  components: {
    sfHeader
  },
  watch: {
    getLocalNav: function() {
      this.manageNavList()
    }
  }
}
</script>
<style lang="less">
.sf-cloud {
  height: 100%;
  box-sizing: border-box;
  padding-top: 60px;
  .connent {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    top: 0px;
    // padding-top: 60px;
    background: #f5f7fa;
    // position: absolute;
  }
}
</style>
