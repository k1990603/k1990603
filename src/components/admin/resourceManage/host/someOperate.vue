<template>
  <div>
    <div class="deleteContent " v-loading="submitLoading"  element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
      <div class="oldInfo">
        <div class="itemInfo">
          <label>名称</label>
          <span>{{hostDeltails.name}}</span>
        </div>
        <div class="itemInfo">
          <label>HOST IP</label>
          <span>{{hostDeltails.host_ip}}</span>
        </div>
        <div class="itemInfo">
          <label>所属集群</label>
          <span>{{hostDeltails.hostcluster}}</span>
        </div>
        <div class="itemInfo">
          <label>所在机房</label>
          <span>{{hostDeltails.datacenter}}</span>
        </div>
      </div>
      <div class="tipText">
        确定执行
        <span>{{title}}</span>
        操作？
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="$emit('someOperateRes')">取 消</el-button>
    </span>
  </div>
</template>
<script>
import {
  operateSome,
  deleteHost,
  lockHost,
  maintainHost
} from '@/api/admin/hostManage'
export default {
  props: ['hostDeltails', 'title', 'id'],
  watch: {
    id(val) {
      this.submitLoading = false
    }
  },
  data() {
    return {
      submitLoading: false,
      flag: ''
    }
  },
  computed: {},
  methods: {
    operateSome,
    deleteHost,
    lockHost,
    maintainHost,
    formart() {
      switch (this.$props.title) {
        case '开机':
          this.flag = 0
          break
        case '强制关机':
          this.flag = 1
          break
        case '关机':
          this.flag = 2
          break
        case '重启':
          this.flag = 3
          break
        case '强制重启':
          this.flag = 4
          break
      }
    },
    formartLock() {
      switch (this.$props.title) {
        case '解除锁定':
          this.flag = 0
          break
        case '锁定':
          this.flag = 1
          break
      }
    },
    formartMaintain() {
      switch (this.$props.title) {
        case '维护':
          this.flag = 2
          break
        case '解除维护':
          this.flag = 0
          break
      }
    },
    submit() {
      this.submitLoading = true
      switch (this.$props.title) {
        case '开机':
        case '强制关机':
        case '关机':
        case '重启':
        case '强制重启':
          this.formart()
          this.operateSome({
            host_uuid: this.$props.hostDeltails.host_uuid,
            flag: this.flag
          }).then(res => {
            this.submitLoading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: this.$props.title + '成功'
              })
              this.$emit('someOperateRes')
            }
          })
          break
        case '解除锁定':
        case '锁定':
          this.formartLock()
          this.lockHost({
            host_uuid: this.$props.hostDeltails.host_uuid,
            flag: this.flag
          }).then(res => {
            this.submitLoading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: this.$props.title + '成功'
              })
              this.$emit('someOperateRes')
            }
          })
          break
        case '维护':
        case '解除维护':
          this.formartMaintain()
          this.maintainHost({
            host_uuid: this.$props.hostDeltails.host_uuid,
            flag: this.flag
          }).then(res => {
            this.submitLoading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: this.$props.title + '成功'
              })
              this.$emit('someOperateRes')
            }
          })
          break
        case '删除':
          this.deleteHost({
            host_uuid: this.$props.hostDeltails.host_uuid
          }).then(res => {
            this.submitLoading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: this.$props.title + '成功'
              })
              this.$emit('someOperateRes')
            }
          })
      }
    }
  }
}
</script>
<style lang="less">
.deleteContent {
  .tipText {
    margin-bottom: 15px;
    padding: 15px 10px;
    vertical-align: middle;
    color: #264663;
    border: 1px solid #7ab1de;
    border-radius: 2px;
    background: #d2e7f7;
    margin-top: 15px;
    font-size: 16px;
    span {
      font-size: 18px;
      color: #f00;
    }
  }
  .oldInfo {
    & > h3 {
      margin-bottom: 15px;
    }
    .itemInfo {
      font-size: 16px;
      padding-left: 15px;
      padding-bottom: 15px;
      & > label {
        width: 120px;
        display: inline-block;
      }
      & > span {
        color: #999;
      }
      & > .nameBox {
        display: inline-block;
      }
      &.textAreaBox {
        & > label {
          vertical-align: top;
        }
        .nameBox {
          width: 400px;
        }
      }
    }
  }
}
</style>
