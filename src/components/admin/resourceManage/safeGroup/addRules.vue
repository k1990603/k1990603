<template>
  <div class="addSafeGroupRule dialogTemplate">
    <div class="SafeGroupRuleInfo" v-loading="submitLoading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading">
      <div class="tableContent">
        <ul class='rowConetnt'>
          <li class="row_cloum">类型</li>
          <li class="row_cloum">CIDR</li>
          <li class="row_cloum">开始接口</li>
          <li class="row_cloum">结束端口</li>
          <li class="row_cloum">备注</li>
          <li class="row_cloum">操作</li>
        </ul>
      </div>
      <div class="tableContent">
        <el-form ref="formContent">
          <ul class='rowConetnt' v-for='(item,index) in ruleForm' :key='index'>
            <el-form :model="item" ref="'ruleForm'+index">
              <li class="row_cloum">
                <el-form-item prop='protocol' :rules="[{ required: true, message: ' 请选择机房 ', trigger: 'change ' }]">
                  <el-select size='small' @change='getChangeRes(item.protocol,index)' v-model="item.protocol" placeholder="请选择">
                    <el-option label="ALL" value="0">
                    </el-option>
                    <el-option label="TCP" value="1">
                    </el-option>
                    <el-option label="UDP" value="2">
                    </el-option>
                    <el-option label="ICMP" value="3">
                    </el-option>
                  </el-select>
                </el-form-item>
              </li>
              <li class="row_cloum">
                <el-form-item prop='cidr' :rules="[{ required: true, validator: checkIpAdress, trigger: 'blur' }]">
                  <el-input type="text" size='small' v-model.trim='item.cidr' placeholder="如10.0.0.0/16"></el-input>
                </el-form-item>
              </li>
              <li class="row_cloum">
                <el-form-item prop='start_port' :rules="[{ required: true, validator: checkPort, trigger: 'blur' }]">
                  <el-input type="text" :disabled="item.isDisabled" size='small' v-model.trim='item.start_port' placeholder="0-65535的整数"></el-input>
                </el-form-item>
              </li>
              <li class="row_cloum">
                <el-form-item prop='end_port' :rules="[{ required: true, validator: checkPort, trigger: 'blur' }]">
                  <el-input type="text" :disabled="item.isDisabled" size='small' v-model.trim='item.end_port' placeholder="0-65535的整数"></el-input>
                </el-form-item>
              </li>
              <li class="row_cloum">
                <el-form-item prop='description'>
                  <el-input type="text" size='small' v-model.trim='item.description'></el-input>
                </el-form-item>
              </li>
              <li class="row_cloum">
                <el-form-item required>
                  <el-button type="text" class="deleteRow" @click="deleteRow(index)">删除</el-button>
                </el-form-item>
              </li>
            </el-form>
          </ul>
        </el-form>
      </div>
      <div class="addOneRow">
        <el-button type="text" icon="el-icon-circle-plus-outline" @click="addRow">添加一行</el-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { addSecurityRules } from '@/api/admin/securityManage'
import { checkQuatoVal, checkIp } from '@/filters/index'
export default {
  props: ['ruleType', 'showId'],
  data() {
    return {
      submitLoading: false,
      isDisabled: false,
      netMask: [
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
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
      flag: true, // 判断添加规则表单是否验证OK
      ruleForm: [
        {
          protocol: '',
          cidr: '',
          start_port: '',
          end_port: '',
          description: '',
          isDisabled: false
        }
      ]
    }
  },
  watch: {
    showId(val) {
      console.log(val)
      this.submitLoading = false
    }
  },
  methods: {
    addSecurityRules,
    checkIp,
    checkQuatoVal,
    getChangeRes(val, index) {
      if (val == '0' || val == '3') {
        this.$refs['formContent'].$children[index].model.start_port = ''
        this.$refs['formContent'].$children[index].model.end_port = ''
        this.$refs['formContent'].$children[index].model.isDisabled = true
      } else {
        this.$refs['formContent'].$children[index].model.isDisabled = false
      }
    },
    checkIpAdress(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入CIDR'))
      } else {
        if (value.indexOf('/') >= 0) {
          let ip = value.split('/')[0]
          let netMask = parseInt(value.split('/')[1])
          console.log(ip)
          console.log(netMask)
          if (ip == '0.0.0.0') {
            callback()
          } else if (!this.checkIp(ip)) {
            callback(new Error('CIDR格式不正确(例：10.1.1.1/16)'))
          }
          if (netMask < 0 || netMask > 32) {
            callback(new Error('CIDR中掩码为0-32中的整数'))
          } else {
            callback()
          }
        } else {
          callback(new Error('CIDR格式不正确(例：10.1.1.1/16)'))
        }
      }
    },
    checkPort(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入端口号'))
      } else if (!this.checkQuatoVal(value) || (value < 0 || value > 65535)) {
        callback(new Error('端口号必须是0-65535的整数'))
      } else {
        let isAbove = true
        this.$refs['formContent'].$children.forEach((obj, index) => {
          if (parseInt(obj.model.end_port) < parseInt(obj.model.start_port)) {
            callback(new Error('开始端口必须小于结束端口'))
            isAbove = false
            return false
          }
        })
        if (isAbove) {
          callback()
        }
      }
    },
    addRow() {
      this.ruleForm = this.ruleForm.concat([
        {
          protocol: '',
          cidr: '',
          start_port: '',
          end_port: '',
          description: '',
          isDisabled: false
        }
      ])
    },
    submit() {
      this.checkForm()
      if (this.flag) {
        let bind_vm = {}
        if (this.$route.query.isTmp) {
          bind_vm = {}
        } else {
          let query_info = JSON.parse(this.$route.query.nic_info)
          query_info.forEach(item => {
            for (var i in item) {
              if (!bind_vm[i]) {
                bind_vm[i] = [item[i]]
              } else {
                bind_vm[i].push(item[i])
              }
            }
          })
        }

        let rule_lst = [].concat(this.ruleForm)
        rule_lst.forEach(item => {
          delete item.isDisabled
        })
        this.submitLoading = true
        this.addSecurityRules({
          owner_uuid: this.$route.params.uuid,
          bind_vm: JSON.stringify(bind_vm),
          type: this.$props.ruleType,
          rule_lst: JSON.stringify(rule_lst)
        }).then(res => {
          // this.submitLoading = false
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '添加规则成功'
            })
            this.cancel()
          }
        })
      }
    },
    cancel() {
      this.$refs['formContent'].$children.forEach((obj, index) => {
        obj.resetFields()
      })
      this.ruleForm = [
        {
          protocol: '',
          cidr: '',
          start_port: '',
          end_port: '',
          description: '',
          isDisabled: false
        }
      ]
      this.$emit('addRes')
    },
    checkForm() {
      this.$refs['formContent'].$children.forEach((obj, num) => {
        if (obj.model.protocol == '0' || obj.model.protocol == '3') {
          obj.validateField('cidr', val => {
            if (val == '') {
              this.flag = true
            } else {
              this.$message({
                type: 'error',
                message: '请完善信息'
              })
              this.flag = false
              return false
            }
          })
        } else {
          obj.validate(valid => {
            if (!valid) {
              // this.$message({
              //   type: 'error',
              //   message: '请完善信息'
              // })
              this.flag = false
              return false
            } else {
              this.flag = true
            }
          })
        }
      })
    },
    deleteRow(index) {
      this.ruleForm.splice(index, 1)
      this.checkForm()
    }
  },
  computed: {}
}
</script>
<style lang="less">
.addSafeGroupRule {
  .SafeGroupRuleInfo {
    .tableContent {
      width: 100%;
      padding: 0 2px;
      .rowConetnt {
        .row_cloum {
          display: inline-block;
          text-align: center;
          box-sizing: border-box;
        }
        .row_cloum:nth-child(1) {
          width: 10%;
          padding-right: 8px;
        }
        .row_cloum:nth-child(2) {
          width: 25%;
          padding-right: 8px;
        }
        .row_cloum:nth-child(3) {
          width: 15%;
          padding-right: 8px;
        }
        .row_cloum:nth-child(4) {
          width: 15%;
          padding-right: 8px;
        }
        .row_cloum:nth-child(5) {
          width: 20%;
          padding-right: 8px;
        }
        .row_cloum:nth-child(6) {
          width: 10%;
        }
      }
      .rowConetnt:nth-child(1) {
        padding-top: 15px;
      }
    }

    .addOneRow {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      .el-button {
        font-size: 16px;
      }
    }
  }
}
</style>
