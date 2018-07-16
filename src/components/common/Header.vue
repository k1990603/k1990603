<template>
  <div class="header">
    <div class="title">
    赫拉
    </div>
    <div class="nav_top">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="1" @click="goToOverView">总览</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item @click="selModle(item)" :index="item.parentNode" v-for="(item, index) in moduleArr" :key=index>{{item.parentNode}}</el-menu-item>
        </el-submenu>
        <el-menu-item v-if="curRole=='系统管理员'" index="host" @click="selModle({'childNode':[{link:'/sf_cloud/workbench/host'}],'name':'adminResourcesManage'})">HOST</el-menu-item>
        <el-menu-item index="vm" @click="linkToModel('vm')">VM</el-menu-item>
        <el-menu-item index="safeGroup" @click="linkToModel('safeGroup')">安全组</el-menu-item>
        <el-menu-item index="workOrder" @click="linkToModel('workOrder')">工单</el-menu-item>
      </el-menu>
    </div>
    <div class="userInfo">
      <div class="itemBox" style="margin-right:15px;" v-if="curRole != '系统管理员'&&curRole != '一般管理员'" @mouseover="leseeOverShow()" @mouseout="leseeOutHide()">
        <span>
          <i class="iconfont icon-ziyuan6"></i>&nbsp;&nbsp;{{curLesse.tenant_name}}
        </span>
        <transition name="fade">
          <div class='cardBox' v-if='leseeShow&&lesseeArr.length>1'>
            <el-card class="box-card">
              <div slot="header" class="clearfix cardHeader">
                <span :title='curLesse.tenant_name'>当前租户： {{curLesse.tenant_name}}</span>
              </div>
              <div v-for="(item,index) in lesseeArr" :key='index' @click="checkoutLessee(item)" class="text item">
                {{item.tenant_name}}
              </div>
            </el-card>
          </div>
        </transition>
      </div>
      <div class="itemBox" @mouseover="authOverShow()" @mouseout="authOutHide()">
        <span v-show="curRole === '系统管理员'">
          <img class='roleImg' @mouseover="authOverShow()" @mouseout="authOutHide()" src="/static/image/header/admin.png" alt="">&nbsp;&nbsp;{{userInfo.user_name}}
        </span>
        <span v-show="curRole === '一般管理员'">
          <img class='roleImg' @mouseover="authOverShow()" @mouseout="authOutHide()" src="/static/image/header/webmaster.png" alt="">&nbsp;&nbsp;{{userInfo.user_name}}
        </span>
        <span v-show="curRole === '用户'">
          <img class='roleImg' src="/static/image/header/user.png" alt="">&nbsp;&nbsp;{{userInfo.user_name}}
        </span>
        <transition name="fade">
          <div class='cardBox' v-if="userAuthShow">
            <el-card class="box-card">
              <div slot="header" class="clearfix cardHeader">
                <span>当前权限： {{curRole}}</span>
                <el-button @click='logout' style="float: right; padding: 5px 0;font-size: 16px;" type="text">退出</el-button>
              </div>
              <div v-for="(item,index) in roleArr" :key='index' @click="checkoutRole(item)" class="text item" :class='{curActive:curRole==item}'>
                {{item}}
              </div>
            </el-card>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { navData } from '../../data/navData.js'
import { loginout } from '@/api/loginout'
export default {
  props: ['activeIndex'],
  data() {
    return {
      leseeShow: false,
      userAuthShow: false,
      navData,
      moduleArr: [],
      curLesse: {},
      lesseeArr: [],
      curRole: '', // 管理员/用户
      roleArr: []
    }
  },
  mounted() {
    this.curRole = this.userInfo.curRole
    this.roleArr = this.userInfo.roleArr
    this.lesseeArr = this.userInfo.user_tenant
    this.curLesse = this.userInfo.tenantInfo
    this.formatePage()
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    loginout,
    ...mapActions({
      updateLocalNav: 'updateLocalNav',
      updateCurRole: 'updateCurRole',
      updateUserInfo: 'updateUserInfo'
    }),
    leseeOverShow() {
      this.leseeShow = true
    },
    leseeOutHide() {
      this.leseeShow = false
    },
    authOverShow() {
      this.userAuthShow = true
    },
    authOutHide() {
      this.userAuthShow = false
    },
    linkToModel(name) {
      switch (name) {
        case 'vm':
          if (this.curRole === '系统管理员') {
            this.selModle({
              childNode: [{ link: '/sf_cloud/workbench/vm' }],
              name: 'adminResourcesManage'
            })
          } else {
            this.selModle({
              childNode: [{ link: '/sf_cloud/workbench/userVm' }],
              name: 'userResourcesManage'
            })
          }
          break
        case 'safeGroup':
          if (this.curRole === '系统管理员') {
            this.selModle({
              childNode: [{ link: '/sf_cloud/workbench/safeGroup' }],
              name: 'adminResourcesManage'
            })
          } else {
            this.selModle({
              childNode: [{ link: '/sf_cloud/workbench/userSafeGroup' }],
              name: 'userResourcesManage'
            })
          }
          break
        case 'workOrder':
          if (this.curRole === '系统管理员') {
            this.selModle({
              childNode: [{ link: '/sf_cloud/workbench/adminWorkList' }],
              name: 'adminWorkOrder'
            })
          } else {
            this.selModle({
              childNode: [{ link: '/sf_cloud/workbench/userWorkList' }],
              name: 'userWorkOrder'
            })
          }
          break
      }
    },
    selModle(item) {
      this.updateLocalNav(item.name)
      localStorage.setItem('localNav', JSON.stringify(item.name))
      this.$router.push(item.childNode[0].link)
    },
    goToOverView(item) {
      if (this.curRole === '系统管理员') {
        this.$router.push('/sf_cloud/adminOverView')
      } else if (this.curRole === '用户') {
        this.$router.push('/sf_cloud/UserOverView')
      }
      // this.store.state.navArr = {
      //   parentNode: '总览',
      //   childNode: []
      // }
    },
    logout() {
      localStorage.clear()
      localStorage.removeItem('userInfo')
      this.$router.push('/')
      this.loginout()
    },
    formatePage() {
      switch (this.curRole) {
        case '系统管理员':
          this.moduleArr = this.navData.admin
          break
        case '一般管理员':
          this.moduleArr = this.navData.areaAdmin
          break
        case '用户':
          this.moduleArr = this.navData.user
          break
      }
    },
    checkoutRole(item) {
      let userInfo = this.userInfo
      switch (item) {
        case '系统管理员':
          this.curRole = '系统管理员'
          this.moduleArr = this.navData.admin
          userInfo.curRole = item
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.updateUserInfo(userInfo)
          this.$router.replace({
            path: '/sf_cloud/adminOverView',
            query: { isChange: item }
          })
          break
        case '一般管理员':
          this.curRole = '一般管理员'
          this.moduleArr = this.navData.areaAdmin
          userInfo.curRole = item
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.updateUserInfo(userInfo)
          this.$router.replace({
            path: '/sf_cloud/adminOverView',
            query: { isChange: item }
          })
          break
        case '用户':
          this.curRole = '用户'
          this.moduleArr = this.navData.user
          userInfo.curRole = item
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.updateUserInfo(userInfo)
          this.$router.replace('/sf_cloud/UserOverView')
          break
      }
    },
    checkoutLessee(item) {
      this.curLesse = item
      let userInfo = this.userInfo
      userInfo.tenantInfo = item
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      this.updateUserInfo(userInfo)
      this.$router.push({
        path: '/sf_cloud/UserOverView',
        query: { isChange: item.tenant_uuid }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 60px;
  background-color: rgb(84, 92, 100);
  box-sizing: border-box;
  padding: 0 15px;
  vertical-align: middle;
  min-width: 1024px;
  & > .nav_top {
    margin-left: 20px;
    display: inline-block;
    & > ul > .el-menu-item:first-child {
      margin-left: 0;
      width: 120px;
      text-align: center;
    }
  }
  & > .title {
    display: inline-block;
    color: #fff;
    font-size: 18px;
    line-height: 60px;
    vertical-align: top;
  }
  & > .userInfo {
    float: right;
    height: 60px;
    line-height: 60px;
    padding-right: 15px;
    .itemBox {
      float: left;
      display: inline-block;
      color: #fff;
      font-size: 14px;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .icon-ziyuan6 {
        font-size: 16px;
      }
      & > span {
        cursor: pointer;
      }
      .roleImg {
        width: 30px;
        vertical-align: middle;
        margin-bottom: 10px;
      }
      .cardBox {
        position: absolute;
        width: 250px;
        right: 25px;
        .text {
          font-size: 14px;
          line-height: 40px;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
        .curActive {
          color: #409eff;
        }
        .cardHeader {
          line-height: 30px;
          height: 30px;
        }

        .clearfix:before,
        .clearfix:after {
          display: table;
          content: '';
        }
        .clearfix:after {
          clear: both;
        }

        .box-card {
          width: 100%;
          background: #545c64;
          color: #fff;
        }
      }
    }

    & > ul {
      display: inline-block;
      .userItem {
        display: inline-block;
        position: relative;
        a {
          display: inline-block;
          // padding: 22px 15px;
          // overflow-x: hidden;
          // text-overflow: ellipsis;
          color: #fff;
          &:hover {
            background: rgb(67, 74, 80);
            color: #2277da;
          }
          &.item_a {
            text-align: center;
            padding-right: 28px;
            i {
              position: absolute;
              right: 12px;
              top: 23px;
            }
          }
        }
        & > div {
          position: absolute;
          width: 100%;
          left: 0;
          top: 60px;
          padding-top: 5px;
          background: transparent;
          & > ul {
            & > li {
              width: 120%;
              height: 40px;
              line-height: 40px;
              padding-left: 15px;
              background: #545c64;
              &:hover {
                background: rgb(67, 74, 80);
              }
              & > a {
                padding: 0 15px;
              }
            }
          }
        }
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>