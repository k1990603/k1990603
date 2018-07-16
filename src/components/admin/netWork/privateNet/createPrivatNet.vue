<template>
  <div class="privatCreate">
    <div class="title">
      <span class="el-icon-arrow-left" @click='goToPrev'>返回</span>
      创建专有网络
    </div>
    <div class="craeteForm">
      <div class="parentContent">
        <div class="title">
          专有网络
        </div>
        <el-form v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" label-width="100px" class="parentForm" label-position="left" :model="parentForm" :rules="rules" ref="formRef">
          <el-form-item label="网络类型">
            <el-radio-group v-model="parentForm.netType" @change="labelChange">
              <el-radio label="0">公有基础网络</el-radio>
              <el-radio label="1">私有网络</el-radio>
              <el-radio label="2">管理员专用网络</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="parentForm.netType == 1">
            <el-form-item label="所属租户" prop='zuhu'>
              <el-select v-model="parentForm.zuhu" filterable placeholder="请选择租户" size="small" @change="zuhuSelectBtn">
                <el-option v-for="(item,index) in userMeData" :key="index" :label="item.tenant_name" :value="item.tenant_uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if="parentForm.netType == 2">
            <el-form-item label="网络用途">
              <el-select v-model="parentForm.netWorkUse" filterable placeholder="请选择用途" size="small">
                <el-option v-for="(item,index) in netWorkUseData" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="区域" prop="areaNmae">
            <el-select v-model="parentForm.areaNmae" filterable placeholder="请选择区域" @change="areaNmaeSelectBtn">
              <el-option v-for="(item,index) in topAreaData" :key="index" :label="item.name" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" size="small" prop="name">
            <el-input v-model="parentForm.name" type='text'></el-input>
          </el-form-item>
          <div v-if="parentForm.netType!=1">
            <el-form-item label="CIDR" size="small" prop="superCidr">
              <el-input v-model="parentForm.superCidr" type='text'></el-input>
            </el-form-item>
          </div>
          <div v-show="parentForm.netType==1">
            <el-form-item label="CIDR" class="cidr">
              <el-form :model='parentForm' :rules='rules' ref='netCidrForm'>
                <el-form-item style="display:inline-block;" prop="cidr1" size="mini">
                  <el-select v-model="parentForm.cidr1" filterable @change="cidrSelectBtn1" size="mini" placeholder="" prop="cidr1">
                    <el-option v-for="(item,index) in netCidrData" :key="index" :label="item.cidr_a" :value="item.cidr_a">
                    </el-option>
                  </el-select>
                </el-form-item>.
                <el-form-item style="display:inline-block;" prop="cidr2" size="mini">
                  <el-select v-model="parentForm.cidr2" filterable @change="cidrSelectBtn2" size="mini" placeholder="">
                    <el-option v-for="(item,index) in parentForm.childForm.cidr_b_list" :key="index" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>.
                <el-form-item style="display:inline-block;" prop="cidr3" size="mini">
                  <el-input v-model.number="parentForm.cidr3"></el-input>
                </el-form-item>.
                <el-form-item style="display:inline-block;" prop="cidr4" size="mini">
                  <el-input v-model.number="parentForm.cidr4"></el-input>
                </el-form-item>/
                <el-form-item style="display:inline-block;" prop="cidr5" size="mini">
                  <el-select v-model="parentForm.cidr5" @change="cidrSelectBtn3" size="mini">
                    <el-option v-for="(item,index) in parentForm.childForm.cidrMaskList" :key="index" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-form-item>
          </div>

          <div class="subTitle">
            初始化子网信息
          </div>
          <el-form-item label="子网名称" prop="subNetowrkName" size="small">
            <el-input v-model="parentForm.subNetowrkName"></el-input>
          </el-form-item>
          <div v-show="parentForm.netType==1">
            <el-form-item label="CIDR" class="cidr">
              <el-form :model='parentForm' :rules='rules' ref='subNetCidrForm'>
                <el-form-item style="display:inline-block;" size="mini">
                  <el-input v-model="parentForm.cidr1" :disabled="true"></el-input>
                </el-form-item>.
                <el-form-item style="display:inline-block;" size="mini">
                  <el-input v-model="parentForm.cidr2" :disabled="true"></el-input>
                </el-form-item>.
                <el-form-item style="display:inline-block;" prop="cidr6" size="mini">
                  <el-input v-model.number="parentForm.cidr6"></el-input>
                </el-form-item>.
                <el-form-item style="display:inline-block;" prop="cidr7" size="mini">
                  <el-input v-model.number="parentForm.cidr7"></el-input>
                </el-form-item>/
                <el-form-item style="display:inline-block;" prop="cidr9" size="mini">
                  <el-select v-model="parentForm.cidr9" filterable @change="cidrSelectBtn4" size="mini" placeholder="">
                    <el-option v-for="(item,index) in parentForm.childForm.cidrMaskList" :key="index" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-form-item>
          </div>
          <div v-if="parentForm.netType!=1">
            <el-form-item label="CIDR" size="small" prop="subCidr">
              <el-input v-model="parentForm.subCidr" type='text'></el-input>
            </el-form-item>
          </div>

          <el-form-item label="子区">
            <el-cascader :props="props" placeholder="请选择子区域" :options="soureceOptions" change-on-select v-model="parentForm.selectedOptions" @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="机房" prop="datacenter">
            <el-select v-model="parentForm.datacenter" filterable placeholder="请选择机房" @change='changeDc'>
              <el-option v-for="(item,index) in parentForm.childForm.datacenter" :key="index" :label="item.dc_name" :value="item.dc_uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集群" prop="hostpool">
            <el-select v-model="parentForm.hostpool" filterable placeholder="请选择集群">
              <el-option v-for="(item,index) in parentForm.childForm.hostpoolList" :key="index" :label="item.hc_name" :value="item.hc_uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if="parentForm.netType == 0 ||parentForm.netWorkUse == 4">
            <el-form-item label="DNS1" size="small" prop="dns1">
              <el-input v-model="parentForm.dns1" type='text'></el-input>
            </el-form-item>
            <el-form-item label="DNS2" size="small" prop="dns2">
              <el-input v-model="parentForm.dns2" type='text'></el-input>
            </el-form-item>
          </div>
          <div v-if="parentForm.netType == 0 ||parentForm.netWorkUse == 4||parentForm.netWorkUse == 3">
            <el-form-item label="网关" size="small" prop="gateWay">
              <el-input v-model="parentForm.gateWay" type='text'></el-input>
            </el-form-item>
            <el-form-item label="VLAN" size="small" prop="vlan">
              <el-input v-model.number="parentForm.vlan"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即创建</el-button>
            <!-- <el-button @click="resetForm()">重置</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getsegment_init,
  get_hostcluster_by_area,
  get_area_data_init,
  getUserList,
  addNetwork,
  getUserNetworkList,
  getAllAreaDcHcNet
} from './../../../../api/admin/netWork'
import { checkUserName, checkIp, checkCidr } from '@/filters/index'
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入名称'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('名称由字母大小写字母+数字6位以上'))
      }
      callback()
    }
    var checkIps = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入内容'))
      } else if (!this.checkIp(value)) {
        callback(new Error('IP格式不正确'))
      }
      callback()
    }
    var checkAge = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('数字值不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value > 255) {
          callback(new Error('必须小于255'))
          return (this.parentForm.cidr3 = 255)
        } else if (value < 0) {
          callback(new Error('必须大于等于0'))
          return (this.parentForm.cidr3 = 0)
        }
        callback()
      }
      callback()
    }
    var checkAge2 = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('数字值不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value > 255) {
          callback(new Error('必须小于255'))
          return (this.parentForm.cidr4 = 255)
        } else if (value < 0) {
          callback(new Error('必须大于等于0'))
          return (this.parentForm.cidr4 = 0)
        }
        callback()
      }
      callback()
    }
    var checkAge3 = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('数字值不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value > 255) {
          callback(new Error('必须小于255'))
          return (this.parentForm.cidr6 = 255)
        } else if (value < 0) {
          callback(new Error('必须大于等于0'))
          return (this.parentForm.cidr6 = 0)
        }
        callback()
      }
      callback()
    }
    var checkAge4 = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('数字值不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value > 255) {
          callback(new Error('必须小于255'))
          return (this.parentForm.cidr7 = 255)
        } else if (value < 0) {
          callback(new Error('必须大于等于0'))
          return (this.parentForm.cidr7 = 0)
        }
        callback()
      }
      callback()
    }
    // vlan范围
    //模板机网络VLAN范围：4020-4094之间
    // 公有基础网络VLAN范围：11-4020
    // 公有NAS网络VLAN范围：11-4020
    // 专有网络：11-510
    var checkVlan = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('VLAN不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        switch (this.parentForm.netType) {
          case '0':
            if (value > 4020) {
              callback(new Error('必须小于4020'))
            } else if (value < 11) {
              callback(new Error('必须大于等于11'))
            }
            callback()
            break
          // case '1':
          //   if (value > 4020) {
          //     callback(new Error('必须小于4020'))
          //   } else if (value < 11) {
          //     callback(new Error('必须大于等于11'))
          //   }
          //   callback()
          //   break
          case '2':
            if (this.parentForm.netWorkUse == 3) {
              if (value > 4020) {
                callback(new Error('必须小于4020'))
              } else if (value < 11) {
                callback(new Error('必须大于等于11'))
              }
            }
            if (this.parentForm.netWorkUse == 4) {
              if (value > 4094) {
                callback(new Error('必须小于4094'))
              } else if (value <= 4020) {
                callback(new Error('必须大于4020'))
              }
            }
            callback()
            break
          default:
            callback()
        }
      }
      callback()
    }
    var checkNetWorkUse = (rule, value, callback) => {
      if (this.parentForm.netTypeLable == 2) {
        if (this.parentForm.netWorkUse == '') {
          callback(new Error('请选择网络用途'))
        }
        callback()
      }
      callback()
    }
    var checkCidrs = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入网段CIdr'))
      } else if (!this.checkCidr(value).type) {
        callback(new Error(this.checkCidr(value).message))
      }
      callback()
    }
    return {
      loading: false,
      pageShow: false,
      topAreaData: [],
      netCidrData: [],
      areaNmae: '',
      netWorkUseData: [
        {
          label: '公有NAS网络',
          value: 3
        },
        {
          label: '镜像模板机网络',
          value: 4
        }
      ],
      labelChangeData: 1, //单选切换
      userMeData: [], //租户信息
      areaNmaeNum: 0,
      hostpool: [],
      // selectedOptions: [],
      soureceOptions: [],
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      },
      parentForm: {
        subCidr: '',
        superCidr: '', //不是专有网络时则任管理员输入CIDR
        dns1: '',
        dns2: '',
        gateWay: '',
        vlan: '',
        areaName: '',
        netWorkUse: '',
        cidr1: '',
        cidr2: '',
        cidr3: '',
        cidr4: '',
        cidr5: '',
        cidr6: '',
        cidr7: '',
        cidr8: '',
        cidr9: '',
        name: '',
        cidr: '',
        netType: '1',
        lessee: '',
        netTypeLable: '1',
        areaNmae: '',
        // childFormName: '',
        labelChangeData: 1,
        zuhu: '',
        hostpool: '',
        subNetowrkName: '',
        selectedOptions: [], //级联选中
        datacenter: '',
        childForm: {
          hostpoolList: [],
          datacenter: [],
          cidrMaskList: [],
          cidr_b_list: [],
          hostpool: '',
          name: '',
          subNetowrkName: ''
        }
      },
      rules: {
        netWorkUse: [
          {
            validator: checkNetWorkUse,
            trigger: 'change'
          }
        ],
        vlan: [
          {
            validator: checkVlan,
            trigger: 'blur'
          }
        ],
        dns1: [
          {
            validator: checkIps,
            trigger: 'blur'
          }
        ],
        dns2: [
          {
            validator: checkIps,
            trigger: 'blur'
          }
        ],
        gateWay: [
          {
            validator: checkIps,
            trigger: 'blur'
          }
        ],
        name: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        subNetowrkName: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        zuhu: [
          {
            required: true,
            message: '请选择租户',
            trigger: 'change'
          }
        ],
        areaNmae: [
          {
            required: true,
            message: '请选择区域',
            trigger: 'change'
          }
        ],
        netType: [
          {
            required: true,
            message: '请选择网络类型',
            trigger: 'change'
          }
        ],
        selectedOptions: [
          {
            required: true,
            message: '请选择子区域',
            trigger: 'change'
          }
        ],
        datacenter: [
          {
            required: true,
            message: '请选择机房',
            trigger: 'change'
          }
        ],
        hostpool: [
          {
            required: true,
            message: '请选择集群',
            trigger: 'change'
          }
        ],
        superCidr: [
          {
            validator: checkCidrs,
            trigger: 'blur'
          }
        ],
        subCidr: [
          {
            validator: checkCidrs,
            trigger: 'blur'
          }
        ],
        cidr1: [
          {
            required: true,
            message: '请选择CIDR',
            trigger: 'change'
          }
        ],
        cidr5: [
          {
            required: true,
            message: '请选择CIDR',
            trigger: 'change'
          }
        ],
        cidr9: [
          {
            required: true,
            message: '请选择CIDR',
            trigger: 'change'
          }
        ],
        cidr3: [
          {
            validator: checkAge,
            trigger: 'blur'
          }
        ],
        cidr4: [
          {
            validator: checkAge2,
            trigger: 'blur'
          }
        ],
        cidr6: [
          {
            validator: checkAge3,
            trigger: 'blur'
          }
        ],
        cidr7: [
          {
            validator: checkAge4,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    this.getSegmentInitList()
  },
  methods: {
    checkCidr,
    checkUserName,
    checkIp,
    getsegment_init,
    get_area_data_init,
    get_hostcluster_by_area,
    getUserList,
    addNetwork,
    getUserNetworkList,
    getAllAreaDcHcNet,
    getAreaList() {
      this.getAllAreaDcHcNet().then(res => {
        if (res.data.code == 0) {
          this.topAreaData = res.data.data
        }
      })
    },
    getSegmentInitList() {
      this.getsegment_init().then(res => {
        if (res.data.code == 0) {
          this.netCidrData = res.data.data.net_cidr_data
        }
      })
      this.getUserList().then(res => {
        //获取租户信息
        if (res.data.code == 0) {
          this.userMeData = res.data.data
        }
      })
    },
    getSubNetworkLIst(search) {
      this.getUserNetworkList(search).then(res => {
        if (res.data.code == 0) {
          this.topAreaData = res.data.data.host_cluster_data_list
        }
      })
    },
    areaNmaeSelectBtn(item) {
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.selectedOptions = []
      this.soureceOptions = []
      this.parentForm.areaName = this.topAreaData[item].uuid
      if (
        this.topAreaData[item].datacenter &&
        this.topAreaData[item].datacenter != ''
      ) {
        this.soureceOptions = [
          {
            name: '直属区域',
            uuid: this.topAreaData[item].uuid
          }
        ]
      }
      if (this.topAreaData[item].child_area) {
        this.soureceOptions = this.soureceOptions.concat(
          this.topAreaData[item].child_area
        )
      }
    },
    cidrSelectBtn1() {
      this.parentForm.cidr2 = ''
      this.parentForm.cidr5 = ''
      this.parentForm.childForm.cidrMaskList = []
      this.parentForm.childForm.cidr_b_list = []
      this.netCidrData.forEach(item => {
        if (item.cidr_a == this.parentForm.cidr1) {
          this.parentForm.childForm.cidrMaskList = item.netmask
          this.parentForm.childForm.cidr_b_list = item.cidr_b
        }
      })
    },
    cidrSelectBtn2() {},
    cidrSelectBtn3() {},
    cidrSelectBtn4() {},
    zuhuSelectBtn(val) {
      this.parentForm.areaNmae = ''
      this.soureceOptions = []
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.childForm.datacenter = []
      this.parentForm.childForm.hostpoolList = []

      this.getSubNetworkLIst({
        tenant_uuid: val
      })
    },
    labelChange(val) {
      this.parentForm.netType = val
      this.parentForm.labelChangeData = val
      this.parentForm.netWorkUse = ''
      this.parentForm.zuhu = ''
      this.parentForm.areaNmae = ''
      this.soureceOptions = []
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.childForm.datacenter = []
      this.parentForm.childForm.hostpoolList = []
      this.parentForm.subCidr = ''
      this.parentForm.superCidr = ''
      this.parentForm.dns1 = ''
      this.parentForm.dns2 = ''
      this.parentForm.gateWay = ''
      this.parentForm.vlan = ''
      this.parentForm.name = ''
      this.parentForm.subNetowrkName = ''
      if (this.parentForm.netType != 1) {
        this.getAreaList()
      }
    },
    submitForm() {
      let deg1 = true
      let deg2 = true
      let deg3 = true
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          deg1 = true
        } else {
          deg1 = false
        }
      })
      if (this.parentForm.netType == 1) {
        this.$refs['netCidrForm'].validate(valid => {
          if (valid) {
            deg2 = true
          } else {
            deg2 = false
          }
        })
        this.$refs['subNetCidrForm'].validate(valid => {
          if (valid) {
            deg3 = true
          } else {
            deg3 = false
          }
        })
      }
      if (deg1 && deg2 && deg3) {
        let cidr = ''
        let sub_network_cidr = ''
        if (this.parentForm.netType == 1) {
          cidr = `${this.parentForm.cidr1}.${this.parentForm.cidr2}.${
            this.parentForm.cidr3
          }.${this.parentForm.cidr4}/${this.parentForm.cidr5}`
          sub_network_cidr = `${this.parentForm.cidr1}.${
            this.parentForm.cidr2
          }.${this.parentForm.cidr6}.${this.parentForm.cidr7}/${
            this.parentForm.cidr9
          }`
        } else {
          cidr = this.parentForm.superCidr
          sub_network_cidr = this.parentForm.subCidr
        }

        let options = {
          area_uuid: this.parentForm.areaName,
          name: this.parentForm.name,
          cidr: cidr,
          type:
            this.parentForm.netType == 2
              ? this.parentForm.netWorkUse
              : this.parentForm.netType,
          // nic_name: this.parentForm.childFormName,
          // tenant_uuid: this.parentForm.zuhu,
          sub_network_name: this.parentForm.subNetowrkName,
          sub_network_cidr: sub_network_cidr,
          hostcluster_uuid: this.parentForm.hostpool
        }
        if (this.parentForm.netType == 1) {
          options.tenant_uuid = this.parentForm.zuhu
        }
        if (this.parentForm.netType == 0 || this.parentForm.netWorkUse == 4) {
          options.dns1 = this.parentForm.dns1
          options.dns2 = this.parentForm.dns2
        }
        if (
          this.parentForm.netType == 0 ||
          this.parentForm.netWorkUse == 4 ||
          this.parentForm.netWorkUse == 3
        ) {
          options.gateway = this.parentForm.gateWay
          options.vlan = this.parentForm.vlan
        }
        this.loading = true
        this.addNetwork(options).then(res => {
          this.loading = false
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.resetForm()
          }
        })
      }
    },
    resetForm() {
      this.$refs['formRef'].resetFields()
      if (this.parentForm.netType == 1) {
        this.$refs['netCidrForm'].resetFields()
        this.$refs['subNetCidrForm'].resetFields()
      }
    },
    getDcHc(list, uuid) {
      list.forEach(item => {
        if (item.uuid == uuid && item.datacenter) {
          this.parentForm.childForm.datacenter = item.datacenter
          return true
        } else {
          if (item.child_area.length > 0) {
            this.getDcHc(item.child_area, uuid)
          }
        }
      })
    },
    handleChange(value, search) {
      // 级联选中
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.childForm.datacenter = []
      this.parentForm.childForm.hostpoolList = []
      let areaUuid = this.parentForm.selectedOptions[
        this.parentForm.selectedOptions.length - 1
      ]
      if (this.parentForm.netType == 1) {
        this.getDcHc(this.topAreaData, areaUuid)
      } else {
        // 清空
        this.get_hostcluster_by_area({
          area_uuid: areaUuid,
          page_size: 10000,
          page_no: 1,
          search: JSON.stringify(search) || ''
          // search: {tenant_name:JSON.stringify(search)} || ''
        }).then(res => {
          if (res.data.code == 0) {
            this.parentForm.childForm.datacenter = res.data.data.datacenter
          }
        })
      }
    },
    changeDc() {
      this.parentForm.childForm.datacenter.forEach(item => {
        if (item.dc_uuid == this.parentForm.datacenter && item.hostcluster) {
          this.parentForm.childForm.hostpoolList = item.hostcluster
        }
      })
    },
    goToPrev() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang=less>
.privatCreate {
  background: #f6f6f6;
  & > .title {
    padding-left: 15px;
    height: 60px;
    line-height: 60px;
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
  .craeteForm {
    padding-top: 20px;
    padding-left: 15px;
    padding-right: 15px;
    .title {
      padding-left: 15px;
      height: 36px;
      line-height: 36px;
      font-size: 18px;
      font-weight: 500;
    }
    .parentForm {
      margin-left: 30px;
      .el-form-item {
        margin-bottom: 16px;
      }
      .cidr {
        > .el-form-item__label::before {
          content: '*';
          color: #f56c6c;
          margin-right: 4px;
        }
        .el-form-item__content {
          .el-input {
            width: 70px;
          }
          > div {
            display: inline-block;
          }
        }
      }
      .subTitle {
        height: 36px;
        line-height: 36px;
        font-size: 18px;
        font-weight: 500;
      }
    }
    .el-input {
      width: 200px;
    }
    .subContent {
      padding-top: 15px;
      border-top: 1px solid #f9f9f9;
    }
  }
}
</style>
