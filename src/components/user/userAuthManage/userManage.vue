<template>
  <div class="lesseeUserPage">
    <div class="defaultScope">
      <div class="curPage">我的信息</div>
    </div>
    <div class="myMessage">
      <el-row :gutter="20">
        <el-col :span='12'>
          <el-card>
            <div class="item-title">基本信息</div>
            <div class="item">
              <span class='item-label'>我的用户ID</span>
              <span class='item-value'>{{defaultInfo.userid==''?'暂无':defaultInfo.userid}}</span>
            </div>
            <div class="item">
              <span class='item-label'>我的用户名称</span>
              <span class='item-value'>{{defaultInfo.username==''?'暂无':defaultInfo.username}}</span>
            </div>
            <div class="item">
              <span class='item-label'>我的邮箱</span>
              <span class='item-value'>{{defaultInfo.email==''?'暂无':defaultInfo.email}}</span>
            </div>
            <div class="item">
              <span class='item-label'>我的电话</span>
              <span class='item-value'>{{defaultInfo.telephone==''?'暂无':defaultInfo.telephone}}</span>
            </div>
            <div class="item">
              <span class='item-label'>我的操作</span>
              <span class='item-value'>
                <el-button type="text" size="small" @click="centerPassword = true" v-if="defaultInfo.auth_type!=0">重置密码</el-button>
                <el-button type="text" size="small" @click="editInfo" v-if="defaultInfo.auth_type!=0">修改信息</el-button>
                <span v-if="defaultInfo.auth_type==0">暂无</span>
              </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span='12'>
          <el-card>
            <div class="item">
              <div class="item-title">所属项目租户</div>
              <div class="tableBox">
                <el-table :data="defaultInfo.tenant_project" width='100%'>
                  <el-table-column prop="project_name" label="所属项目">
                    <template slot-scope='scope'>
                      {{scope.row.project_name == null ? "暂无" : scope.row.project_name}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="tenant_name" label="所属租户">
                    <template slot-scope='scope'>
                      {{scope.row.tenant_name == null ? "暂无" : scope.row.tenant_name}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- </el-card> -->
    </div>
    <div class="message">
      <el-dialog title="修改信息" :visible.sync="centerDialogVisible" width="650px" center>
        <el-form :model="editParams" ref="ruleForm" :rules="editInfoRules" label-width="100px">
          <el-form-item label="名称" required prop="user_name">
            <el-col :span="18">
              <el-input type="text" v-model="editParams.user_name" placeholder="请输入新用户名"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="邮箱" required prop="email">
            <el-col :span="18">
              <el-input type="text" v-model="editParams.email" placeholder="请输入新邮箱"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="电话" required prop="telephone">
            <el-col :span="18">
              <el-input type="text" v-model="editParams.telephone" placeholder="请输入电话"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('ruleForm','centerDialogVisible')">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="password">
      <el-dialog title="修改密码" :visible.sync="centerPassword" width="650px" center>
        <el-form :model="pwdData" :rules="pwdRule" ref="password" label-width="100px">
          <!-- <el-form-item label="旧密码" required>
            <el-col :span="18">
              <el-input type="text" placeholder="请输入旧密码"></el-input>
            </el-col>
          </el-form-item> -->
          <el-form-item label="新密码" required prop="pwd1">
            <el-col :span="18">
              <el-input type="password" v-model="pwdData.pwd1" placeholder="请输入新密码"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认新密码" required prop="pwd2">
            <el-col :span="18">
              <el-input type="password" v-model="pwdData.pwd2" placeholder="请输入新密码"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('password','centerPassword')">取 消</el-button>
          <el-button type="primary" @click="submitPwd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { editUserPwd, editUserInfo } from '@/api/admin/lesseeManage'
import { getUserDetails } from '@/api/user/userAuthManage.js'
import { checkEmail, checkTel, checkPassword } from '@/filters/index'
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdData.pwd1) {
        callback(new Error('两次输入密码不一致!'))
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
        if (this.pwdData.pwd2 !== '') {
          this.$refs.password.validateField('pwd2')
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
    return {
      defaultInfo: [],
      auth_type: 0,
      centerDialogVisible: false,
      centerPassword: false,
      editParams: {
        username: '',
        id_for_user: '',
        email: '',
        telephone: ''
      },
      editInfoRules: {
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        telephone: [{ validator: checkTelphone, trigger: 'blur' }]
      },
      pwdData: {
        pwd1: '',
        pwd2: ''
      },
      pwdRule: {
        pwd2: [{ validator: validatePass2, trigger: 'blur' }],
        pwd1: [{ validator: checkPass, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    editUserPwd,
    editUserInfo,
    checkEmail,
    checkTel,
    checkPassword,
    getUserDetails,
    getInfo() {
      this.getUserDetails().then(res => {
        this.auth_type = res.data.data.auth_type
        this.defaultInfo = res.data.data
      })
    },
    editInfo() {
      this.editParams.user_name = this.defaultInfo.username
      this.editParams.id_for_user = this.defaultInfo.id
      this.editParams.email = this.defaultInfo.email
      this.editParams.telephone = this.defaultInfo.telephone
      this.centerDialogVisible = true
    },
    cancel(ref, bol) {
      this[bol] = false
      this.$refs[ref].resetFields()
    },
    submitEdit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.editUserInfo(this.editParams).then(res => {
            if (res.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'suucess',
                message: '修改信息成功'
              })
              this.centerDialogVisible = false
              this.$refs['ruleForm'].resetFields()
            }
          })
        }
      })
    },
    submitPwd() {
      let params = {
        new_user_password: this.pwdData.pwd1,
        user_id: this.defaultInfo.userid
      }
      this.$refs['password'].validate(valid => {
        if (valid) {
          this.editUserPwd(params).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'suucess',
                message: '重置密码成功'
              })
              this.centerPassword = false
              this.$refs['password'].resetFields()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.lesseeUserPage {
  .defaultScope {
    .curPage {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      line-height: 50px;
      font-weight: 700;
      margin-right: 20px;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .myMessage {
    // padding: 40px 0 0 50px;
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    .el-dropdown-link {
      cursor: pointer;
      color: #2277da;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
    table {
      font-size: 16px;
      width: 500px;
      background-color: #f2f2f2;
      tr {
        td {
          // width: 50px;
          padding: 12px;
        }
      }
    }
  }
}
.btnList {
  margin-left: 10px;
}
// .box-card {
.item-title {
  width: 100px;
  line-height: 36px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #ccc;
  margin-bottom: 10px;
  text-align: center;
}
.item {
  // vertical-align: top;
  padding: 10px 0;
  padding-left: 30px;
  .sysEdit {
    color: #128dff;
    font-size: 16px;
    cursor: pointer;
  }
  .item-label {
    display: inline-block;
    // vertical-align: top;
    width: 120px;
    text-align: left;
  }
  .item-value {
    display: inline-block;
    vertical-align: top;
    // margin-left: 10px;
    color: #999;
    width: 200px;
  }
  // .center {
  //   // text-align: center;
  //   // width: 50px;
  // }
  .tableBox {
    th > div,
    td > div {
      text-align: left;
      font-size: 14px;
    }
  }
}
// }
</style>
