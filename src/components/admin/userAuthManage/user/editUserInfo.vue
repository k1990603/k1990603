<template>
  <div class="editUserInfo dialogTemplate">
    <el-form label-width="120px" :model="userDel" status-icon :rules="userDelRules" ref="userDel">
      <el-form-item label="账户名称">
        <el-col :span="12">
          <el-input v-model="userDel.userid" :disabled="true"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="账户显示名称" prop="username">
        <el-col :span="12">
          <el-input v-model="userDel.username"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-col :span="12">
          <el-input v-model="userDel.email"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-col :span="12">
          <el-input v-model="userDel.telephone"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="$emit('editProInfoRes')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { editUserInfo } from '@/api/admin/lesseeManage'
import { checkEmail, checkTel, formateStatus } from '@/filters/index'
export default {
  props: ['userDel'],
  data() {
    var checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱名'))
      } else if (!this.checkEmail(value)) {
        console.log(this.checkEmail(value))
        callback(new Error('请输入正确的邮箱名'))
      } else {
        callback()
      }
    }
    var checkTelphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'))
      } else if (!this.checkTel(value)) {
        console.log(this.checkTel(value))
        callback(new Error('请输入正确的电话号码'))
      } else {
        callback()
      }
    }
    return {
      userDelRules: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        telephone: [{ validator: checkTelphone, trigger: 'blur' }]
      }
    }
  },
  computed: {},
  methods: {
    checkEmail,
    checkTel,
    formateStatus,
    editUserInfo,
    submit() {
      this.$refs['userDel'].validate(valid => {
        if (valid) {
          this.editUserInfo({
            id_for_user: this.userDel.id,
            email: this.userDel.email,
            user_name: this.userDel.username,
            telephone: this.userDel.telephone
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
              this.$emit('editProInfoRes')
              this.$refs['userDel'].resetFields()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.editUserInfo {
  .unit {
    padding-left: 5px;
  }
}
</style>
