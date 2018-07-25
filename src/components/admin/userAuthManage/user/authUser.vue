<template>
  <div class="authAdminContent">
    <div class="oldInfo">
      <div class="itemInfo">
        <label>工号</label>
        <span>{{rowInfo.user_id}}</span>
      </div>
      <div class="itemInfo">
        <label>姓名</label>
        <span>{{rowInfo.user_name}}</span>
      </div>
      <div class="itemInfo">
        <label>状态</label>
        <span>{{formateStatus(rowInfo.status)}}</span>
      </div>
    </div>
    <div class="tipText">
      确定执行
      <span>{{isActive ? '激活用户':'禁用用户'}}</span>
      操作？
    </div>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="$emit('activeResponse')">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { activeUser, disabledUser } from '@/api/admin/lesseeManage'
import { formateStatus } from '@/filters/index'
export default {
  props: ['rowInfo', 'isActive'],
  data() {
    return {}
  },
  mounted() {
    console.log(this.rowInfo)
  },
  methods: {
    activeUser,
    disabledUser,
    formateStatus,
    submit() {
      if (this.isActive) {
        this.activeUser({
          user_id: this.rowInfo.user_id,
          role_id: this.rowInfo.role_type_id
        }).then(res => {
          if (res.data.code != 0) {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          } else {
            this.$message({
              type: 'success',
              message: '激活成功'
            })
            this.$emit('activeResponse')
          }
        })
      } else {
        this.disabledUser({
          user_id: this.rowInfo.user_id,
          role_id: this.rowInfo.role_type_id
        }).then(res => {
          if (res.data.code != 0) {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          } else {
            this.$message({
              type: 'success',
              message: '禁用成功'
            })
            this.$emit('activeResponse')
          }
        })
      }
    }
  }
}
</script>
<style lang="less">
.authAdminContent {
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
