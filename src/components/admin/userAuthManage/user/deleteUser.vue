<template>
  <div class="deleteContent dialogTemplate">
    <div class="oldInfo">
      <div class="itemInfo">
        <label>账户名称</label>
        <span>{{rowInfo.user_id}}</span>
      </div>
      <div class="itemInfo">
        <label>显示名称</label>
        <span>{{rowInfo.user_name}}</span>
      </div>
      <div class="itemInfo">
        <label>状态</label>
        <span>{{formateStatus(rowInfo.status)}}</span>
      </div>
    </div>
    <div class="tipText">
      确定执行
      <span>删除</span>
      操作？
    </div>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="$emit('deleteResponse')">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { deleteUser } from '@/api/admin/lesseeManage'
import { formateStatus } from '@/filters/index'
export default {
  props: ['rowInfo'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    formateStatus,
    deleteUser,
    submit() {
      this.deleteUser({
        user_id: this.rowInfo.user_id,
        tenant_uuid: this.rowInfo.tenant_uuid
      }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$emit('deleteResponse')
        }
      })
    }
  }
}
</script>
<style lang="less">
.deleteContent {
  .tipText {
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
