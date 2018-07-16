<template>
  <div class="vmCreatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      创建VM
    </div>
    <div class="stepBox">
      <el-steps :active="active">
        <el-step title="选择地区与机型" icon="el-icon-edit"></el-step>
        <el-step title="选择镜像" icon="el-icon-upload"></el-step>
        <el-step title="选择存储与网络" icon="el-icon-picture"></el-step>
        <el-step title="设置信息" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>
    <div class="selectedDeploy" v-show='active!=1'>
      <div v-show='active>1'>
        <div class="title">已选配置</div>
        <div class="selectedItem">
          <span>所属租户</span>
          <span>{{displayData.tenant_name}}</span>
        </div>
        <div class="selectedItem">
          <span>所属项目</span>
          <span>{{displayData.project_name}}</span>
        </div>
        <div class="selectedItem">
          <span>所属区域</span>
          <span>{{displayData.area_name}}</span>
        </div>
        <div class="selectedItem">
          <span>所属机房</span>
          <span>{{displayData.dc_name}}</span>
        </div>
        <div class="selectedItem">
          <span>所属集群</span>
          <span>{{displayData.hc_name}}</span>
        </div>
        <div class="selectedItem">
          <span>配置</span>
          <span>{{displayData.config}}</span>
        </div>
      </div>
      <div v-show='active>2'>
        <div class="selectedItem">
          <span>镜像提供方</span>
          <span>{{displayData.imageProvider}}</span>
        </div>

        <div class="selectedItem">
          <span>操作系统</span>
          <span>{{displayData.sys}}</span>
        </div>
        <div class="selectedItem">
          <span>镜像名称</span>
          <span>{{displayData.image_name}}</span>
        </div>
        <div class="selectedItem">
          <span>系统盘大小</span>
          <span>{{displayData.disk}}</span>
        </div>
      </div>
      <div v-show='active>3'>
        <div class="selectedItem">
          <span>数据盘大小</span>
          <span>{{displayData.dataDisk}} G</span>
        </div>
        <div class="selectedItem">
          <span>网络类型</span>
          <span>{{formateNetType(formData.netType)}}</span>
        </div>
        <div class="selectedItem" v-if='formData.netType==2'>
          <span>网络用途</span>
          <span>{{formateNetType(displayData.networkUse)}}</span>
        </div>
        <div class="selectedItem">
          <span>专有网络</span>
          <span>{{displayData.privateNet_name}}</span>
        </div>
        <div class="selectedItem">
          <span>子网</span>
          <span>{{displayData.subNet_name}}</span>
        </div>
        <div class="selectedItem" v-if='formData.isPublic'>
          <span>带宽</span>
          <span>{{displayData.netWidth}}Mbps</span>
        </div>
        <div class="selectedItem">
          <span>虚拟机数量</span>
          <span>{{displayData.vm_nums}}台</span>
        </div>
      </div>
    </div>
    <el-form label-width="120px" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待..." :model="formData" :rules='createRules' ref='createForm'>
      <div class="selectBox" v-if='active == 1'>
        <el-form-item label="所属项目" prop="project_uuid">
          <el-select v-model="formData.project_uuid" @change='handltChangeProject' placeholder="请选择">
            <el-option v-for="item in allListInfo.projectList" :key="item.project_uuid" :label="item.project_name" :value="item.project_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="area_uuid">
          <el-cascader :props='props' placeholder="请选择区域" v-model="formData.area_uuid" @change="handleChangeArea" :options="allListInfo.areaList" filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="机房" prop="dc_uuid">
          <el-select v-model="formData.dc_uuid" @change='handleChangeDc' placeholder="请选择">
            <el-option v-for="item in allListInfo.dcList" :key="item.dc_uuid" :label="item.dc_name" :value="item.dc_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集群" prop="hc_uuid">
          <el-select v-model="formData.hc_uuid" placeholder="请选择" @change='handleChangeHostpool'>
            <el-option v-for="item in allListInfo.hcList" :key="item.hc_uuid" :label="item.hc_name" :value="item.hc_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置" prop='flavor_id'>
          <el-table :data="allListInfo.configList" style="width: 500px" height="400">
            <el-table-column width="50px">
              <template slot-scope="scope">
                <el-radio v-model="formData.checkedConfig" :label="scope.$index" class="configClass"></el-radio>
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
        <el-form-item size="large">
          <el-button type="primary" plain v-show='active>1' @click="prev">上一步</el-button>
          <el-button type="success" plain @click="toImageSel">下一步 选择镜像</el-button>
        </el-form-item>
      </div>
      <div class="selectBox" v-if='active == 2'>
        <el-form-item label="镜像提供方">
          <el-radio-group @change='handleChangeSys' v-model="formData.imageProvider">
            <el-radio-button label="公共镜像"></el-radio-button>
            <el-radio-button label="项目专属镜像"></el-radio-button>
            <el-radio-button label="租户专属镜像"></el-radio-button>
          </el-radio-group>
          <el-tooltip placement="top">
            <div slot="content" placement="right">提示：<br/>自定义镜像请联系管理员添加专属镜像</div>
            <i class='el-icon-question'></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="操作系统">
          <el-radio-group v-model="formData.sys" @change='handleChangeSys'>
            <el-radio-button label="Windows"></el-radio-button>
            <el-radio-button label="Linux"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="镜像名称" prop='image_uuid' required>
          <el-select v-model="formData.image_uuid" @change="handleChangeImage" placeholder="请选择">
            <el-option v-for="item in allListInfo.imageNameList" :key="item.id" :label="item.image_name" :value="item.image_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统盘大小">
          <el-button type="success" plain disabled>{{formData.disk}}G</el-button>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" plain v-show='active>1' @click="prev">上一步</el-button>
          <el-button type="success" plain @click="toSetNet">下一步 选择存储与网络</el-button>
        </el-form-item>
      </div>
      <div class="selectBox" v-if='active == 3'>
        <!-- <el-form-item label="数据盘">
          <el-input-number v-model="formData.dataDisk" :min="50" :max="1000" label="G"></el-input-number>&nbsp;&nbsp;G
        </el-form-item> -->
        <el-form-item label="网络类型">
          <el-radio-group v-model="formData.netType" @change='handleChangeNetType'>
            <el-radio-button label="0">公有基础网络</el-radio-button>
            <el-radio-button label="1">私用网络</el-radio-button>
            <!-- <el-radio-button label="2">管理员专用网络</el-radio-button> -->
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="网络用途" prop='networkUse' required v-if='formData.netType=="2"'>
          <el-select v-model="formData.networkUse" @change='handleChangeNetUse' placeholder="请选择网络用途">
            <el-option label="公有NAS网络" value="3">
            </el-option>
            <el-option label="镜像模板机网络" value="4">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="专有网络" required prop='privateNet_uuid'>
          <el-select v-model="formData.privateNet_uuid" @change='handleChangePrivate' placeholder="请选择网络">
            <el-option v-for="item in allListInfo.privateNetLsit" :key="item.ns_uuid" :label="item.ns_name_cidr" :value="item.ns_uuid">
            </el-option>
          </el-select>
          <el-checkbox v-model="formData.isPublic" @change='handleChangeStatu'>分配公网IP</el-checkbox>
        </el-form-item>
        <el-form-item label="子网" required prop='subNet_uuid'>
          <el-select v-model="formData.subNet_uuid" placeholder="请选择子网" @change='handleChangeSubNet'>
            <el-option v-for="item in allListInfo.subNetList" :key="item.sub_uuid" :label="item.sub_name_cidr" :value="item.sub_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="带宽" prop="netWidth" required v-if="formData.isPublic">
          <el-input-number v-model="formData.netWidth" :min="0" :max="1000" label="Mbps"></el-input-number>&nbsp;&nbsp;Mbps
        </el-form-item>
        <el-form-item label="虚拟机数量">
          <el-input-number v-model="formData.vm_nums" :min="1" :max="1000" label="台"></el-input-number>&nbsp;&nbsp;台
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" plain v-show='active>1' @click="prev">上一步</el-button>
          <el-button type="success" plain @click="setDefaultInfo">下一步 选择设置信息</el-button>
        </el-form-item>
      </div>
      <div class="selectBox" v-if='active == 4'>
        <el-form-item label="主机名" prop='vmName'>
          <el-col :span="8">
            <el-input placeholder="请输入主机名" type='text' v-model='formData.vmName'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="登录方式">
          <el-radio-group>
            <el-radio-button label="密码登录"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户">
          <el-radio-group>
            <el-radio-button v-if="formData.sys=='Linux'" label="root"></el-radio-button>
            <el-radio-button v-if="formData.sys=='Windows'" label="administrator"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-col :span="8">
            <el-input placeholder="请输入密码" type='password' v-model='formData.password'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码" prop='passwordAgain'>
          <el-col :span="8">
            <el-input placeholder="请确认密码" type='password' v-model='formData.passwordAgain'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="安全组" prop='security'>
          <el-radio-group v-model="formData.securityType" @change='handleChangeSecurityType'>
            <el-radio-button label="1">已有安全组</el-radio-button>
            <el-radio-button label="2">公用安全组</el-radio-button>
            <el-radio-button label="0">新建安全组</el-radio-button>
          </el-radio-group>
          <div style="margin-top:15px;">
            <el-select v-model="formData.security_uuid" placeholder="请选择安全组">
              <el-option v-for="item in allListInfo.securityList" :key="item.sec_group_uuid" :label="item.sec_group_name" :value="item.sec_group_uuid">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="应用管理员" prop='admin'>
          <el-select v-model="formData.admin" placeholder="请输入应用管理员">
            <el-option v-for="item in allListInfo.projectMemberList" :key="item.userid" :label="item.username" :value="item.userid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用系统信息" prop='appInfo'>
          <el-col :span="8">
            <el-input placeholder="请输入应用系统信息" type='text' v-model='formData.appInfo'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" plain v-show='active>1' @click="prev">上一步</el-button>
          <el-button type="warning" plain @click="submit">确认创建</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { checkUserName, checkPassword } from '@/filters/index'
import {
  getProjectMember,
  getProjectDetails,
  getAppointProject
} from '@/api/admin/lesseeManage'
import {
  getPubSecurityInfo,
  getSecurityInfo,
  createVm,
  getSegementInfo,
  getUseImage,
  getUseArea,
  getConfigInfo // 获取cpu mem组合信息
} from '@/api/admin/vm'
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
        if (this.formData.passwordAgain !== '') {
          this.$refs.createForm.validateField('passwordAgain')
        }
        callback()
      }
    }
    var checkPwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      active: 1,
      displayData: {
        tenant_name: '',
        project_name: '',
        area_name: '',
        dc_name: '',
        hc_name: '',
        config: '',
        sys: '',
        imageProvider: '',
        image_name: '',
        disk: '',
        dataDisk: 50,
        netType: '',
        networkUse: '',
        privateNet_name: '',
        subNet_name: '',
        netWidth: 0,
        vm_nums: 1
      },
      allListInfo: {
        projectList: [],
        areaList: [],
        dcList: [],
        hcList: [],
        configList: [],
        imageNameList: [],
        privateNetLsit: [],
        subNetList: [],
        securityList: [],
        projectMemberList: []
      },
      formData: {
        tenant_uuid: '',
        project_uuid: '',
        area_uuid: [],
        dc_uuid: '',
        hc_uuid: '',
        checkedConfig: 0,
        flavor_id: '',
        sys: 'Windows',
        imageProvider: '公共镜像',
        image_uuid: '',
        disk: 0,
        dataDisk: 50,
        netType: '1',
        networkUse: '',
        privateNet_uuid: '',
        subNet_uuid: '',
        isPublic: false,
        netWidth: 0,
        vm_nums: 1,
        vmName: '',
        password: '',
        passwordAgain: '',
        securityType: '1',
        security_uuid: '',
        admin: '',
        appInfo: ''
      },
      createRules: {
        tenant_uuid: [
          {
            required: true,
            message: '请选择租户',
            trigger: 'change'
          }
        ],
        project_uuid: [
          {
            required: true,
            message: '请选择项目',
            trigger: 'change'
          }
        ],
        area_uuid: [
          {
            required: true,
            message: '请选择区域',
            trigger: 'change'
          }
        ],
        dc_uuid: [
          {
            required: true,
            message: '请选择机房',
            trigger: 'change'
          }
        ],
        hc_uuid: [
          {
            required: true,
            message: '请选择集群',
            trigger: 'change'
          }
        ],
        image_uuid: [
          {
            required: true,
            message: '请选择镜像',
            trigger: 'change'
          }
        ],
        networkUse: [
          {
            required: true,
            message: '请选择网络用途类型',
            trigger: 'change'
          }
        ],
        privateNet_uuid: [
          {
            required: true,
            message: '请选择专有网络',
            trigger: 'change'
          }
        ],
        subNet_uuid: [
          {
            required: true,
            message: '请选择子网',
            trigger: 'change'
          }
        ],
        vmName: [{ validator: checkUserName, trigger: 'blur' }],
        password: [{ validator: checkPwd, trigger: 'blur' }],
        passwordAgain: [{ validator: checkPwd2, trigger: 'blur' }],
        security_uuid: [
          {
            required: true,
            message: '请选择安全组',
            trigger: 'change'
          }
        ],
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
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  mounted() {
    this.formData.tenant_uuid = this.userInfo.tenantInfo.tenant_uuid
    this.displayData.tenant_name = this.userInfo.tenantInfo.tenant_name
    this.getAppointProject({
      tenant_uuid: this.userInfo.tenantInfo.tenant_uuid
    }).then(res => {
      if (res.data.code == 0) {
        this.allListInfo.projectList = res.data.data
      }
    })
    this.getConfigInfo().then(res => {
      if (res.data.code == 0) {
        this.allListInfo.configList = res.data.data
      }
    })
  },
  methods: {
    getAppointProject,
    getProjectDetails,
    getPubSecurityInfo,
    getSecurityInfo,
    getProjectMember,
    createVm,
    checkUserName,
    checkPassword,
    getSegementInfo,
    getUseImage,
    getUseArea,
    getConfigInfo,
    submit() {
      let options = {
        hostcluster_uuid: this.formData.hc_uuid,
        flavor_id: this.formData.flavor_id,
        image_uuid: this.formData.image_uuid,
        system_disk: this.formData.disk,
        // data_disk: this.formData.dataDisk,
        data_disk: '',
        subnetwork_uuid: this.formData.subNet_uuid,
        count: this.formData.vm_nums,
        tenant_uuid: this.formData.tenant_uuid,
        project_uuid: this.formData.project_uuid,
        instance_name: this.formData.vmName,
        root_password: this.formData.password,
        securitygroup_uuid: this.formData.security_uuid,
        app_info: this.formData.appInfo,
        owner: this.formData.admin,
        internet_ip_need: this.formData.isPublic ? 1 : 0,
        bandwidth_size: this.formData.netWidth
      }

      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.createVm(options).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.$router.go(-1)
            }
          })
        }
      })
    },
    setDefaultInfo() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          if (this.formData.securityType == 1) {
            this.getSecurityInfo({
              project_uuid: this.formData.project_uuid
            }).then(res => {
              if (res.data.code == 0) {
                this.allListInfo.securityList = res.data.data
              }
            })
          }
          this.getProjectMember({
            project_uuid: this.formData.project_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.allListInfo.projectMemberList = res.data.data
            }
          })
          this.active = 4
        }
      })
    },
    handleChangeSecurityType() {
      this.formData.security_uuid = ''
      this.allListInfo.securityList = []
      switch (this.formData.securityType) {
        case '0':
          this.$router.push('/sf_cloud/workbench/userSafeGroup')
          break
        case '1':
          this.getSecurityInfo({
            project_uuid: this.formData.project_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.allListInfo.securityList = res.data.data
            }
          })
          break
        case '2':
          this.getPubSecurityInfo().then(res => {
            if (res.data.code == 0) {
              this.allListInfo.securityList = res.data.data
            }
          })
          break
      }
    },
    toSetNet() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.getSegementInfo({
            hostcluster_uuid: this.formData.hc_uuid,
            network_segment_type: this.formData.netType,
            tenant_uuid: this.formData.tenant_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.allListInfo.privateNetLsit = res.data.data
              this.active = 3
            }
          })
        }
      })
    },
    handleChangeStatu() {
      if (!this.formData.isPublic) {
        this.formData.isPublic = 0
      }
    },
    formateNetType(val) {
      let str = ''
      switch (val) {
        case '0':
          return (str = '公有基础网络')
          break
        case '1':
          return (str = '私用网络')
          break
        case '2':
          return (str = '管理员专用网络')
          break
        case '3':
          return (str = '公有NAS网络')
          break
        case '4':
          return (str = '镜像模板机网络')
          break
      }
    },
    handleChangeNetType() {
      this.formData.networkUse = ''
      this.allListInfo.privateNetLsit = []
      this.formData.privateNet_uuid = ''
      this.allListInfo.subNetList = []
      this.formData.subNet_uuid = ''
      if (this.formData.netType != 2) {
        let options = {
          hostcluster_uuid: this.formData.hc_uuid,
          network_segment_type: this.formData.netType
        }
        if (this.formData.netType == 1) {
          options.tenant_uuid = this.formData.tenant_uuid
        }
        this.getSegementInfo(options).then(res => {
          if (res.data.code == 0) {
            this.allListInfo.privateNetLsit = res.data.data
          }
        })
      }
    },
    handleChangeNetUse() {
      this.allListInfo.privateNetLsit = []
      this.formData.privateNet_uuid = ''
      this.allListInfo.subNetList = []
      this.formData.subNet_uuid = ''
      this.getSegementInfo({
        hostcluster_uuid: this.formData.hc_uuid,
        network_segment_type: this.formData.networkUse
      }).then(res => {
        if (res.data.code == 0) {
          this.allListInfo.privateNetLsit = res.data.data
        }
      })
    },
    handleChangePrivate() {
      this.allListInfo.subNetList = []
      this.formData.subNet_uuid = ''
      this.allListInfo.privateNetLsit.forEach(item => {
        if (item.ns_uuid == this.formData.privateNet_uuid) {
          this.allListInfo.subNetList = item.sub_ns_list
          this.displayData.privateNet_name = item.ns_name_cidr
        }
      })
    },
    handleChangeSubNet() {
      this.allListInfo.subNetList.forEach(item => {
        if (item.sub_uuid == this.formData.subNet_uuid) {
          this.displayData.subNet_name = item.sub_name_cidr
        }
      })
    },
    toImageSel() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.displayData.config = `${
            this.allListInfo.configList[this.formData.checkedConfig].flavor_cpu
          }核 ${
            this.allListInfo.configList[this.formData.checkedConfig].flavor_mem
          }GB`
          this.formData.flavor_id = this.allListInfo.configList[
            this.formData.checkedConfig
          ].flavor_id
          this.getUseImage({
            os_type_num: this.formData.sys == 'Windows' ? '0' : '1'
            // search: JSON.stringify({
            //   project_uuid: this.formData.project_uuid
            // })
          }).then(res => {
            if (res.data.code == 0) {
              this.allListInfo.imageNameList = res.data.data
              this.active = 2
            }
          })
        }
      })
    },
    handleChangeSys() {
      this.formData.image_uuid = ''
      this.formData.disk = 0
      let search = {}
      switch (this.formData.imageProvider) {
        case '项目专属镜像':
          search.project_uuid = this.formData.project_uuid
          break
        case '租户专属镜像':
          search.tenant_uuid = this.formData.tenant_uuid
          break
      }
      this.getUseImage({
        os_type_num: this.formData.sys == 'Windows' ? '0' : '1',
        search: JSON.stringify(search)
      }).then(res => {
        if (res.data.code == 0) {
          this.allListInfo.imageNameList = res.data.data
        }
      })
    },
    handleChangeImage() {
      this.allListInfo.imageNameList.forEach(item => {
        if (item.image_uuid == this.formData.image_uuid) {
          this.displayData.image_name = item.image_name
          this.displayData.sys = this.formData.sys
          this.displayData.imageProvider = this.formData.imageProvider
          this.displayData.disk = item.size_gb + 'GB'
          this.formData.disk = item.size_gb
        }
      })
    },
    clearForm(list, uuid) {
      list.forEach(item => {
        this.allListInfo[item] = []
      })
      uuid.forEach(item => {
        if (item == 'area_uuid') {
          this.formData[item] = []
        } else {
          this.formData[item] = ''
        }
      })
    },
    handltChangeProject() {
      this.clearForm(
        ['areaList', 'dcList', 'hcList'],
        ['area_uuid', 'dc_uuid', 'hc_uuid']
      )
      this.getProjectDetails({ uuid: this.formData.project_uuid }).then(res => {
        if (res.data.code == 0) {
          this.allListInfo.areaList = res.data.data.host_cluster_data_list
        }
      })
      // 获取项目名称展示
      this.allListInfo.projectList.forEach(item => {
        if (item.project_uuid == this.formData.project_uuid) {
          this.displayData.project_name = item.project_name
        }
      })
    },
    get_dc_hc(list, uuid) {
      list.forEach(item => {
        if (item.uuid == uuid && item.datacenter) {
          this.allListInfo.dcList = item.datacenter
          this.displayData.area_name = item.name
          return true
        } else {
          this.get_dc_hc(item.child_area, uuid)
        }
      })
    },
    handleChangeArea(val) {
      this.clearForm(['dcList', 'hcList'], ['dc_uuid', 'hc_uuid'])
      let area_uuid = val[val.length - 1]
      this.get_dc_hc(this.allListInfo.areaList, area_uuid)
    },
    handleChangeDc() {
      this.clearForm(['hcList'], ['hc_uuid'])
      this.allListInfo.dcList.forEach(item => {
        if (item.dc_uuid == this.formData.dc_uuid && item.hostcluster) {
          this.allListInfo.hcList = item.hostcluster
          this.displayData.dc_name = item.dc_name
        }
      })
    },
    handleChangeHostpool() {
      this.allListInfo.hcList.forEach(item => {
        if (item.hc_uuid == this.formData.hc_uuid) {
          this.displayData.hc_name = item.hc_name
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    prev() {
      if (this.active-- < 1) this.active = 1
    }
  }
}
</script>
<style lang="less">
.vmCreatePage {
  min-height: 500px;
  background: #fff;
  padding-bottom: 30px;
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
  .stepBox {
    padding: 0 50px;
  }
  .selectBox {
    // max-width: 300px;
    padding-top: 30px;
    padding-left: 20px;
    .configClass {
      .el-radio__label {
        display: none;
      }
    }
  }
  .selectedDeploy {
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
    .title {
      width: 120px;
      text-align: right;
      font-size: 16px;
      font-weight: 500;
      color: #000;
      margin-bottom: 15px;
    }
    .selectedItem {
      height: 40px;
      line-height: 40px;
      span:nth-child(1) {
        display: inline-block;
        width: 120px;
        text-align: right;
        color: #606266;
        box-sizing: border-box;
        padding-right: 12px;
      }
    }
  }
}
</style>

