<template>
  <div class="editPwdPage">
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
    <el-form label-width="100px" :model="userInfo" status-icon :rules="userPwdRules" ref="userPwdInfo">
      <el-form-item label="密码" prop="pwd">
        <el-col :span="12">
          <el-input v-model="userInfo.pwd" type='password'></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="pwd1">
        <el-col :span="12">
          <el-input v-model="userInfo.pwd1" type='password'></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="$emit('editPwdRes')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { editUserPwd } from '@/api/admin/lesseeManage'
import { formateStatus, checkPassword } from '@/filters/index'
export default {
  props: ['rowInfo'],
  data() {
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!this.checkPassword(value)) {
        callback(new Error('密码格式不正确(大小写字母+数字+特殊字符十位以上)'))
      } else {
        if (this.userInfo.pwd1 !== '') {
          this.$refs.userPwdInfo.validateField('pwd1')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userInfo.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {
        pwd: '',
        pwd1: ''
      },
      userPwdRules: {
        pwd1: [{ validator: validatePass2, trigger: 'blur' }],
        pwd: [{ validator: checkPass, trigger: 'blur' }]
      }
    }
  },
  computed: {},
  methods: {
    formateStatus,
    editUserPwd,
    checkPassword,
    submit() {
      this.$refs['userPwdInfo'].validate(valid => {
        if (valid) {
          console.log(this.rowInfo)
          this.editUserPwd({
            user_id: this.rowInfo.user_id,
            old_user_password: this.userInfo.pwd,
            new_user_password: this.userInfo.pwd1
          }).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$emit('editPwdRes')
              this.$refs['userPwdInfo'].resetFields()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.editPwdPage {
  .oldInfo {
    & > h3 {
      margin-bottom: 15px;
    }
    .itemInfo {
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      & > label {
        width: 100px;
        text-align: right;
        padding-right: 12px;
        box-sizing: border-box;
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
  .dialog-footer {
    display: inline-block;
    text-align: center;
    width: 100%;
  }
}
</style>
