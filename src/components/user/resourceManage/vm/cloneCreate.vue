<template>
  <div class="userCloneCreatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      克隆创建
    </div>
    <div>
      <div class="selectedDeploy">
        <div class="title">原配置</div>
        <div class="selectedItem">
          <span>主机名</span>
          <span>{{defaultInfo.instance_name}}</span>
        </div>
        <div class="selectedItem">
          <span>所属集群</span>
          <span>{{defaultInfo.host_cluster_data_list[defaultInfo.host_cluster_data_list.length-1].name}}</span>
        </div>
        <div class="selectedItem">
          <span>所属子网</span>
          <span>{{defaultInfo.securitygroup_name_list?defaultInfo.securitygroup_name_list.join('，'):''}}</span>
        </div>
        <div class="selectedItem">
          <span>所属租户</span>
          <span>{{defaultInfo.project_name}}</span>
        </div>
        <div class="selectedItem">
          <span>所属项目</span>
          <span>{{defaultInfo.tenant_name}}</span>
        </div>
        <div class="selectedItem">
          <span>应用管理员</span>
          <span>{{defaultInfo.owner}}</span>
        </div>
        <div class="selectedItem">
          <span>应用系统信息</span>
          <span>{{defaultInfo.app_info}}</span>
        </div>
      </div>
      <div class="cloneVmInfo" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
        <el-form label-position='left' label-width="120px" :model='newInfoForm' ref='cloneForm' :rules='newInfoRules'>
          <el-form-item label="主机名" required prop='vmName'>
            <el-col :span="8">
              <el-input v-model="newInfoForm.vmName" placeholder="请输入主机名"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="配置" prop='flavor_id'>
            <el-table :data="fromList.configList" style="width: 600px" height="315">
              <el-table-column width="50px">
                <template slot-scope="scope">
                  <el-radio v-model="newInfoForm.checkedConfig" :label="scope.$index" class="configClass"></el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="flavor_name" label="配置名称">
              </el-table-column>
              <el-table-column prop="flavor_cpu" label="CPU(核)">
              </el-table-column>
              <el-table-column prop="flavor_mem" label="MEM(GB)">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="ROOT密码" required prop='rootPwd'>
            <el-col :span="8">
              <el-input v-model="newInfoForm.rootPwd" placeholder="请输入密码" type='password'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码" required prop='rootPwd2'>
            <el-col :span="8">
              <el-input v-model="newInfoForm.rootPwd2" type='password' placeholder="请确认密码"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="应用管理员" prop='admin'>
            <el-select v-model="newInfoForm.admin" placeholder="请输入应用管理员">
              <el-option v-for="item in fromList.projectMemberList" :key="item.userid" :label="item.username" :value="item.userid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用系统信息" required prop='appInfo'>
            <el-col :span="8">
              <el-input v-model="newInfoForm.appInfo" placeholder="请输入应用系统信息 "></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="虚拟机数量" required prop='vmNum'>
            <el-input-number v-model="newInfoForm.vmNum" :min="1" :max="1000" label="台"></el-input-number>&nbsp;&nbsp;台
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" plain @click='submit'>确认</el-button>
            <el-button type="warning" plain @click="cancel">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { checkUserName, checkPassword } from '@/filters/index'
import { getVmDetails, getConfigInfo, cloneCreate } from '@/api/admin/vm'
import { getProjectMember } from '@/api/admin/lesseeManage'
export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入主机名'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('字母开头大小写字母+数字6-20位!'))
      } else {
        callback()
      }
    }
    var checkPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!this.checkPassword(value)) {
        callback(new Error('大小写字母+数字+特殊字符8位以上!'))
      } else {
        if (this.newInfoForm.rootPwd2 !== '') {
          this.$refs.cloneForm.validateField('rootPwd2')
        }
        callback()
      }
    }
    var checkPwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.newInfoForm.rootPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      newInfoRules: {
        vmName: [{ validator: checkUserName, trigger: 'blur' }],
        rootPwd: [{ validator: checkPwd, trigger: 'blur' }],
        rootPwd2: [{ validator: checkPwd2, trigger: 'blur' }],
        admin: [
          {
            required: true,
            message: '请输入应用管理员',
            trigger: 'change'
          }
        ],
        appInfo: [
          {
            required: true,
            message: '请输入应用系统信息',
            trigger: 'blur'
          }
        ]
      },
      fromList: {
        configList: [],
        projectMemberList: []
      },
      newInfoForm: {
        vmName: '',
        rootPwd: '',
        rootPwd2: '',
        admin: '',
        appInfo: '',
        checkedConfig: 0,
        flavor_id: '',
        vmNum: 1
      },
      defaultInfo: {}
    }
  },
  mounted() {
    this.getDefaultInfo()
    this.getConfigInfo().then(res => {
      if (res.data.code == 0) {
        this.fromList.configList = res.data.data
      }
    })
  },
  methods: {
    cloneCreate,
    getProjectMember,
    checkUserName,
    checkPassword,
    getConfigInfo,
    getVmDetails,
    getDefaultInfo() {
      this.getVmDetails({
        instance_uuid: this.$route.params.uuid,
        user_role: '1'
      }).then(res => {
        if (res.data.code == 0) {
          this.defaultInfo = res.data.data
          this.getProjectMember({
            project_uuid: this.defaultInfo.project_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.fromList.projectMemberList = res.data.data
            }
          })
        }
      })
    },
    submit() {
      this.$refs['cloneForm'].validate(valid => {
        if (valid) {
          this.loading = true
          let options = {
            src_instance_uuid: this.$route.params.uuid,
            instance_name: this.newInfoForm.vmName,
            flavor_id: this.fromList.configList[this.newInfoForm.checkedConfig]
              .flavor_id,
            admin_password: this.newInfoForm.rootPwd,
            app_info: this.newInfoForm.appInfo,
            owner: this.newInfoForm.admin,
            count: this.newInfoForm.vmNum
          }
          this.cloneCreate(options).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message.success('克隆创建成功')
            }
          })
        }
      })
    },
    cancel() {
      this.$refs['cloneForm'].resetFields()
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less">
.userCloneCreatePage {
  min-height: 500px;
  background: #fff;
  padding-bottom: 30px;
  .configClass {
    .el-radio__label {
      display: none;
    }
  }
  .cloneVmInfo {
    padding-left: 90px;
  }
  & > .title {
    padding-left: 15px;
    height: 90px;
    line-height: 90px;
    background: #fff;
    span {
      cursor: pointer;
      display: inline-block;
      padding-right: 30px;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 10px;
      margin-right: 30px;
      background: #dcdfe6;
      border-radius: 4px;
      color: #128dff;
    }
  }
  .selectedDeploy {
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
    .title {
      width: 80px;
      text-align: right;
      font-size: 16px;
      font-weight: 500;
      color: #000;
      margin-bottom: 15px;
    }
    .selectedItem {
      height: 40px;
      line-height: 40px;
      padding-left: 90px;
      span:nth-child(1) {
        display: inline-block;
        width: 120px;
        text-align: left;
        color: #606266;
        box-sizing: border-box;
        padding-right: 12px;
      }
    }
  }
}
</style>

