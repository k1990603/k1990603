<template>
  <div class="initVlanDiag dialogTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleFormInit" label-width="120px">
      <el-form-item label="区域" prop='topArea'>
        <el-select v-model="ruleForm.topArea" placeholder="请选择区域" size="small" @change="selectArea">
          <el-option v-for="(item,index) in topAreaData" :key="index" :label="item.name" :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子区域" prop='selectedOptions'>
        <el-cascader :props="props" placeholder="请选择子区域" size="small" :options="soureceOptions" change-on-select v-model="ruleForm.selectedOptions" @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="机房" prop='datacenter'>
        <el-select v-model="ruleForm.datacenter" placeholder="请选择机房" size="small">
          <el-option v-for="(item,index) in datacenterData" :key="index" :label="item.dc_name" :value="item.dc_uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="VLANID起始值" prop="startId">
        <el-input type="text" v-model.number="ruleForm.startId"></el-input>
      </el-form-item>
      <el-form-item label="VLANID结束值" prop="endId">
        <el-input type="text" v-model.number="ruleForm.endId"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel('ruleFormInit')">取 消</el-button>
        <el-button type="primary" @click="deleteSubmit()">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { initVlan, get_hostcluster_by_area } from '@/api/admin/netWork'
export default {
  props: ['topAreaData'],
  data() {
    var checkAge = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入11-510的VLAN值'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入11-510的VLAN值'))
      } else {
        if (
          this.ruleForm.endId != '' &&
          this.ruleForm.endId < this.ruleForm.startId
        ) {
          callback(new Error('结束值必须大于开始值'))
        }
        if (value > 510 || value <= 10) {
          callback(new Error('vlan为11-510中的整数值'))
        }
        callback()
      }
    }
    var checkAge1 = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入11-510的VLAN值'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入11-510的VLAN值'))
      } else {
        if (this.ruleForm.endId < this.ruleForm.startId) {
          callback(new Error('结束值必须大于开始值'))
        }
        if (value > 510 || value <= 10) {
          callback(new Error('vlan为11-510中的整数值'))
        }
        callback()
      }
    }
    var checkSubArea = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择子区域'))
      } else {
        callback()
      }
    }
    return {
      datacenterData: [],
      soureceOptions: [],
      ruleForm: {
        topArea: '',
        datacenter: '',
        selectedOptions: [],
        startId: '',
        endId: ''
      },
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      },
      rules: {
        startId: [
          {
            validator: checkAge,
            trigger: 'blur'
          }
        ],
        endId: [
          {
            validator: checkAge1,
            trigger: 'blur'
          }
        ],
        topArea: [
          { required: true, message: '请选择选择区域', trigger: 'change' }
        ],
        selectedOptions: [{ validator: checkSubArea, trigger: 'change' }],
        datacenter: [
          { required: true, message: '请选择机房', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    initVlan,
    get_hostcluster_by_area,
    selectArea(item) {
      // 联动筛选出子区域信息 如果大区直属有机房 则增加直属机房 id为大区id
      this.soureceOptions = []
      this.datacenterData = []
      this.ruleForm.datacenter = ''
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
    handleChange(value, search) {
      // 筛选子区域
      // 级联选中
      // 清空
      this.ruleForm.datacenter = ''
      this.get_hostcluster_by_area({
        area_uuid: value[value.length - 1],
        page_size: 10000,
        page_no: 1,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.datacenterData = res.data.data.datacenter
        }
      })
    },
    // selectdatacenter(val) {
    //   //机房选中
    //   this.datacenterUuid = this.datacenterData[val].dc_uuid
    // },
    deleteSubmit() {
      let deg = true
      this.$refs['ruleFormInit'].validate(valid => {
        if (valid) {
          deg = true
        } else {
          deg = false
        }
      })
      if (deg) {
        let options = {
          vlan_start_id: this.ruleForm.startId,
          vlan_end_id: this.ruleForm.endId,
          datacenter_uuid: this.ruleForm.datacenter
        }
        this.initVlan(options).then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '初始化成功'
            })
            this.$emit('vlan')
            this.$refs['ruleFormInit'].resetFields()
          }
        })
      }
    },
    cancel(ruleForm) {
      this.$emit('vlan')
      this.$refs[ruleForm].resetFields()
    }
  }
}
</script>
<style lang=less>
.initVlanDiag {
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}
</style>
