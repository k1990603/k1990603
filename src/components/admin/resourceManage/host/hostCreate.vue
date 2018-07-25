<template>
  <div class="hostCreate dialogTemplate" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="HOST创建中,请耐心等待...">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="主机名称" prop="name" required>
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="序列号主键" prop="uuid" required>
        <el-input type="text" v-model="ruleForm.uuid"></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <el-cascader placeholder="请选择区域" :props='props' @change="getDc" :options="ruleForm.soureceOptions" v-model="ruleForm.area" filterable change-on-select></el-cascader>
      </el-form-item>
      <el-form-item label="机房" prop="dc_uuid" required>
        <el-select v-model="ruleForm.dc_uuid" placeholder="请选择机房" @change="getHc">
          <el-option v-for="item in ruleForm.datacenterOptions" :key="item.dc_uuid" :label="item.dc_name" :value="item.dc_uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="集群" prop="hc_uuid" required>
        <el-select v-model="ruleForm.hc_uuid" placeholder="请选择集群">
          <el-option v-for="item in ruleForm.hostPoolOptions" :key="item.hc_uuid" :label="item.hc_name" :value="item.hc_uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保留内存" prop="saveMem" required>
        <el-input-number v-model="ruleForm.saveMem" :min="0" :max="512" label="保留内存"></el-input-number> G
      </el-form-item>
      <el-form-item label="IP地址" prop="ipAdress" required>
        <el-input type="text" v-model="ruleForm.ipAdress"></el-input>
      </el-form-item>
      <el-form-item label="VLANID" prop="vlan_id" required>
        <el-input-number v-model="ruleForm.vlan_id" controls-position="right" :min="1" :max="4096"></el-input-number>
      </el-form-item>
      <el-form-item label="管理IP" prop="ipAdmin" required>
        <el-input type="text" v-model="ruleForm.ipAdmin"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="emitRes">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 
<script>
import { getAreaInfo, getDatcenterInfo } from '@/api/admin/lesseeManage'
import { addHost } from '@/api/admin/hostManage'
import { checkUserName, checkIp } from '@/filters/index'
export default {
  props: ['creatId'],
  watch: {
    creatId(val) {
      this.ruleForm.soureceOptions = []
      this.ruleForm.datacenterOptions = []
      this.ruleForm.datacenterOptions = []
      this.$refs.ruleForm.resetFields()
      this.loading = false
    }
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入主机名称'))
      } else if (!this.checkUserName(value)) {
        console.log(this.checkUserName(value))
        callback(new Error('主机名称由大小写字母或者数字6位以上组成'))
      } else {
        callback()
      }
    }
    var checkUuid = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入序列号名称'))
      } else if (!this.checkUserName(value)) {
        console.log(this.checkUserName(value))
        callback(new Error('序列号名称由大小写字母或者数字6位以上组成'))
      } else {
        callback()
      }
    }
    var checkIpAdmin = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理IP'))
      } else if (!this.checkIp(value)) {
        console.log(this.checkIp(value))
        callback(new Error('IP格式不正确'))
      } else {
        callback()
      }
    }
    var checkIpAdress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理IP'))
      } else if (!this.checkIp(value)) {
        console.log(this.checkIp(value))
        callback(new Error('IP格式不正确'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        soureceOptions: [],
        datacenterOptions: [],
        datacenterOptions: [],
        name: '',
        uuid: '',
        area: [],
        dc_uuid: '',
        vlan_id: 1,
        hc_uuid: '',
        saveMem: 1,
        ipAdress: '',
        ipAdmin: ''
      },
      rules: {
        name: [{ required: true, validator: checkName, trigger: 'blur' }],
        uuid: [{ required: true, validator: checkUuid, trigger: 'blur' }],
        area: [{ required: true, message: '请选择区域', trigger: 'blur' }],
        dc_uuid: [{ required: true, message: '请选择机房', trigger: 'blur' }],
        hc_uuid: [{ required: true, message: '请选择集群', trigger: 'blur' }],
        ipAdress: [
          { required: true, validator: checkIpAdress, trigger: 'blur' }
        ],
        ipAdmin: [{ required: true, validator: checkIpAdmin, trigger: 'blur' }]
      },
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      }
    }
  },
  created() {
    this.getArea()
  },
  computed: {},
  methods: {
    addHost,
    checkIp,
    checkUserName,
    getAreaInfo,
    getDatcenterInfo,
    getArea() {
      this.getAreaInfo().then(res => {
        if (res.data.code == 0) {
          this.ruleForm.soureceOptions = res.data.data
        }
      })
    },
    getDc(val) {
      this.ruleForm.dc_uuid = ''
      this.ruleForm.hc_uuid = ''
      this.ruleForm.hostPoolOptions = []
      this.getDatcenterInfo({ area_uuid: [].concat(val).pop() }).then(res => {
        this.ruleForm.datacenterOptions = res.data.data.datacenter
      })
    },
    getHc() {
      this.ruleForm.hc_uuid = ''
      this.ruleForm.hostPoolOptions = []
      this.ruleForm.datacenterOptions.forEach(item => {
        if (item.dc_uuid === this.ruleForm.dc_uuid && item.hostcluster) {
          this.ruleForm.hostPoolOptions = item.hostcluster
        }
      })
    },
    emitRes() {
      this.$emit('createRes')
      this.$refs.ruleForm.resetFields()
    },
    submit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true
          let options = {
            name: this.ruleForm.name,
            serial_number: this.ruleForm.uuid,
            host_ip: this.ruleForm.ipAdress,
            hold_mem_gb: this.ruleForm.saveMem,
            remote_manage_ip: this.ruleForm.ipAdmin,
            vlan_id: this.ruleForm.vlan_id,
            hostcluster_uuid: this.ruleForm.hc_uuid
          }
          this.addHost(options).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '创建HOST成功'
              })
              this.emitRes()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang=less>
</style>