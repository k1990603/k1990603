<template>
  <div class="lesseeCreatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      新建租户
    </div>
    <div class="lessseeInfo">
      <el-steps :active="stepActive" :align-center='true'>
        <el-step title="基本信息" icon="el-icon-edit"></el-step>
        <el-step title="设置配额" icon="el-icon-upload"></el-step>
        <el-step title="关联集群" icon="el-icon-picture"></el-step>
      </el-steps>
      <el-form v-show="stepActive == 1" label-width="120px" :model="createInfo" status-icon :rules="createRules" ref="lesseeInfo">
        <el-form-item label="名称" prop='name'>
          <el-col :span="8">
            <el-input v-model="createInfo.name" placeholder="请输入租户名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="电话" prop='telephone'>
          <el-col :span="8">
            <el-input v-model="createInfo.telephone" placeholder="请输入租户电话"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-col :span="8">
            <el-input v-model="createInfo.email" placeholder="请输入邮箱"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="large">
          <div>
            <el-button type="primary" plain @click="toNext('lesseeInfo')">下一步：设置配额</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-form v-show="stepActive == 2" label-width="120px" :model="createInfo" status-icon :rules="createRules" ref="hostPoolInfo">
        <el-form-item class='quatoList' prop='vm_count' label="VM">
          <el-col :span="8">
            <el-input placeholder="请输入VM数量" v-model="createInfo.vm_count">
              <el-button slot="append">个</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class='quatoList' prop='security_count' label="安全组">
          <el-col :span="8">
            <el-input placeholder="请输入安全组数量" v-model="createInfo.security_count">
              <el-button slot="append">个</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class='quatoList' prop='lb_count' label="负载均衡">
          <el-col :span="8">
            <el-input placeholder="请输入负载均衡数量" v-model="createInfo.lb_count">
              <el-button slot="append">个</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class='quatoList' prop='private_network_count' label="专有网络">
          <el-col :span="8">
            <el-input placeholder="请输入专有网络数量" v-model="createInfo.private_network_count">
              <el-button slot="append">个</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class='quatoList' prop='internet_ip_count' label="公网IP">
          <el-col :span="8">
            <el-input placeholder="请输入公网IP数量" v-model="createInfo.internet_ip_count">
              <el-button slot="append">个</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class='quatoList' prop='internet_bandwidth' label="公网带宽">
          <el-col :span="8">
            <el-input placeholder="请输入公网带宽大小" v-model="createInfo.internet_bandwidth">
              <el-button slot="append">Mbps</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class='quatoList' prop='cpu' label="CPU">
          <el-col :span="8">
            <el-input placeholder="请输入CPU大小" v-model="createInfo.cpu">
              <el-button slot="append">核</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class='quatoList' prop='mem' label="MEM">
          <el-col :span="8">
            <el-input placeholder="请输入MEM大小" v-model="createInfo.mem">
              <el-button slot="append">G</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item class='quatoList' prop='disk' label="DISK">
          <el-col :span="8">
            <el-input placeholder="请输入DISK大小" v-model="createInfo.disk">
              <el-button slot="append">G</el-button>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" plain @click='prev'>上一步</el-button>
          <el-button type="primary" plain @click='toNext("hostPoolInfo")'>下一步：关联集群</el-button>
        </el-form-item>
      </el-form>
      <el-form v-show="stepActive == 3" label-width="120px" :model="createInfo" status-icon :rules="createRules" ref="createInfo">
        <el-form-item label="区域">
          <el-tree :props="props" :data="areaList" ref='tree' node-key="value" show-checkbox @check-change="handleCheckChange">
          </el-tree>
        </el-form-item>
        <el-form-item label="所属机房">
          <div class="selectBox">
            <el-table height="250" :data="datacenterList" tooltip-effect="dark" style="width: 500px" @selection-change="handleDatacenterChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="name" label="机房名称" min-width="120">
              </el-table-column>
              <el-table-column prop="area_name" label="所属区域" min-width="120">
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="所属集群">
          <div class="selectBox">
            <el-table height="250" :data="hostpoolList" tooltip-effect="dark" style="width: 500px" @selection-change="handleHostpoolChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="name" label="集群" min-width="120">
              </el-table-column>
              <el-table-column prop="datacenterName" label="所属机房" min-width="120">
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="warning" plain @click='prev'>上一步</el-button>
          <el-button type="primary" plain @click="onSubmit()">确认创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  createLesseeList,
  getAreaInfo,
  getDatcenterInfo
} from '@/api/admin/lesseeManage'
import { checkEmail, checkTel, checkQuatoVal } from '@/filters/index'
export default {
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
    var checkVm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入VM数量'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    var checkSecurity = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入安全组数量'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    var checkLb = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入负载均衡数量'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    var checkPrivate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入专有网络数量'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    var checkBandwidth = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入公网带宽大小'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    var checkCpu = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入CPU大小'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    var checkMem = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入MEM大小'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    var checkDisk = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入DISK大小'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    var checkInternetIp = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入公网IP数量'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('必须为整数'))
      } else {
        callback()
      }
    }
    return {
      stepActive: 1,
      areaList: null, // 树结构区域以及子区域信息
      datacenterList: [], // 树结构机房信息
      selectedDatacenterList: [], // 被选中的机房信息
      hostpoolList: [], // 树结构集群信息
      selectedDatacenter: '', // 被选中的机房
      createInfo: {
        name: '',
        email: '',
        telephone: '',
        cpu: '',
        mem: '',
        disk: '',
        vm_count: '',
        security_count: '',
        lb_count: '',
        private_network_count: '',
        internet_ip_count: '',
        internet_bandwidth: '',
        hostcluster_uuid_list: []
      },
      createRules: {
        name: [
          { required: true, message: '请输入租户名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        telephone: [{ validator: checkTelphone, trigger: 'blur' }],
        vm_count: [
          {
            validator: checkVm,
            trigger: 'blur'
          },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        security_count: [
          { validator: checkSecurity, trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        lb_count: [
          { validator: checkLb, trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        private_network_count: [
          { validator: checkPrivate, trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        internet_ip_count: [
          { validator: checkInternetIp, trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        internet_bandwidth: [
          { validator: checkBandwidth, trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        mem: [
          { validator: checkMem, trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        cpu: [
          { validator: checkCpu, trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        disk: [
          { validator: checkDisk, trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      },
      props: {
        // 区域树结构展示参数
        label: 'name',
        children: 'child_area'
      },
      count: 1
    }
  },
  created() {
    this.loadNode()
  },
  methods: {
    checkEmail,
    checkTel,
    checkQuatoVal,
    createLesseeList,
    getAreaInfo,
    getDatcenterInfo,
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 上一步
    toNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.next()
        }
      })
    },
    prev() {
      if (this.stepActive <= 1) {
        this.stepActive = 1
      } else if (this.stepActive <= 3) {
        this.stepActive--
      }
    },
    // 下一步
    next() {
      if (this.stepActive >= 1) {
        this.stepActive++
      } else if (this.stepActive >= 3) {
        this.stepActive = 3
      }
    },
    // 创建租户
    onSubmit() {
      if (this.createInfo.hostcluster_uuid_list.length > 0) {
        let hostclusterUuidList = JSON.stringify(
          this.createInfo.hostcluster_uuid_list
        )
        let options = JSON.parse(JSON.stringify(this.createInfo))
        options.hostcluster_uuid_list = hostclusterUuidList
        this.createLesseeList(options).then(res => {
          if (res.data.code != 0) {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          } else {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.$router.go(-1)
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择租户需要绑定的集群'
        })
      }
    },
    // 树形结构
    //区域筛选
    handleCheckChange(data, checked) {
      this.datacenterList = []
      let dc_arr = this.$refs.tree.getCheckedNodes()
      dc_arr.forEach(item => {
        if (item.datacenter) {
          item.datacenter.forEach(tmp => {
            tmp.area_name = item.name
            tmp.area_uuid = item.uuid
          })
          this.datacenterList = this.datacenterList.concat(item.datacenter)
        }
      })
    },
    // 机房筛选
    handleDatacenterChange(val) {
      let list = val
      this.selectedDatacenterList = val
      this.hostpoolList = []
      if (list.length > 0) {
        list.forEach(item => {
          if (item.hostcluster) {
            item.hostcluster.forEach(tmp => {
              tmp.datacenterName = item.name
              tmp.dc_uuid = item.uuid
            })
            this.hostpoolList = this.hostpoolList.concat(item.hostcluster)
          }
        })
      }
    },
    // 选择集群
    handleHostpoolChange(val) {
      let list = val
      this.createInfo.hostcluster_uuid_list = []
      if (list.length <= 0) {
        return false
      } else {
        list.forEach(item => {
          this.createInfo.hostcluster_uuid_list.push(item.uuid)
        })
      }
    },
    // 加载区域选择树结构
    loadNode(node, resolve) {
      this.getAreaInfo().then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            msg: res.data.msg
          })
        } else {
          this.areaList = res.data.data
        }
      })
    }
  }
}
</script>
<style lang="less">
.lesseeCreatePage {
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
  .lessseeInfo {
    .selectBox {
      width: 500px;
      padding: 5px;
      background: #f5f7fa;
      .searchBox {
        position: relative;
        height: 50px;
        .el-select {
          position: absolute;
          right: 0px;
          top: 0;
        }
      }
    }
    .el-form {
      margin-top: 15px;
      .quatoList {
        .el-button {
          width: 75px !important;
        }
        .el-input__inner {
          min-width: 150px !important;
        }
        .el-form-item:not(:first-child) {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>