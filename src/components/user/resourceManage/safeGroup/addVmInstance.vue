<template>
  <div class="addVmInstanceDialog dialogTemplate">
    <div class="tipsText">
      <el-row>
        <el-col :span="24">
          <span>请选择"安全组:{{securityName}}"要绑定的VM(虚拟机)</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <span>云主机&nbsp;&nbsp;</span>
          <el-select v-model="search.vmName" size="small" clearable filterable @change='getChange' placeholder="请选择">
            <el-option v-for="(item,index) in instanceList" :key="index" :label="item.instance_name" :value="item.instance_name">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="请输入IP" size="small" v-model.trim="search.safeGroupSearchText" @change="getIpSearch" prefix-icon="el-icon-search">
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="safeGroupList">
      <el-table :data="instanceList" @selection-change="handleSelectionChange" ref="multipleTable" style="width: 100%" height="242" stripe>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="instance_nic_name" label="网卡" min-width="80">
        </el-table-column>
        <el-table-column prop="instance_name" label="VM名称" min-width="100">
        </el-table-column>
        <el-table-column prop="ip_address" label="主IP地址" min-width="100">
        </el-table-column>
      </el-table>
    </div>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit" :disabled="!(selections.length>0)">确 定</el-button>
    </span>
  </div>
</template>
<script>
import { addNewIntance } from '@/api/admin/securityManage'
import { checkIp } from '@/filters/index'
export default {
  props: ['instanceList'],
  data() {
    return {
      securityName: '',
      safeGroupSearchText: '',
      search: {
        vmName: '',
        safeGroupSearchText: ''
      },
      selections: []
    }
  },
  mounted() {
    this.securityName = this.$route.query.name
  },
  methods: {
    checkIp,
    addNewIntance,
    handleSelectionChange(val) {
      this.selections = val
    },
    getIpSearch() {
      if (
        this.search.safeGroupSearchText != '' &&
        !this.checkIp(this.search.safeGroupSearchText)
      ) {
        this.$message({
          type: 'error',
          message: '输入IP格式不正确(例:10.0.0.1)'
        })
      } else {
        if (this.search.vmName == '') {
          this.$emit('searchInstance', {
            ip: this.search.safeGroupSearchText
          })
        } else {
          this.$emit('searchInstance', {
            instance_name: this.search.vmName,
            ip: this.search.safeGroupSearchText
          })
        }
      }
    },
    getChange() {
      this.search.safeGroupSearchText = ''
      this.$emit('searchInstance', { instance_name: this.search.vmName })
    },
    cancel() {
      this.search.vmName = ''
      this.search.safeGroupSearchText = ''
      this.$refs.multipleTable.clearSelection()
      this.$emit('addRes')
    },
    submit() {
      let bind_vm = {}
      this.selections.forEach(item => {
        if (!bind_vm[item.instance_uuid]) {
          bind_vm[item.instance_uuid] = [
            [item.instance_nic_uuid, item.instance_nic_name]
          ]
        } else {
          bind_vm[item.instance_uuid].push([
            item.instance_nic_uuid,
            item.instance_nic_name
          ])
        }
      })
      this.addNewIntance({
        securitygroup_uuid: this.$route.params.uuid,
        bind_vm: JSON.stringify(bind_vm)
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.cancel()
        }
      })
    }
  }
}
</script>
<style lang=less>
.addVmInstanceDialog {
  .tipsText {
    font-size: 16px;
    color: #606266;
    line-height: 40px;
    /* margin: 15px 0px; */
    padding: 5px 10px;
    vertical-align: middle;
    border-radius: 2px;
    position: relative;
  }
  .el-radio__label {
    display: none;
  }
  .el-select .el-input {
    width: 200px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>

