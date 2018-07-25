<template>
  <div class="subNetCreate">
    <div class="title">
      <span class="el-icon-arrow-left" @click='goToPrev'>返回</span>
      创建子网
    </div>
    <div class="craeteForm">
      <div class="parentContent">
        <div class="title">
          初始化子网信息
        </div>
        <el-form v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" label-width="100px" class="parentForm" label-position="left" :model="parentForm" :rules="rules" ref="parentForm">
          <el-form-item label="网络类型" prop="netTypeLable">
            <el-radio-group v-model="parentForm.netTypeLable" @change="labelChange">
              <el-radio label="0">公有网络</el-radio>
              <el-radio label="1">私有网络</el-radio>
              <el-radio label="2">管理员专用网络</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="parentForm.netTypeLable == 1">
            <el-form-item label="所属租户" prop='zuhu'>
              <el-select clearable v-model="parentForm.zuhu" placeholder="请选择租户" size="small" @change="zuhuSelectBtn" filterable>
                <el-option v-for="(item,index) in userMeData" :key="index" :label="item.tenant_name" :value="item.tenant_uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if="parentForm.netTypeLable == 2">
            <el-form-item label="网络用途" prop='netWorkUse'>
              <el-select clearable v-model="parentForm.netWorkUse" placeholder="请选择用途" size="small" @change="useSelectBtn" filterable>
                <el-option v-for="(item,index) in netWorkUseData" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="专有网络" prop="network_segment_uuid">
            <el-select v-model="parentForm.network_segment_uuid" placeholder="请选择专有网络" @change="proNetworkSelectBtn">
              <el-option v-for="(item,index) in tableData" :key="index" :label="item.name" :value="item.uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属大区" size="small">
            <el-input v-model="parentForm.topAreaName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="子网名称" prop="subNetowrkName" size="small">
            <el-input v-model="parentForm.subNetowrkName" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="CIDR" class="cidr">
            <el-form-item size="mini">
              <el-input v-model="parentForm.cidr8" :disabled="true"></el-input>
            </el-form-item>.
            <el-form-item size="mini">
              <el-input v-model="parentForm.cidr2" :disabled="true"></el-input>
            </el-form-item>.
            <el-form-item prop="cidr6" size="mini">
              <el-input v-model.number="parentForm.cidr6"></el-input>
            </el-form-item>.
            <el-form-item prop="cidr7" size="mini">
              <el-input v-model.number="parentForm.cidr7"></el-input>
            </el-form-item>/
            <el-form-item prop="cidr9" size="mini">
              <el-select v-model="parentForm.cidr9" @change="cidrSelectBtn4" size="mini" placeholder="">
                <el-option v-for="(item,index) in netCidrData" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="子区" prop="selectedOptions">
            <el-cascader :props="props" placeholder="请选择子区域" :options="soureceOptions" change-on-select v-model="parentForm.selectedOptions" @change="handleChange">></el-cascader>
          </el-form-item>
          <el-form-item label="机房" prop="datacenter">
            <el-select v-model="parentForm.datacenter" @change='handleChangeDc' placeholder="请选择机房">
              <el-option v-for="(item,index) in parentForm.childForm.datacenter" :key="index" :label="item.dc_name" :value="item.dc_uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集群" prop="hostpool">
            <el-select v-model="parentForm.hostpool" placeholder="请选择集群">
              <el-option v-for="(item,index) in  parentForm.childForm.hostpool" :key="index" :label="item.hc_name" :value="item.hc_uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if="parentForm.netTypeLable == 0 ||parentForm.netWorkUse == 4">
            <el-form-item label="DNS1" size="small" prop="dns1">
              <el-input v-model="parentForm.dns1" type='text'></el-input>
            </el-form-item>
            <el-form-item label="DNS2" size="small" prop="dns2">
              <el-input v-model="parentForm.dns2" type='text'></el-input>
            </el-form-item>
          </div>
          <div v-if="parentForm.netTypeLable == 0 ||parentForm.netWorkUse == 4||parentForm.netWorkUse == 3">
            <el-form-item label="网关" size="small" prop="gateWay">
              <el-input v-model="parentForm.gateWay" type='text'></el-input>
            </el-form-item>
            <el-form-item label="VLAN" size="small" prop="vlan">
              <el-input v-model="parentForm.vlan"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('parentForm')">立即创建</el-button>
            <!-- <el-button @click="resetForm('parentForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAllAreaDcHcNet,
  getsegment_init,
  get_hostcluster_by_area,
  get_area_data_init,
  getUserList,
  addSubNetwork,
  getNetWorkList,
  getUserNetworkList
} from './../../../../api/admin/netWork'
import { getLesseeNameList } from '@/api/admin/lesseeManage'
import { checkUserName, checkIp } from '@/filters/index'
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入名称'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('名称由字母大小写字母+数字6位以上'))
      }
    }
    var checkIp = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入内容'))
      } else if (!this.checkIp(value)) {
        callback(new Error('IP格式不正确'))
      }
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
      }
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
      }
    }
    var checkWorkUse = (rule, value, callback) => {
      if (this.parentForm.netTypeLable == 2) {
        if (value == '') {
          callback(new Error('请选择网络用途'))
        }
      }
    }
    return {
      loading: false,
      allAreaInfo: [], // 所有区域机房集群信息
      pageShow: false,
      tableData: [],
      topAreaData: [],
      netCidrData: [],
      netWorkUseData: [
        {
          //网络类型
          label: '公有NAS网络',
          value: 3
        },
        {
          label: '镜像模板机网络',
          value: 4
        }
      ],
      labelChangeData: 2, //单选切换
      cidrNum: 0,
      userMeData: [], //租户信息
      hostpool: [],
      // selectedOptions: [],
      soureceOptions: [],
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      },
      parentForm: {
        dns1: '',
        dns2: '',
        gateWay: '',
        vlan: '',
        privateDetails: {},
        area_uuid: '',
        topAreaName: '',
        area: '',
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
        netType: '',
        lessee: '',
        netTypeLable: '1',
        childFormName: '',
        labelChangeData: 1,
        network_segment_uuid: '',
        zuhu: '',
        hostpool: '',
        subNetowrkName: '',
        selectedOptions: [], //级联选中
        datacenter: '',
        childForm: {
          datacenter: [],
          hostcluster: [],
          hostpool: '',
          name: '',
          subNetowrkName: ''
        }
      },
      rules: {
        vlan: [
          {
            validator: checkVlan,
            trigger: 'blur'
          }
        ],
        dns1: [
          {
            validator: checkIp,
            trigger: 'blur'
          }
        ],
        dns2: [
          {
            validator: checkIp,
            trigger: 'blur'
          }
        ],
        gateWay: [
          {
            validator: checkIp,
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
        subNetowrkName: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        network_segment_uuid: [
          {
            required: true,
            message: '请选择专有网络',
            trigger: 'change'
          }
        ],
        netWorkUse: [
          {
            validator: checkWorkUse,
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
        cidr9: [
          {
            required: true,
            message: '请选择CIDR',
            trigger: 'change'
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
  mounted() {
    this.getTenantInfo()
  },
  methods: {
    checkUserName,
    checkIp,
    getLesseeNameList,
    getsegment_init,
    get_area_data_init,
    get_hostcluster_by_area,
    getUserList,
    addSubNetwork,
    getNetWorkList,
    getUserNetworkList,
    getAllAreaDcHcNet,
    getAreaList() {
      this.getAllAreaDcHcNet().then(res => {
        if (res.data.code == 0) {
          this.allAreaInfo = res.data.data
          // this.soureceOptions = res.data.data
        }
      })
    },
    getTenantInfo() {
      this.getLesseeNameList().then(res => {
        if (res.data.code == 0) {
          this.userMeData = res.data.data
        }
      })
    },
    getSegmentInitList() {
      this.getsegment_init().then(res => {
        if (res.data.code == 0) {
          this.parentForm.privateDetails = res.data.data
          res.data.data.net_cidr_data.forEach(tmp => {
            if (tmp.cidr_a == this.parentForm.cidr8) {
              this.netCidrData = tmp.netmask
            }
          })
        }
      })
    },
    getSubNetworkLIst(search) {
      this.getUserNetworkList(search).then(res => {
        if (res.data.code == 0) {
          this.topAreaData = res.data.data.host_cluster_data_list
          this.topAreaData.forEach(item => {
            if (item.uuid == this.parentForm.area_uuid) {
              if (item.datacenter && item.datacenter != '') {
                this.soureceOptions = [
                  {
                    name: '直属区域',
                    uuid: item.uuid
                  }
                ]
              }
              if (item.child_area) {
                this.soureceOptions = this.soureceOptions.concat(
                  item.child_area
                )
              }
            }
          })
        }
      })
    },
    getList(search) {
      this.getNetWorkList({
        page_size: 1000000,
        page_no: 1,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.tableData = res.data.data.rows
        }
      })
    },
    proNetworkSelectBtn() {
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.cidr6 = ''
      this.parentForm.cidr9 = ''
      this.parentForm.cidr7 = ''
      this.parentForm.topAreaName = ''
      this.soureceOptions = []
      this.netCidrData = []
      this.parentForm.selectedOptions = []
      this.parentForm.childForm.datacenter = []
      this.parentForm.childForm.hostpool = []
      let cidr = ''
      this.tableData.forEach(item => {
        if (item.uuid == this.parentForm.network_segment_uuid) {
          cidr = item.cidr.split('.')
          this.parentForm.cidr8 = cidr[0]
          this.parentForm.cidr2 = cidr[1]
          this.parentForm.topAreaName = item.area_name
          this.parentForm.area_uuid = item.area_uuid
          this.getSegmentInitList()
        }
      })
      if (this.parentForm.netTypeLable == 1) {
        // 获取租户详情以及绑定的集群
        this.getSubNetworkLIst({
          tenant_uuid: this.parentForm.zuhu
        })
      } else {
        // 获取所有区域机房集群
        this.allAreaInfo.forEach((item, index) => {
          if (item.uuid == this.parentForm.area_uuid) {
            if (item.datacenter && item.datacenter != '') {
              this.soureceOptions = [
                {
                  name: '直属区域',
                  uuid: item.uuid
                }
              ]
            }
            if (item.child_area) {
              this.soureceOptions = this.soureceOptions.concat(item.child_area)
            }
          }
        })
      }
    },
    cidrSelectBtn1(val) {
      this.parentForm.cidr2 = ''
      this.cidrNum = val
      if (val === 0) {
        this.parentForm.cidr8 = 10
      } else if (val === 1) {
        this.parentForm.cidr8 = 172
      } else {
        this.parentForm.cidr8 = 192
      }
    },
    cidrSelectBtn2() {},
    cidrSelectBtn3() {},
    cidrSelectBtn4() {},
    zuhuSelectBtn() {
      // 租户选择事件
      this.parentForm.netWorkUse = ''
      this.parentForm.network_segment_uuid = ''
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.cidr6 = ''
      this.parentForm.cidr9 = ''
      this.parentForm.cidr7 = ''
      this.parentForm.topAreaName = ''
      this.tableData = []
      this.soureceOptions = []
      this.netCidrData = []
      this.parentForm.selectedOptions = []
      this.parentForm.childForm.datacenter = []
      this.parentForm.childForm.hostpool = []
      if (this.parentForm.zuhu != '') {
        this.getList({
          network_type: '1',
          tenant_uuid: this.parentForm.zuhu
        })
      }
    },
    useSelectBtn(val) {
      //网络用途选择
      this.parentForm.dns1 = ''
      this.parentForm.dns2 = ''
      this.parentForm.gateWay = ''
      this.parentForm.vlan = ''
      this.parentForm.zuhu = ''
      this.parentForm.network_segment_uuid = ''
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.cidr6 = ''
      this.parentForm.cidr9 = ''
      this.parentForm.cidr7 = ''
      this.parentForm.topAreaName = ''
      this.userMeData = []
      this.tableData = []
      this.soureceOptions = []
      this.netCidrData = []
      this.parentForm.selectedOptions = []
      this.parentForm.childForm.datacenter = []
      this.parentForm.childForm.hostpool = []
      this.getList({ network_type: this.parentForm.netTypeLable })
    },
    resetInfo() {},
    labelChange(val) {
      //网络单项切换事件
      this.parentForm.labelChangeData = val
      this.parentForm.netWorkUse = ''
      this.parentForm.zuhu = ''
      this.parentForm.network_segment_uuid = ''
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.cidr6 = ''
      this.parentForm.cidr9 = ''
      this.parentForm.cidr7 = ''
      this.parentForm.dns1 = ''
      this.parentForm.dns2 = ''
      this.parentForm.gateWay = ''
      this.parentForm.vlan = ''
      this.parentForm.topAreaName = ''
      this.userMeData = []
      this.tableData = []
      this.soureceOptions = []
      this.netCidrData = []
      this.parentForm.selectedOptions = []
      this.parentForm.childForm.datacenter = []
      this.parentForm.childForm.hostpool = []
      if (val == 1) {
        this.getTenantInfo()
      } else {
        this.getAreaList()
        this.getList({ network_type: this.parentForm.netTypeLable })
      }
    },
    submitForm(formName) {
      let deg = true
      this.$refs[formName].validate(valid => {
        if (!valid) {
          deg = false
        } else {
          deg = true
        }
      })
      if (deg) {
        let cidr = `${this.parentForm.cidr8}.${this.parentForm.cidr2}.${
          this.parentForm.cidr6
        }.${this.parentForm.cidr7}/${this.parentForm.cidr9}`

        let options = {
          name: this.parentForm.subNetowrkName,
          network_segment_uuid: this.parentForm.network_segment_uuid,
          hostcluster_uuid: this.parentForm.hostpool,
          cidr: cidr,
          type: this.parentForm.netTypeLable
        }
        if (this.parentForm.netTypeLable == 0) {
          options.dns1 = this.parentForm.dns1
          options.dns2 = this.parentForm.dns2
        }
        if (
          this.parentForm.netTypeLable == 0 ||
          this.parentForm.netWorkUse == 4 ||
          this.parentForm.netWorkUse == 3
        ) {
          options.gateway = this.parentForm.gateWay
          options.vlan = this.parentForm.vlan
        }
        this.loading = true
        this.addSubNetwork(options).then(res => {
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getDcHcInfo(list, areaUuid) {
      list.forEach(item => {
        if (item.uuid == areaUuid) {
          if (item.datacenter) {
            this.parentForm.childForm.datacenter = item.datacenter
          } else {
            this.parentForm.childForm.datacenter = []
          }
          return
        } else {
          if (item.child_area && item.child_area.length > 0) {
            this.getDcHcInfo(item.child_area, areaUuid)
          }
        }
      })
    },
    handleChange() {
      // 级联选中
      this.parentForm.datacenter = ''
      this.parentForm.hostpool = ''
      this.parentForm.childForm.datacenter = []
      this.parentForm.childForm.hostpool = []
      // 清空
      let areaUuid = JSON.parse(
        JSON.stringify(this.parentForm.selectedOptions)
      ).pop()
      if (this.parentForm.netTypeLable == 1) {
        this.getDcHcInfo(this.topAreaData, areaUuid)
      } else {
        this.getDcHcInfo(this.allAreaInfo, areaUuid)
      }
    },
    handleChangeDc() {
      this.parentForm.hostpool = ''
      this.parentForm.childForm.hostpool = []
      this.parentForm.childForm.datacenter.forEach(item => {
        if (item.dc_uuid == this.parentForm.datacenter) {
          this.parentForm.childForm.hostpool = item.hostcluster
        }
      })
    },
    getSelVal(val) {},
    goToPrev() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang=less>
.subNetCreate {
  /* z-index: 5;
  position: absolute;
  top: -20px; 
  width: 100%;
  background: #f6f6f6; */
  & > .title {
    padding-left: 15px;
    height: 50px;
    line-height: 50px;
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
