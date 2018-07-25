<template>
  <div class="writeIpNet dialogTemplate">
    <el-form :model='ruleForm' label-width="100px" ref='ipNetForm' :rules='ipNetRules'>
      <el-form-item label="区域" prop='topArea'>
        <el-select v-model="ruleForm.topArea" placeholder="请选择区域" @change="selectArea">
          <el-option v-for="(item,index) in topAreaData" :key="index" :label="item.name" :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子区域" prop='selectedOptions'>
        <el-cascader :props="props" placeholder="请选择子区域" :options="ruleForm.soureceOptions" change-on-select v-model="ruleForm.selectedOptions" @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="机房" prop='datacenterValue'>
        <el-select v-model="ruleForm.datacenterValue" placeholder="请选择机房">
          <el-option v-for="(item,index) in ruleForm.datacenterData" :key="index" :label="item.dc_name" :value="item.dc_uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CIDR" prop='cidr'>
        <el-col :span='14'>
          <el-input type="text" v-model="ruleForm.cidr" class="input-with-select">
            <el-select v-model="ruleForm.netMask" slot="append" placeholder="请选择">
              <el-option :label="item" :value="item" v-for='(item,index) in netMaskArr' :key="index"></el-option>
            </el-select>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="DNS(主)" prop='DNSMain'>
        <el-col :span='14'>
          <el-input type="text" v-model="ruleForm.DNSMain"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="DNS(副)" prop='DNSTwo'>
        <el-col :span='14'>
          <el-input type="text" v-model="ruleForm.DNSTwo"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="VLANID" prop='vlanId'>
        <el-col :span='14'>
          <el-input type="text" v-model="ruleForm.vlanId"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="网关" prop='gateway'>
        <el-col :span='14'>
          <el-input type="text" v-model="ruleForm.gateway"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { get_hostcluster_by_area, ipNetWriteInf } from '@/api/admin/netWork'
import { checkIp, checkQuatoVal } from '@/filters/index'
export default {
  props: ['topAreaData'],
  data() {
    var checkSubArea = (rule, value, callback) => {
      if (this.ruleForm.selectedOptions.length <= 0) {
        callback(new Error('请选择子区域'))
      } else if (this.ruleForm.datacenterData.length <= 0) {
        callback(new Error('所选区域没有机房'))
      } else {
        callback()
      }
    }
    var checkIp = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入网络号'))
      } else if (!this.checkIp(value)) {
        callback(new Error('网络号格式不正确'))
      } else {
        callback()
      }
    }
    var checkDns = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入DNS'))
      } else if (!this.checkIp(value)) {
        callback(new Error('DNS格式不正确'))
      } else {
        callback()
      }
    }
    var checkVlanId = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入VLAN ID'))
      } else if (!this.checkQuatoVal(value)) {
        callback(new Error('VLAN ID为1-4096的数值'))
      } else {
        callback()
      }
    }
    var checkGateway = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入网关'))
      } else if (!this.checkIp(value)) {
        callback(new Error('网关格式不正确'))
      } else {
        callback()
      }
    }
    return {
      netMaskArr: [
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32
      ],
      ruleForm: {
        soureceOptions: [],
        datacenterData: [],
        topArea: '', // 顶层区域
        selectedOptions: [], // 子区域
        areaValue: '',
        datacenterValue: '',
        cidr: '',
        netMask: '16',
        DNSMain: '',
        DNSTwo: '',
        vlanId: '',
        gateway: ''
      },
      ipNetRules: {
        topArea: [
          { required: true, message: '请选择选择区域', trigger: 'blur' }
        ],
        selectedOptions: [{ validator: checkSubArea, trigger: 'blur' }],
        datacenterValue: [
          { required: true, message: '请选择机房', trigger: 'blur' }
        ],
        cidr: [{ validator: checkIp, trigger: 'blur' }],
        DNSMain: [{ validator: checkDns, trigger: 'blur' }],
        DNSTwo: [{ validator: checkDns, trigger: 'blur' }],
        vlanId: [{ validator: checkVlanId, trigger: 'blur' }],
        gateway: [{ validator: checkGateway, trigger: 'blur' }]
      },
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      }
    }
  },
  methods: {
    ipNetWriteInf,
    checkQuatoVal,
    checkIp,
    get_hostcluster_by_area,
    selectArea(item) {
      // 联动筛选出子区域信息 如果大区直属有机房 则增加直属机房 id为大区id
      this.ruleForm.soureceOptions = []
      this.ruleForm.datacenterData = []
      this.ruleForm.datacenterValue = ''
      if (
        this.topAreaData[item].datacenter &&
        this.topAreaData[item].datacenter != ''
      ) {
        this.ruleForm.soureceOptions = [
          {
            name: '直属区域',
            uuid: this.topAreaData[item].uuid
          }
        ]
      }
      if (this.topAreaData[item].child_area) {
        this.ruleForm.soureceOptions = this.ruleForm.soureceOptions.concat(
          this.topAreaData[item].child_area
        )
      }
    },
    handleChange(value, search) {
      // 筛选子区域
      // 级联选中
      // 清空
      this.ruleForm.datacenterData = []
      this.ruleForm.datacenterValue = ''
      this.get_hostcluster_by_area({
        area_uuid: value[value.length - 1],
        page_size: 10000,
        page_no: 1,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.ruleForm.datacenterData = res.data.data.datacenter
          if (this.ruleForm.datacenterData.length <= 0) {
            this.$message({
              type: 'error',
              message: '所选区域无机房'
            })
          }
        }
      })
    },
    submit() {
      this.$refs['ipNetForm'].validate(valid => {
        if (valid) {
          let options = {
            datacenter_uuid: this.ruleForm.datacenterValue,
            cidr: this.ruleForm.cidr + '/' + this.ruleForm.netMask,
            dns1: this.ruleForm.DNSMain,
            dns2: this.ruleForm.DNSTwo,
            gateway: this.ruleForm.gateway,
            vlan: this.ruleForm.vlanId
          }
          this.ipNetWriteInf(options).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '公网录入成功'
              })
              this.cancel()
            }
          })
        }
      })
      // this.cancel()
    },
    cancel() {
      this.$refs['ipNetForm'].resetFields()
      this.$emit('writeInRes')
    }
  }
}
</script>
<style lang=less>
.writeIpNet {
  .el-input-group__append {
    width: 60px;
  }
}
</style>

