<template>
  <div class="login">
    <div class="container">
      <p class="login_logo">丰云2.0</p>
    </div>
    <div class="login_bg">
      <div class="login_box container">
        <div class="login_frame">
          <el-form :model="loginParams" :rules="rules" ref="loginParams">
            <el-form-item prop="userid">
              <div class="item">
                <el-input
                  v-model="loginParams.userid"
                  tabindex="1"
                  @keyup.enter.native="submitForm('loginParams')"
                  placeholder="账号"
                >
                  <template slot="prepend">
                    <i class="fa fa-user-o iconStyle"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="item">
                <el-input
                  @keyup.enter.native="submitForm('loginParams')"
                  tabindex="2"
                  v-model="loginParams.password"
                  type="password"
                  placeholder="密码"
                >
                  <template slot="prepend">
                    <i class="fa fa-unlock-alt iconStyle"></i>
                  </template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item>
              <!-- <div class="item">
                <a @click="submitForm('loginParams')">
                  <img src="./../../../static/image/login/login_btn.gif" alt="">
                </a>
              </div>-->
              <div class="item" v-if="!isLogining">
                <el-button @click="submitForm('loginParams')">登&nbsp;&nbsp;&nbsp;录</el-button>
              </div>
              <div class="item" v-if="isLogining">
                <el-button
                  @click="submitForm('loginParams')"
                  :disabled="isLogining"
                >登&nbsp;录&nbsp;中...&nbsp;</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isLogining: false,
      loginParams: {
        userid: "", // 用户名
        password: "", // 密码
        auth_type: 0 // 0为AD登录 1 为外部用户登录
      },
      rules: {
        userid: [{ required: true, message: "请输入账户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    this.loginParams.auth_type = process.env.NODE_ENV == "development" ? 0 : 1;
  },
  methods: {
    ...mapActions({
      updateUserInfo: "updateUserInfo"
    }),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    login() {
      this.isLogining = true;
      this.$router.push("/sf_cloud/userOverView");
      // this.$axios.post('/login', this.loginParams).then(res => {
      //   this.isLogining = false
      //   if (res.data.code === 0) {
      //     let userInfo = res.data.data
      //     let roleArr = []
      //     if (userInfo.user_role_type.length > 0) {
      //       userInfo.user_role_type = Array.from(
      //         new Set(userInfo.user_role_type)
      //       )
      //       userInfo.user_role_type.forEach((item, index) => {
      //         roleArr.push(this.$store.state.user.allRole[parseInt(item)])
      //       })
      //       userInfo.roleArr = roleArr
      //       userInfo.curRole = roleArr[0] // 默认角色
      //       if (userInfo.user_tenant.length > 0) {
      //         userInfo.tenantInfo = userInfo.user_tenant[0]
      //       } else {
      //         userInfo.tenantInfo = []
      //       }
      //       window.localStorage.setItem(
      //         'userInfo',
      //         JSON.stringify(res.data.data)
      //       )
      //       this.updateUserInfo(userInfo)
      //       // this.$refs['loginParams'].resetFields()
      //       switch (userInfo.user_role_type[0]) {
      //         case '1':
      //           this.$router.push('/sf_cloud/adminOverView')
      //           break
      //         case '2':
      //           this.$router.push('/sf_cloud/UserOverView')
      //           break
      //         case '4':
      //           this.$router.push('/sf_cloud/adminOverView')
      //       }
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: '您没有权限登录或者账户密码不正确,请联系管理员'
      //       })
      //     }
      //   }
      // })
    }
  }
};
</script>
<style lang="less">
.login {
  min-width: 1140px;
  .login_logo {
    height: 100px;
    line-height: 100px;
    margin-left: 20px;
    font-size: 40px;
    font-weight: 500;
  }
  .login_bg {
    width: 100%;
    height: 492px;
    background: url("./../../../static/image/login/login_bg.png") no-repeat
      center;
    .login_box {
      position: relative;
      .login_frame {
        width: 310px;
        height: 290px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 20px 10px;
        border-radius: 4px;
        background-color: #f9f9f9;
        position: absolute;
        right: 0px;
        top: 130px;
        padding-top: 20px;
        .item {
          padding: 10px 0;
          text-align: center;
          i.iconStyle {
            font-size: 18px;
            color: #20a0ff;
          }
          .el-button {
            width: 100%;
            /* box-sizing: border-box; */
            background: rgb(71, 183, 240);
            color: rgb(231, 238, 240);
            font-size: 18px;
            font-weight: 600;
            line-height: 21px;
          }
        }
      }
    }
  }
}
</style>
