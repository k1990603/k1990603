<template>
  <div class="creatLB">
    <div class="image-box">
      <el-form v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" ref="createForm" :model="formData" :rules='createRules' label-width="150px">
        <el-form-item label="名称" prop="name">
          <el-col :span='12'>
            <el-input v-model:trim='formData.name' type='text' placeholder="请输入名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="" prop="tenant_uuid" label='所属租户'>
          <el-select v-model="formData.tenant_uuid" @change='handltChangeTenant' placeholder="请选择">
            <el-option v-for="item in tenantList" :key="item.tenant_uuid" :label="item.tenant_name" :value="item.tenant_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="project_uuid">
          <el-select v-model="formData.project_uuid" @change='handltChangeProject' placeholder="请选择">
            <el-option v-for="item in allListInfo.projectList" :key="item.project_uuid" :label="item.project_name" :value="item.project_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所有者" prop="owner">
          <el-select v-model="formData.owner" placeholder="请选择">
            <el-option v-for="item in allListInfo.userList" :key="item.userid" :label="item.username" :value="item.userid">
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
        <el-form-item label="专有网络类型" prop="netTypeLable">
          <el-radio-group v-model="formData.netTypeLable" @change='handleChangeRadio'>
            <el-radio label="0">公用网络</el-radio>
            <el-radio label="1">私用网络</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专有网路" prop="privat_uuid">
          <el-select v-model="formData.privat_uuid" placeholder="请选择" @change='handleChangePrivate'>
            <el-option v-for="item in allListInfo.privatList" :key="item.net_uuid" :label="item.net_name" :value="item.net_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子网" prop="subNet_uuid">
          <el-select v-model="formData.subNet_uuid" placeholder="请选择">
            <el-option v-for="item in allListInfo.subNetList" :key="item.subnet_uuid" :label="item.subnet_name" :value="item.subnet_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网络类型">
          <el-radio-group v-model="formData.netType" size="small">
            <el-radio-button label="0">内网</el-radio-button>
            <el-radio-button label="1">外网</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="带宽" v-if='formData.netType=="1"'>
          <el-input-number :min="1" size="small" v-model="formData.broadband"></el-input-number> MB
        </el-form-item>
        <el-form-item label="购买数量">
          <el-input-number :min="1" size="small" v-model="formData.number"></el-input-number> 个
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getUseArea } from '@/api/admin/vm'
import { createLbInit, createLb } from '@/api/admin/lb'
import { getNetWorkList } from '@/api/admin/netWork'
import { getProjectMember } from '@/api/admin/lesseeManage'
import { checkUserName } from '@/filters/index'
export default {
  props: ['createNum', 'tenantList'],
  components: {},
  watch: {
    createNum(val) {
      this.loading = false
    }
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('名称不能为空'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('名称由字母开头大小写字母+数字6位以上'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      },
      allListInfo: {
        defaultNetList:[],
        projectList: [],
        userList: [],
        areaList: [],
        dcList: [],
        hcList: [],
        privatList: [],
        subNetList: []
      },
      formData: {
        name: '',
        owner: '',
        tenant_uuid: '',
        project_uuid: '',
        project_name: '',
        netTypeLable: '1',
        area_uuid: [],
        dc_uuid: '',
        hc_uuid: '',
        privat_uuid: '',
        subNet_uuid: '',
        netType: '0',
        broadband: 0,
        number: 1
      },
      createRules: {
        name: [{ validator: checkName, trigger: 'blur' }],
        tenant_uuid: [
          { required: true, message: '请选择租户', trigger: 'change' }
        ],
        project_uuid: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        area_uuid: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        dc_uuid: [{ required: true, message: '请选择机房', trigger: 'change' }],
        hc_uuid: [{ required: true, message: '请选择集群', trigger: 'change' }],
        privat_uuid: [
          { required: true, message: '请选择专有网络', trigger: 'change' }
        ],
        subNet_uuid: [
          { required: true, message: '请选择子网', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    getProjectMember,
    checkUserName,
    getNetWorkList,
    createLbInit,
    createLb,
    getUseArea,
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
    handltChangeTenant() {
      this.clearForm(
        [
          'projectList',
          'userList',
          'areaList',
          'dcList',
          'hcList',
          'privatList',
          'subNetList'
        ],
        [
          'project_uuid',
          'owner',
          'area_uuid',
          'dc_uuid',
          'hc_uuid',
          'privat_uuid',
          'subNet_uuid'
        ]
      )
      this.$props.tenantList.forEach(item => {
        if (item.tenant_uuid == this.formData.tenant_uuid) {
          this.allListInfo.projectList = item.project_info
        }
      })
    },
    handltChangeProject() {
      this.clearForm(
        [
          'areaList',
          'userList',
          'dcList',
          'hcList',
          'privatList',
          'subNetList'
        ],
        [
          'area_uuid',
          'owner',
          'dc_uuid',
          'hc_uuid',
          'privat_uuid',
          'subNet_uuid'
        ]
      )
      this.getDefault()
      this.getProjectMember({
        project_uuid: this.formData.project_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.allListInfo.userList = res.data.data
        }
      })
      this.allListInfo.projectList.forEach(item => {
        if (item.project_uuid == this.formData.project_uuid) {
          this.formData.project_name = item.project_name
          return
        }
      })
    },
    getDefault() {
      this.getUseArea({ project_uuid: this.formData.project_uuid }).then(
        res => {
          if (res.data.code == 0) {
            this.allListInfo.areaList = res.data.data
          }
        }
      )
    },
    get_dc_hc(list, uuid) {
      list.forEach(item => {
        if (item.uuid == uuid && item.datacenter) {
          this.allListInfo.dcList = item.datacenter
          return true
        } else {
          this.get_dc_hc(item.child_area, uuid)
        }
      })
    },
    handleChangeArea(val) {
      this.clearForm(
        ['dcList', 'hcList', 'privatList', 'subNetList'],
        ['dc_uuid', 'hc_uuid', 'privat_uuid', 'subNet_uuid']
      )
      let area_uuid = val[val.length - 1]
      this.get_dc_hc(this.allListInfo.areaList, area_uuid)
    },
    handleChangeDc() {
      this.clearForm(
        ['hcList', 'privatList', 'subNetList'],
        ['hc_uuid', 'privat_uuid', 'subNet_uuid']
      )
      this.allListInfo.dcList.forEach(item => {
        if (item.dc_uuid == this.formData.dc_uuid && item.hostcluster) {
          this.allListInfo.hcList = item.hostcluster
        }
      })
    },
    handleChangeHostpool() {
      this.clearForm(
        ['privatList', 'subNetList'],
        ['privat_uuid', 'subNet_uuid']
      )
      this.getSegement()
    },
    getSegement() {
      this.allListInfo.privatList = []
      let options = {
        hostcluster_uuid: this.formData.hc_uuid,
        tenant_uuid: this.formData.tenant_uuid,
        network_seg_type: this.formData.netTypeLable,
        area_uuid: this.formData.area_uuid[0]
      }
      this.createLbInit(options).then(res => {
        if (res.data.code == 0) {
          let arr = []
          this.allListInfo.defaultNetList = res.data.data
          res.data.data.forEach(item => {
            if (arr.indexOf(item.net_name) == -1) {
              arr.push(item.net_name)
              this.allListInfo.privatList.push(item)
            }
          })
        }
      })
      console.log(this.allListInfo.privatList)
    },
    handleChangeRadio() {
      this.clearForm(
        ['privatList', 'subNetList'],
        ['privat_uuid', 'subNet_uuid']
      )
      if (this.formData.hc_uuid != '') {
        this.getSegement()
      }
    },
    handleChangePrivate() {
      this.clearForm(['subNetList'], ['subNet_uuid'])
      this.allListInfo.defaultNetList.forEach(item => {
        if (this.formData.privat_uuid == item.net_uuid) {
          this.allListInfo.subNetList.push(item)
        }
      })
    },
    submit() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          let options = {
            name: this.formData.name,
            tenant_uuid: this.formData.tenant_uuid,
            hostcluster_uuid: this.formData.hc_uuid,
            project_uuid: this.formData.project_uuid,
            network_type: this.formData.netType,
            subnetwork_uuid: this.formData.subNet_uuid,
            create_num: this.formData.number,
            owner: this.formData.owner
          }
          if (this.formData.netType == '1') {
            options.internet_bandwidth = this.formData.broadband
          }
          this.loading = true
          this.createLb(options).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                error: '创建负载均衡成功'
              })
              this.cancel()
            }
          })
        }
      })
    },
    cancel() {
      this.$refs['createForm'].resetFields()
      this.clearForm(
        [
          'projectList',
          'areaList',
          'userList',
          'dcList',
          'hcList',
          'privatList',
          'subNetList'
        ],
        []
      )
      this.formData.number = 1
      this.formData.broadband = 1
      this.$emit('closeDialog')
    }
  },
  watch: {}
}
</script>
<style lang="less">
.creatLB {
  .image-box {
    .el-select {
      // width: 150px;
      margin-left: 0;
    }
  }
  .dialog-footer {
    text-align: center;
    display: block;
  }
}
</style>
