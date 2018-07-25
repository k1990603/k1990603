<template>
  <div class="resetPwdDialog dialogTemplate">
    <el-table :data="[rowInfo]">
      <el-table-column prop="instance_uuid" label="UUID" :show-overflow-tooltip='true' min-width="150"></el-table-column>
      <el-table-column prop="displayname" label="主机名" :show-overflow-tooltip='true' width="200"></el-table-column>
      <el-table-column prop="ip_address" label="IP地址" :show-overflow-tooltip='true'></el-table-column>
    </el-table>
    <el-form label-width="80px" style="margin-top:15px;" ref='resetForm' :model='formData' :rules='formRules'>
      <el-form-item label="用户名">
        <el-radio-group>
          <el-radio-button v-if="rowInfo.os_type=='linux'" label="root"></el-radio-button>
          <el-radio-button v-if="rowInfo.os_type=='windows'" label="administrator"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="新密码" prop='password'>
        <el-col :span="8">
          <el-input placeholder="请输入新密码" type='password' v-model.trim='formData.password' auto-complete='off'></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop='passwordAgain'>
        <el-col :span="8">
          <el-input placeholder="请确认密码" type='password' v-model.trim='formData.passwordAgain' auto-complete='off'></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click='submit'>确 定</el-button>
      <el-button @click='cancel'>取 消</el-button>
    </span>
  </div>
</template>
<script>
import { checkPassword } from '@/filters/index'
import { resetPass } from '@/api/admin/vm'
export default {
  props: ['rowInfo'],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!this.checkPassword(value)) {
        callback(new Error('大小写字母+数字+特殊字符8位以上'))
      } else {
        if (this.formData.passwordAgain !== '') {
          this.$refs.resetForm.validateField('passwordAgain')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        password: '',
        passwordAgain: ''
      },
      formRules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        passwordAgain: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetPass,
    checkPassword,
    submit() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.resetPass({
            new_root_password: this.formData.password,
            instance_uuid: this.$props.rowInfo.instance_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.cancel()
            }
          })
        }
      })
    },
    cancel() {
      this.$refs.resetForm.resetFields()
      this.$emit('resetPwdRes')
    }
  }
}
</script>
<style lang=less>
.resetPwdDialog {
  .tipText {
    margin-top: 15px;
    font-size: 16px;
    span {
      font-size: 18px;
      color: #f00;
    }
  }
}
</style>

