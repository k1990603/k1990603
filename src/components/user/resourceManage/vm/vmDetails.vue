<template>
  <div class="vmCreatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      虚拟机({{info.instance_name}})详情
    </div>
    <div class='detailsContent'>
      <el-card class="box-card">
        <div class="item-title">基本信息</div>
        <el-row :gutter="20">
          <el-col :span='14'>
            <div class="item">
              <span class='item-label'>名称</span>
              <span class='item-value'>{{info.instance_name}}</span>
              <el-button type="text" icon="el-icon-edit-outline" @click='editTrigger'></el-button>
            </div>
            <div class="item">
              <span class='item-label'>UUID</span>
              <span class='item-value'>{{info.uuid}}</span>
            </div>
            <div class="item">
              <span class='item-label'>所属集群</span>
              <span class='item-value'>{{info.hc_str }}</span>
            </div>
            <div class="item">
              <span class='item-label'>IP地址</span>
              <div class="tableBox">
                <el-table :data="info.ip_info" border width='100%'>
                  <el-table-column prop="ip_use_type" label="网卡类型">
                    <template slot-scope='scope'>
                      {{scope.row.ip_use_type == 0 ? "主网卡" : "从网卡"}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="ip" label="Ip" :show-overflow-tooltip='true'>
                  </el-table-column>
                  <el-table-column prop="network_segment_type" label="IP类型">
                    <template slot-scope="scope">
                      {{formateNetCardType(scope.row.network_segment_type)}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
          <el-col :span='10'>
            <div class="item">
              <span class='item-label'>主机类型</span>
              <span class='item-value'>{{info.used_type== '0'?'普通虚拟机':'haproxy+keepalive服务虚拟机'}}</span>
            </div>
            <div class="item">
              <span class='item-label'>操作系统类型</span>
              <span class='item-value'>{{info.system}}</span>
            </div>
            <div class="item">
              <span class='item-label'>操作系统版本</span>
              <span class='item-value'>{{info.sys_version}}</span>
              &nbsp;&nbsp;
              <i class="el-icon-edit sysEdit" v-if="info.sys_version=='unknown'" @click="editSysShow = true"></i>
            </div>
            <div class="item">
              <span class='item-label'>使用模板</span>
              <span class='item-value'>{{info.image_name}}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br>
      <el-card class="box-card">
        <div class="item-title">配置信息</div>
        <el-row :gutter="20">
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>CPU</span>
              <span class='item-value'>{{info.cpu }}核</span>
            </div>
            <div class="item">
              <span class='item-label'>内存</span>
              <span class='item-value'>{{info.memory_mb >=1024 ? info.memory_mb/1024 + 'G': info.memory_mb+'MB' }}</span>
            </div>
          </el-col>
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>系统盘容量</span>
              <span class='item-value'>{{info.system_disk }}G</span>
            </div>
            <div class="item">
              <span class='item-label'>数据盘容量</span>
              <span class='item-value'>{{info.data_disk }}G</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br>
      <el-card class="box-card">
        <div class="item-title">网络服务</div>
        <el-row :gutter="20">
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>所属安全组</span>
              <span class='item-value'>{{info.securitygroup_name_list?info.securitygroup_name_list.join(',') :'暂无'}}</span>
            </div>
            <div class="item">
              <span class='item-label'>所属网络</span>
              <span class='item-value'>{{info.net_str}}</span>
            </div>
            <div class="item">
              <span class='item-label'>负载均衡</span>
              <span class='item-value'>{{info.loadbalance_name_list?info.loadbalance_name_list.join(','):'暂无' }}</span>
            </div>
          </el-col>
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>公网IP</span>
              <span class='item-value'>{{info.internet_ip_exist == 0? '暂无':info.internet_ip}}</span>
            </div>
            <div class="item">
              <span class='item-label'>带宽</span>
              <span class='item-value'>{{info.internet_ip_exist == 0? '0':info.bandwidth_size}}Mbps</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br>
      <el-card class="box-card">
        <div class="item-title">管理信息</div>
        <el-row :gutter="20">
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>应用管理员</span>
              <span class='item-value'>{{info.owner}}</span>
            </div>
            <div class="item">
              <span class='item-label'>应用系统信息</span>
              <span class='item-value'>{{info.app_info}}</span>
            </div>
          </el-col>
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>所属项目</span>
              <span class='item-value'>{{info.project_name}}</span>
            </div>
            <div class="item">
              <span class='item-label'>所属租户</span>
              <span class='item-value'>{{info.tenant_name}}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <el-dialog title="修改虚拟机名称" class="dialogTemplate" :visible.sync="editName" width="450px" center>
      <el-form :model="nameForm" :rules="nameRules" ref="nameForm" label-width="100px">
        <el-form-item label="系统版本" prop="instance_name">
          <el-input v-model="nameForm.instance_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelName">取 消</el-button>
        <el-button type="primary" @click="submitName">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 暂时未对接接口 后台没有接口 -->
    <el-dialog title="编辑系统版本" class="dialogTemplate" :visible.sync="editSysShow" width="450px" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="系统版本" prop="sys_os">
          <el-input v-model="ruleForm.sys_os"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSysShow = false">取 消</el-button>
        <el-button type="primary" @click="editSysShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { checkUserName, formateNetCardType } from '@/filters/index'
import { getVmDetails, changeInstanceName } from '@/api/admin/vm'
export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入主机名'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('字母开头大小写字母+数字6-20位!'))
      } else {
        callback()
      }
    }
    return {
      nameRules: {
        instance_name: [{ validator: checkUserName, trigger: 'blur' }]
      },
      nameForm: {
        instance_name: ''
      },
      editName: false,
      ruleForm: { sys_os: '' },
      rules: {
        sys_os: [
          {
            required: true,
            message: '请输入系统版本(例：6.6,7.2,2012...)',
            trigger: 'blur'
          }
        ]
      },
      editSysShow: false,
      info: {}
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    formateNetCardType,
    changeInstanceName,
    checkUserName,
    getVmDetails,
    editTrigger(){
      this.editName = true
      this.nameForm.instance_name = this.info.instance_name
    },
    submitName() {
      this.$refs['nameForm'].validate(valid => {
        if (valid) {
          this.changeInstanceName({
            instance_uuid: this.info.uuid,
            new_instance_name: this.nameForm.instance_name
          }).then(res => {
            if (res.data.code == 0) {
              this.cancelName()
              this.$message.success('修改成功')
              this.getDetails()
            }
          })
        }
      })
    },
    cancelName() {
      this.$refs['nameForm'].resetFields()
      this.editName = false
    },
    getDetails() {
      this.getVmDetails({
        instance_uuid: this.$route.params.uuid,
        user_role: '1'
      }).then(res => {
        if (res.data.code == 0) {
          this.info = res.data.data
          let hc_str = [],
            net_str = []
          this.info.host_cluster_data_list.forEach((item, index) => {
            hc_str.push(item.name)
          })
          this.info.ip_info.forEach((item, index) => {
            net_str.push(
              item.network_segment_name + '  ' + item.subnetwork_segment_name
            )
          })
          this.info.hc_str = hc_str.join('/')
          this.info.net_str = net_str.join(',')
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less">
.vmCreatePage {
  min-height: 500px;
  background: #fff;
  padding-bottom: 30px;
  & > .title {
    padding-left: 15px;
    height: 50px;
    line-height: 50px;
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
  .detailsContent {
    margin: 20px;
    font-size: 15px;
    .box-card {
      .item-title {
        width: 90px;
        line-height: 36px;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #ccc;
        margin-bottom: 10px;
        text-align: center;
      }
      .item {
        padding: 10px 0;
        padding-left: 30px;
        .sysEdit {
          color: #128dff;
          font-size: 16px;
          cursor: pointer;
        }
        .item-label {
          display: inline-block;
          width: 100px;
          text-align: left;
        }
        .item-value {
          vertical-align: middle;
          margin-left: 10px;
          color: #999;
        }
        .tableBox {
          padding-top: 15px;
        }
      }
    }
  }
}
</style>

