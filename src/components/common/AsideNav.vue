  <template>
  <div class="asider" v-if="navInfo.length > 0">
    <div class="modleTitle">
      {{title}}
    </div>
    <div class="asider_content">
      <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#EEF1F6" text-color="#000">
        <aside v-for="(item, index) in navInfo" :key="index" @click="judgePage(item)">
          <el-menu-item :index="item.title" :class="{'my_active': item.active}">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </aside>
      </el-menu>
    </div>

  </div>
</template>
<script>
import store from '../../state'
export default {
  props: ['navInfo', 'title'],
  data() {
    return {
      store
    }
  },
  computed: {},
  mounted() {
    this.$emit('refreshPage')
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    judgePage(item) {
      this.$router.push(item.link)
    }
  }
}
</script>
<style lang="less">
.asider {
  position: fixed;
  top: 60px;
  bottom: 0;
  width: 200px;
  zoom: 1;
  z-index: 100;
  //   height: calc(~~100% - 60px);
  background: #e6e6e6;
  i{
    margin-right: 5px;
    padding:0 3px;
  }
  .modleTitle {
    line-height: 50px;
    padding-left: 30px;
    font-size: 18px;
    font-weight: 500;
  }
  .el-menu {
    border-right: none !important;
  }
  .el-menu-item {
    border-left: 3px solid transparent;
    border-right: none !important;
  }
  .el-menu-item.is-active {
    color: #2d2f33;
  }
  .el-menu-item.my_active {
    color: #128dff !important;
    border-left: 3px solid #128dff;
    border-right: none !important;
    i {
      color: #128dff !important;
    }
    span {
      color: #128dff !important;
    }
  }
}
</style>
