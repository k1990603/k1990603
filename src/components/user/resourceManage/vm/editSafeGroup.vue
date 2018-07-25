<template>
  <div class="editSafeGroupDialog dialogTemplate">
    <el-table :data="netCardList.instance_ip_info_list" border>
      <el-table-column prop="ip_address" label="网卡IP" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="nic_type" label="网络类型" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{scope.row.nic_type == '0' ? '内网':'外网'}}
        </template>
      </el-table-column>
      <el-table-column prop="nic_use_type" label="网卡类型" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{scope.row.nic_use_type == '0' ? '主网卡':'副网卡'}}
        </template>
      </el-table-column>
      <el-table-column prop="securitygroup_name" label="安全组" :show-overflow-tooltip='true' width="200px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.securitygroup_uuid" placeholder="请选择">
            <el-option-group v-for="(tmp,index) in netCardList.securitygroup_list" :key="tmp.name" :label="tmp.name">
              <el-option v-for="item in tmp.data" :key="item.sec_group_uuid" :label="item.sec_group_name" :value="item.sec_group_uuid">
              </el-option>
            </el-option-group>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
import { changeSecurity } from '@/api/admin/vm'
export default {
  props: ['netCardList'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    changeSecurity,
    submit() {
      let options = []
      this.netCardList.instance_ip_info_list.forEach(item => {
        options.push({
          instance_uuid: item.instance_uuid,
          instance_nic_uuid: item.nic_uuid,
          securitygroup_uuid: item.securitygroup_uuid
        })
      })
      this.changeSecurity({
        nic_securitygroup_info_list: JSON.stringify(options)
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '配置安全组成功'
          })
          this.cancel()
        }
      })
    },
    cancel() {
      this.$emit('editSecurityRes')
    }
  }
}
</script>
<style lang=less>
/* .editSafeGroupDialog {
  .tipsText {
    font-size: 12px;
    line-height: 22px;
    margin: 15px 0px;
    padding: 5px 10px;
    vertical-align: middle;
    color: #264663;
    border: 1px solid #7ab1de;
    border-radius: 2px;
    background: #d2e7f7;
    position: relative;
  }
} */
</style>

