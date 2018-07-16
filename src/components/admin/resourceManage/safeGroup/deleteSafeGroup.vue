<template>
  <div class="deleteSafeGroup dialogTemplate">
    <div class="oldSafeGroupInfo">
      <div class="itemInfo">
        <label>名称</label>
        <span>{{rowInfo.name}}</span>
      </div>
      <div class="itemInfo">
        <label>备注</label>
        <span>{{rowInfo.description}}</span>
      </div>
      <div class="itemInfo" v-if="!rowInfo.isTmp">
        <label>所属租户</label>
        <span>{{rowInfo.tenant_name}}</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { deleteSecurity } from '@/api/admin/securityManage'
export default {
  props: ['rowInfo'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    deleteSecurity,
    cancel() {
      this.$emit('deleteRes')
    },
    submit() {
      let options = {}
      let bind_vm = {}
      if (!this.$props.rowInfo.isTmp) {
        let query_info = this.$props.rowInfo.nic_info
        query_info.forEach(item => {
          for (var i in item) {
            if (!bind_vm[i]) {
              bind_vm[i] = [item[i]]
            } else {
              bind_vm[i].push(item[i])
            }
          }
        })
      }
      options.bind_vm = JSON.stringify(bind_vm)
      options.security_uuid = this.$props.rowInfo.uuid
      options.is_tmp = this.$props.rowInfo.isTmp ? '1' : '0'
      this.deleteSecurity(options).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$emit('deleteRes')
        }
      })
    }
  }
}
</script>
<style lang="less">
.deleteSafeGroup {
  .oldSafeGroupInfo {
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
