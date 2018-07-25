<template>
  <div class="workbench">
    <div class="connent">
      <sfNav :navInfo="navInfo" :title="title" @refreshPage="refreshPage"></sfNav>
      <div class="childRouter navMargin">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import sfNav from './AsideNav.vue'
import { navList } from '../../data/navData.js'
import { mapGetters } from 'vuex'
export default {
  beforeMount() {
    this.manageNavList()
  },
  data() {
    return {
      navList,
      title: '',
      navInfo: []
    }
  },
  mounted() {
    this.setActive()
  },
  computed: {
    ...mapGetters({
      getLocalNav: 'getLocalNav'
    })
  },
  methods: {
    setActive() {
      // console.log(this.getLocalNav)
    },
    manageNavList() {
      let nav = null
      if (this.getLocalNav) {
        nav = this.getLocalNav
      } else {
        nav = JSON.parse(localStorage.getItem('localNav'))
      }
      this.navInfo = this.navList[nav].childNode
      this.title = navList[nav].parentNode
      this.formatIsActive(this.$route)
    },
    refreshPage() {
      this.formatIsActive(this.$route)
    },
    formatIsActive(val) {
      this.navInfo.forEach(item => {
        let arr = item.link.split('/')
        let att = arr[arr.length - 1]
        if (val.name.indexOf(att) != -1) {
          item.active = true
        } else {
          item.active = false
        }
      })
    }
  },
  components: {
    sfNav
  },
  watch: {
    $route(val) {
      this.formatIsActive(val)
    },
    getLocalNav: function() {
      this.manageNavList()
    }
  }
}
</script>
<style lang="less">
.workbench {
  height: 100%;
  .connent {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #f5f7fa;
    .childRouter {
      // padding-top: 20px;
      padding-right: 15px;
      height: 100%;
      &.navMargin {
        margin-left: 210px;
      }
    }
  }
}
</style>
