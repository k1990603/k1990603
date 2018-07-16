<template>
  <div class="editContent">
    <div class="oldInfo">
      <div class="itemInfo">
        <label>名称</label>
        <span>{{editInfo.name}}</span>
      </div>
      <div class="itemInfo">
        <label>所有者</label>
        <span>{{editInfo.owner_name}}</span>
      </div>
      <div class="itemInfo">
        <label>所属租户</label>
        <span>{{editInfo.tenant_name}}</span>
      </div>
      <el-form label-width="100px" ref="quatoBox" :model="editInfo" :rules='editRules' label-position='left' class='quatoList'>
        <el-form-item label="配额">
          <el-col :span="8" class="quatoList">
            <el-form-item prop='vm_count'>
              <el-input placeholder="请输入VM数量" v-model="editInfo.vm_count">
                <el-button slot="prepend">VM</el-button>
                <el-button slot="append">个</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop='security_count'>
              <el-input placeholder="请输入安全组数量" v-model="editInfo.security_count">
                <el-button slot="prepend">安全组数量</el-button>
                <el-button slot="append">个</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop='lb_count'>
              <el-input placeholder="请输入负载均衡数量" v-model="editInfo.lb_count">
                <el-button slot="prepend">负载均衡</el-button>
                <el-button slot="append">个</el-button>
              </el-input>
            </el-form-item>
            <!-- <el-form-item prop='private_network_count'>
              <el-input placeholder="请输入专有网络数量" v-model="editInfo.private_network_count">
                <el-button slot="prepend">专有网络</el-button>
                <el-button slot="append">个</el-button>
              </el-input>
            </el-form-item> -->
            <el-form-item prop='internet_ip_count'>
              <el-input placeholder="请输入公网IP数量" v-model="editInfo.internet_ip_count">
                <el-button slot="prepend">公网IP</el-button>
                <el-button slot="append">个</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop='internet_bandwidth'>
              <el-input placeholder="请输入公网带宽大小" v-model="editInfo.internet_bandwidth">
                <el-button slot="prepend">公网带宽</el-button>
                <el-button slot="append">Mbps</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop='cpu'>
              <el-input placeholder="请输入CPU大小" v-model="editInfo.cpu">
                <el-button slot="prepend">CPU</el-button>
                <el-button slot="append">核</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop='mem'>
              <el-input placeholder="请输入MEM大小" v-model="editInfo.mem">
                <el-button slot="prepend">MEM</el-button>
                <el-button slot="append">G</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop='disk'>
              <el-input placeholder="请输入DISK大小" v-model="editInfo.disk">
                <el-button slot="prepend">DISK</el-button>
                <el-button slot="append">G</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="tipText">
      确定执行
      <span>配额调整</span>
      操作？
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click='onSubmit'>确 定</el-button>
      <el-button @click="$emit('editQuato')">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { editProjectQuato } from '@/api/admin/lesseeManage'
import { checkQuatoVal } from '@/filters/index'
export default {
  props: ['editInfo'],
  data() {
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
      editRules: {
        vm_count: [{ validator: checkVm, trigger: 'blur' }],
        security_count: [{ validator: checkSecurity, trigger: 'blur' }],
        lb_count: [{ validator: checkLb, trigger: 'blur' }],
        private_network_count: [{ validator: checkPrivate, trigger: 'blur' }],
        internet_ip_count: [{ validator: checkInternetIp, trigger: 'blur' }],
        internet_bandwidth: [{ validator: checkBandwidth, trigger: 'blur' }],
        mem: [{ validator: checkMem, trigger: 'blur' }],
        cpu: [{ validator: checkCpu, trigger: 'blur' }],
        disk: [{ validator: checkDisk, trigger: 'blur' }]
      }
    }
  },
  computed: {},
  methods: {
    checkQuatoVal,
    editProjectQuato,
    onSubmit() {
      this.$refs['quatoBox'].validate(valid => {
        if (valid) {
          let options = {
            cpu: this.editInfo.cpu,
            mem: this.editInfo.mem,
            disk: this.editInfo.disk,
            vm_count: this.editInfo.vm_count,
            security_count: this.editInfo.security_count,
            lb_count: this.editInfo.lb_count,
            private_network_count: this.editInfo.private_network_count,
            internet_ip_count: this.editInfo.internet_ip_count,
            internet_bandwidth: this.editInfo.internet_bandwidth,
            project_uuid: this.editInfo.uuid
          }
          this.editProjectQuato(options).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$emit('editQuato')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.editContent {
  .tipText {
    margin-bottom: 15px;
    padding: 15px 10px;
    vertical-align: middle;
    color: #264663;
    border: 1px solid #7ab1de;
    border-radius: 2px;
    background: #d2e7f7;
    margin-top: 15px;
    font-size: 16px;
    span {
      font-size: 18px;
      color: #f00;
    }
  }
  .oldInfo {
    & > h3 {
      margin-bottom: 15px;
    }
    .quatoList {
      .el-button {
        width: 100px !important;
      }
      .el-input__inner {
        min-width: 150px !important;
      }
      .el-form-item:not(:first-child) {
        margin-top: 20px;
      }
    }
    .itemInfo {
      font-size: 14px;
      padding-bottom: 15px;

      & > label {
        width: 120px;
        display: inline-block;
      }
      & > span {
        color: #999;
      }
      & > .nameBox {
        display: inline-block;
      }
      &.textAreaBox {
        & > label {
          vertical-align: top;
        }
        .nameBox {
          width: 400px;
        }
      }
    }
  }
}
</style>
