<template>
  <div class="addMemberInfo dialogTemplate">
    <el-form label-width="100px">
      <el-form-item label="用户类型">
        <el-radio-group v-model="userType">
          <el-radio :label="1">添加已有用户(或内部用户)</el-radio>
          <el-radio :label="2">新增外部用户</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form :model="userInfo" status-icon :rules="userRules" ref="userInfo" label-width="100px" class="demo-ruleForm">
      <el-form-item ref="exit_id" label="账号名称" prop="exit_id" v-if="userType == 1">
        <el-col :span="12">
          <el-input type="text" v-model="userInfo.exit_id" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>
      <div v-if="userType == 2">
        <el-form-item label="账号名称" prop='user_id'>
          <el-col :span="12">
            <el-input v-model="userInfo.user_id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="显示名称" prop='user_name'>
          <el-col :span="12">
            <el-input v-model="userInfo.user_name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="账号密码" prop='passwd'>
          <el-col :span="12">
            <el-input v-model="userInfo.passwd" type="password" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码" prop='_passwd'>
          <el-col :span="12">
            <el-input v-model="userInfo._passwd" type="password" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="我的邮箱" prop='email'>
          <el-col :span="12">
            <el-input v-model="userInfo.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="我的电话" prop='phone'>
          <el-col :span="12">
            <el-input v-model="userInfo.phone"></el-input>
          </el-col>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="$emit('addMember')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  createLesseeList,
  addExistMember,
  addNewMember
} from '@/api/admin/lesseeManage'
import {
  checkEmail,
  checkTel,
  checkPassword,
  checkUserName
} from '@/filters/index'
export default {
  props: ['rowInfo'],
  data() {
    var checkUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户名称'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('账户名格式不正确(大小写字母+数字6-20位)'))
      } else {
        callback()
      }
    }
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!this.checkPassword(value)) {
        callback(new Error('密码格式不正确(大小写字母+数字+特殊字符十位以上)'))
      } else {
        if (this.userInfo._passwd !== '') {
          this.$refs.userInfo.validateField('_passwd')
        }
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱名'))
      } else if (!this.checkEmail(value)) {
        callback(new Error('请输入正确的邮箱名'))
      } else {
        callback()
      }
    }
    var checkTelphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'))
      } else if (!this.checkTel(value)) {
        callback(new Error('请输入正确的电话号码'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userInfo.passwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {
        exit_id: '',
        user_id: '',
        tenant_uuid: '',
        project_uuid: '',
        user_name: '',
        passwd: '',
        _passwd: '',
        email: '',
        phone: ''
      },
      userType: 1,
      userRules: {
        user_id: [{ validator: checkUserName, trigger: 'blur' }],
        exit_id: [{ validator: checkUserName, trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        phone: [{ validator: checkTelphone, trigger: 'blur' }],
        _passwd: [{ validator: validatePass2, trigger: 'blur' }],
        passwd: [{ validator: checkPass, trigger: 'blur' }]
      },
      existUserRules: {}
    }
  },
  computed: {},
  methods: {
    checkEmail,
    checkTel,
    checkPassword,
    checkUserName,
    addExistMember,
    addNewMember,
    submitForm() {
      this.$refs['userInfo'].validate(valid => {
        if (valid) {
          switch (this.userType) {
            case 1:
              this.addExistMember({
                user_id: this.userInfo.exit_id,
                tenant_uuid: this.$props.rowInfo.tenant_uuid,
                project_uuid: this.$props.rowInfo.project_uuid,
                client_user_type:
                  process.env.NODE_ENV == 'development' ? '1' : '0'
              }).then(res => {
                if (res.data.code != 0) {
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                  this.$emit('addMember')
                  this.$refs['userInfo'].resetFields()
                }
              })
              break
            case 2:
              this.addNewMember({
                user_id: this.userInfo.user_id,
                tenant_uuid: this.$props.rowInfo.tenant_uuid,
                project_uuid: this.$props.rowInfo.project_uuid,
                user_name: this.userInfo.user_name,
                passwd: this.userInfo.passwd,
                email: this.userInfo.email,
                phone: this.userInfo.phone
              }).then(res => {
                if (res.data.code != 0) {
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                  this.$emit('addMember')
                  this.$refs['userInfo'].resetFields()
                }
              })
          }
        }
      })
    }
  }
}
</script>
<style lang="less">
.editProjectInfo {
  .unit {
    padding-left: 5px;
  }
}
</style>
