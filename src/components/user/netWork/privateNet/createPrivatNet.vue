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
        <el-form label-width="100px" v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" class="parentForm" label-position="left" :model="parentForm" :rules="rules" ref="formRef">
          <el-form-item label="区域" prop="areaNmae">
            <el-select v-model="parentForm.areaNmae" filterable placeholder="请选择区域" @change="areaNmaeSelectBtn">
              <el-option v-for="(item,index) in topAreaData" :key="index" :label="item.name" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" size="small" prop="name">
            <el-input v-model="parentForm.name" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="CIDR" class="cidr">
            <el-form-item prop="cidr1" size="mini">
              <el-select v-model="parentForm.cidr1" filterable @change="cidrSelectBtn1" size="mini">
                <el-option v-for="(item,index) in netCidrData" :key="index" :label="item.cidr_a" :value="item.cidr_a">
                </el-option>
              </el-select>
            </el-form-item>.
            <el-form-item prop="cidr2" size="mini">
              <el-select v-model="parentForm.cidr2" filterable @change="cidrSelectBtn2" size="mini">
                <el-option v-for="(item,index) in parentForm.childForm.cidr_b_list" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>.
            <el-form-item prop="cidr3" size="mini">
              <el-input v-model.number="parentForm.cidr3"></el-input>
            </el-form-item>.
            <el-form-item prop="cidr4" size="mini">
              <el-input v-model.number="parentForm.cidr4"></el-input>
            </el-form-item>/
            <el-form-item prop="cidr5" size="mini">
              <el-select v-model="parentForm.cidr5" @change="cidrSelectBtn3" size="mini" placeholder="">
                <el-option v-for="(item,index) in  parentForm.childForm.cidrMaskList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <div class="subTitle">
            初始化子网信息
          </div>
          <el-form-item label="子网名称" prop="subNetowrkName" size="small">
            <el-input v-model="parentForm.subNetowrkName" :maxlength="200"></el-input>
          </el-form-item>
          <!-- <el-form-item label="网卡名称" prop="childFormName" size="small">
            <el-input v-model="parentForm.childFormName" :maxlength="200"></el-input>
          </el-form-item> -->
          <el-form-item label="CIDR" class="cidr">
            <el-form-item size="mini">
              <el-input v-model="parentForm.cidr1" :disabled="true"></el-input>
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
              <el-select v-model="parentForm.cidr9" filterable @change="cidrSelectBtn4" size="mini" placeholder="">
                <el-option v-for="(item,index) in  parentForm.childForm.cidrMaskList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="子区" prop="selectedOptions">
            <el-cascader :props="props" placeholder="请选择子区域" :options="soureceOptions" change-on-select v-model="parentForm.selectedOptions" @change="handleChange"></el-cascader>
            <!-- <el-select v-model="parentForm.selectedOptions" placeholder="请选择机房">
              <el-option v-for="(item,index) in soureceOptionsr" :key="index" :label="item.area_name" :value="item.area_uuid">
              </el-option>
            </el-select> -->
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
import { mapGetters, mapActions } from 'vuex'
import {
  getsegment_init,
  addNetwork,
  getUserNetworkList
} from './../../../../api/admin/netWork'
export default {
  data() {
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
      cidrNum: 0,
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
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ],
        subNetowrkName: [
          {
            required: true,
            message: '请输入子网名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ],
        // childFormName: [{
        //     required: true,
        //     message: '请输入网卡名称',
        //     trigger: 'blur'
        //   },
        //   {
        //     min: 3,
        //     max: 15,
        //     message: '长度在 3 到 15 个字符',
        //     trigger: 'blur'
        //   }
        // ],
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
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  mounted() {
    this.getSegmentInitList()
    this.getSubNetworkLIst({
      tenant_uuid: this.userInfo.tenantInfo.tenant_uuid
    })
  },
  methods: {
    getsegment_init,
    addNetwork,
    getUserNetworkList,
    getSegmentInitList() {
      this.getsegment_init().then(res => {
        if (res.data.code == 0) {
          this.netCidrData = res.data.data.net_cidr_data
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
      if (this.topAreaData[item].child_area.length > 0) {
        this.soureceOptions = [].concat(this.topAreaData[item].child_area)
      } else {
        this.soureceOptions = []
      }
      if (
        this.topAreaData[item].datacenter &&
        this.topAreaData[item].datacenter.length > 0
      ) {
        this.soureceOptions.unshift({
          name: '直属区域',
          uuid: this.topAreaData[item].uuid
        })
      }
    },
    cidrSelectBtn1(val) {
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
    submitForm() {
      let deg = true
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          deg = true
        } else {
          deg = false
        }
      })
      if (deg) {
        let cidr = `${this.parentForm.cidr1}.${this.parentForm.cidr2}.${
          this.parentForm.cidr3
        }.${this.parentForm.cidr4}/${this.parentForm.cidr5}`
        let sub_network_cidr = `${this.parentForm.cidr1}.${
          this.parentForm.cidr2
        }.${this.parentForm.cidr6}.${this.parentForm.cidr7}/${
          this.parentForm.cidr9
        }`

        let options = {
          area_uuid: this.parentForm.areaName,
          name: this.parentForm.name,
          cidr: cidr,
          type: '1',
          // nic_name: this.parentForm.childFormName,
          tenant_uuid: this.userInfo.tenantInfo.tenant_uuid,
          sub_network_name: this.parentForm.subNetowrkName,
          sub_network_cidr: sub_network_cidr,
          hostcluster_uuid: this.parentForm.hostpool
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
            this.goToPrev()
          }
        })
      }
    },
    resetForm() {
      this.$refs['formRef'].resetFields()
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
      // 清空
      let areaUuid = this.parentForm.selectedOptions[
        this.parentForm.selectedOptions.length - 1
      ]
      this.getDcHc(this.topAreaData, areaUuid)
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
