<template>
  <div class="projectIpPage dialogTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="所在网段">
        <el-col :span='16'>
          <el-input type="text" v-model="initSegement" :disabled="true"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="开始IP" prop='start_ip' required>
        <el-select v-model="ruleForm.start_ip" @change="getEndIp()" filterable placeholder="请选择IP">
          <el-option v-for="(item,index) in ipList" :key="index" :label="item.ip_address" :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结束IP" prop='end_ip' required>
        <el-select v-model="ruleForm.end_ip" filterable placeholder="请选择IP">
          <el-option v-for="(item,index) in endIpList" :key="index" :label="item.ip_address" :value="item.ip_address">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="租户" prop='tenant_uuid' required>
        <el-select v-model="ruleForm.tenant_uuid" @change='getProjectList' placeholder="请选择租户">
          <el-option v-for="item in lesseOptions" :key="item.tenant_uuid" :label="item.tenant_name" :value="item.tenant_uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目" prop='project_uuid' required>
        <el-select v-model="ruleForm.project_uuid" placeholder="请选择项目">
          <el-option v-for="item in projectOptions" :key="item.project_uuid" :label="item.project_name" :value="item.project_uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getLesseeNameList, getProjectArr } from '@/api/admin/lesseeManage'
import { ipNetDistribution } from '@/api/admin/netWork'
export default {
  props: ['ipArr', 'initSegement'],
  data() {
    return {
      endIpList: [],
      rules: {
        tenant_uuid: [
          { required: true, message: '请选择所属租户', trigger: 'change' }
        ],
        project_uuid: [
          { required: true, message: '请选择所属项目', trigger: 'change' }
        ],
        start_ip: [
          { required: true, message: '请选择开始IP', trigger: 'change' }
        ],
        start_ip: [
          { required: true, message: '请选择结束IP', trigger: 'change' }
        ]
      },
      lesseOptions: [],
      projectOptions: [],
      ruleForm: {
        start_ip: '',
        end_ip: '',
        tenant_uuid: '',
        project_uuid: ''
      }
    }
  },
  mounted() {
    this.getTenantList()
  },
  computed: {
    ipList() {
      let arr = []
      this.ipArr.forEach(element => {
        if (element.status && element.status == '0') {
          arr.push(element)
        }
      })
      return arr
    }
  },
  methods: {
    ipNetDistribution,
    getLesseeNameList,
    getProjectArr,
    getEndIp(index) {
      this.endIpList = this.ipList.slice(parseInt(this.ruleForm.start_ip))
    },
    getTenantList() {
      this.getLesseeNameList().then(res => {
        if (res.data.code == 0) {
          this.lesseOptions = res.data.data
        }
      })
    },
    getProjectList() {
      this.getProjectArr({ tenant_uuid: this.ruleForm.tenant_uuid }).then(
        res => {
          if (res.data.code == 0) {
            this.projectOptions = res.data.data
          }
        }
      )
    },
    cancel() {
      this.$refs.ruleForm.resetFields()
      this.$emit('distributionRes')
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ipNetDistribution({
            internet_network_segment_uuid: JSON.parse(
              this.$route.query.ipNetInfo
            ).uuid,
            ip_address: JSON.stringify({
              start_ip: this.ipList[parseInt(this.ruleForm.start_ip)]
                .ip_address,
              end_ip: this.ruleForm.end_ip
            }),
            project_uuid: this.ruleForm.project_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '授权成功'
              })
              this.cancel()
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

