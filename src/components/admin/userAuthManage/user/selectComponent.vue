<template>
  <div class="searchList">
    <a href="javascript:;" class="parentName" :class="{active: isShow}" @click="isShow=!isShow">
      <span>{{searchTitle.tenant_name}}</span>
      <i class="el-icon-arrow-down" v-if="!isShow"></i>
      <i class="el-icon-arrow-up" v-if="isShow"></i>
    </a>
    <ul class="childList" v-if="isShow">
      <li v-for="(item, index) in [{ tenant_name: '全部租户', tenant_uuid: '-1' }].concat(tenantList)" :key="index" @click="setSearchTitle(item)">
        {{item.tenant_name}}
      </li>
    </ul>
  </div>
</template>
<script>
// import { getLesseeNameList } from '@/api/admin/lesseeManage'
export default {
  props: ['tenantList'],
  data() {
    return {
      isShow: false,
      searchTitle: { tenant_name: '全部租户', tenant_uuid: '-1' }
    }
  },
  mounted() {
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) this.isShow = false
    })
  },
  computed: {},
  methods: {
    setSearchTitle(item) {
      this.searchTitle = item
      this.$emit('getSelect', item)
      this.isShow = false
    }
  }
}
</script>
<style lang="less">
.searchList {
  padding-left: 15px;
  display: inline-block;
  position: relative;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
  .parentName {
    display: inline-block;
    position: relative;
    height: 36px;
    line-height: 36px;
    white-space: nowrap;
    font-size: 13px;
    padding: 0 10px;
    border-width: 1px 1px 0;
    border-style: solid;
    border-color: transparent;
    z-index: 2;
    color: #404a58;
    cursor: pointer;
    &.active {
      border-color: #d1d2d3;
      background-color: #fff;
    }
    span {
      padding-right: 10px;
    }
    i {
      float: right;
      line-height: 36px;
    }
  }
  .childList {
    position: absolute;
    margin-top: -1px;
    border: 1px solid #ddd;
    z-index: 1;
    white-space: nowrap;
    & > li {
      color: #404a58;
      padding: 0 10px;
      text-align: left;
      box-sizing: border-box;
      min-width: 121px;
      font-weight: 400;
      height: 36px;
      line-height: 36px;
      background: #fff;
      cursor: default;
      &.active {
        background-color: #409eff;
        color: #fff;
      }
      &:not(.active):hover {
        background-color: #ddd;
      }
    }
  }
}
</style>
