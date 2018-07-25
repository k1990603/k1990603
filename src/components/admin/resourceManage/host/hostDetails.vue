<template>
  <div class="vmCreatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      host({{this.params[1]}})详情
    </div>
    <div class='detailsContent'>
      <el-card class="box-card">
        <div class="item-title">基本信息</div>
        <el-row :gutter="20">
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>主机名</span>
              <span class='item-value'>{{info.name}}</span>
            </div>
            <div class="item">
              <span class='item-label'>主网ip</span>
              <span class='item-value'>{{info.host_ip }}</span>
            </div>
            <div class="item">
              <span class='item-label'>管理IP</span>
              <span class='item-value'>{{info.remote_manage_ip}}</span>
            </div>
            <div class="item">
              <span class='item-label'>保留内存</span>
              <span class='item-value'>{{info.hold_mem_gb}}G</span>
            </div>
            <div class="item">
              <span class='item-label'>开机时间</span>
              <span class='item-value'>{{info.start_time}}</span>
            </div>

            <!-- <div class="item">
              <span class='item-label'>所属子区域</span>
              <span class='item-value'>{{info.subarea}}</span>
            </div> -->
            <div class="item">
              <span class='item-label'>物理机状态</span>
              <span class='item-value'>{{info._status }}</span>
              <!-- <div class="tableBox">
                <el-table :data="info.ip_info" border width='100%'>
                  <el-table-column prop="ip_use_type" label="网卡类型">
                    <template slot-scope='scope'>
                      {{scope.row.ip_use_type == 0 ? "主网卡" : "从网卡"}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="network_segment_name" label="专有网络">
                  </el-table-column>
                  <el-table-column prop="ip" label="ip" :show-overflow-tooltip='true'>
                  </el-table-column>
                </el-table>
              </div> -->
            </div>
            <div class="item">
              <span class='item-label'>业务状态</span>
              <span class='item-value'>{{info._maintain_status}}</span>
            </div>
            <div class="item">
              <span class='item-label'>Libvirt服务端口</span>
              <span class='item-value'>{{info.libvirt_port}}</span>
            </div>
            <div class="item">
              <span class='item-label'>Libvirt服务状态</span>
              <span class='item-value'>{{info.libvirt_status == "0"?"正常":"异常"}}</span>
            </div>

          </el-col>
          <el-col :span='12'>
            <!-- <div class="item">
              <span class='item-label'>VM数量</span>
              <span class='item-value'>{{info.image_name}}</span>
            </div> -->
            <!-- <div class="item">
              <span class='item-label'>卷存储路径</span>
              <span class='item-value'>{{info.image_name}}</span>
            </div> -->

            <div class="item">
              <span class='item-label'>所在区域</span>
              <span class='item-value'>{{info.area }}</span>
            </div>
            <div class="item">
              <span class='item-label'>所在机房</span>
              <span class='item-value'>{{info.datacenter}}</span>
            </div>
            <div class="item">
              <span class='item-label'>所属集群</span>
              <span class='item-value'>{{info.hostcluster}}</span>
              <!-- &nbsp;&nbsp; -->
              <!-- <i class="el-icon-edit sysEdit" v-if="info.sys_version=='unknown'" @click="editSysShow = true"></i> -->
            </div>
            <div class="item">
              <span class='item-label'>序列号（主键）</span>
              <span class='item-value'>{{info.serial_number}}</span>
            </div>
            <div class="item">
              <span class='item-label'>操作系统版本</span>
              <span class='item-value'>{{info.ostype}}</span>
            </div>
            <div class="item">
              <span class='item-label'>镜像</span>
              <span class='item-value left'>{{info._images}}</span>
            </div>
            <div class="item">
              <span class='item-label'>物理机上虚拟机总数</span>
              <span class='item-value'>{{info.instance_nums}}台</span>
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
              <span class='item-value'>{{info.cpu_core }}核</span>
            </div>

            <div class="item">
              <span class='item-label'>内存</span>
              <span class='item-value'>{{info.mem_size }}G</span>
            </div>
            <div class="item">
              <span class='item-label'>CPU使用率</span>
              <span class='item-value'>{{info.current_cpu_used }}%</span>
            </div>
            <div class="item">
              <span class='item-label'>内存使用率</span>
              <span class='item-value'>{{info.current_mem_used }}%</span>
            </div>

            <div class="item">
              <span class='item-label'>内存分配率</span>
              <span class='item-value'>{{info.mem_assign_per}}%</span>
            </div>
          </el-col>
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>磁盘容量</span>
              <span class='item-value'>{{info.disk_size }}G</span>
            </div>
            <div class="item">
              <span class='item-label'>磁盘使用率</span>
              <span class='item-value'>{{info.current_disk_used }}%</span>
            </div>
            <div class="item">
              <span class='item-label'>网卡下行速度</span>
              <span class='item-value'>{{info.current_net_rx_used }}Mb/s</span>
            </div>
            <div class="item">
              <span class='item-label'>网卡上行速度</span>
              <span class='item-value'>{{info.current_net_tx_used }}Mb/s</span>
            </div>
            <!-- <div class="item">
              <span class='item-label'>内存使用率</span>
              <span class='item-value'>{{info.current_mem_used }}%</span>
            </div> -->
          </el-col>
        </el-row>
      </el-card>
      <br>
      <el-card class="box-card">
        <div class="item-title">agent信息</div>
        <el-row :gutter="20">
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>agent状态</span>
              <span class='item-value'>{{info._agentType }}</span>
            </div>

            <div class="item">
              <span class='item-label'>agent版本状态</span>
              <span class='item-value'>{{info.agent_version_status == "0" ? '最新': '未更新' }}</span>
            </div>
            <div class="item">
              <span class='item-label'>agent详细信息</span>
              <span class='item-value'>{{info.agent_message }}</span>
            </div>
          </el-col>
          <el-col :span='12'>
            <div class="item">
              <span class='item-label'>虚拟机状态采集时间</span>
              <span class='item-value'>{{info.instances_status_collect_time }}</span>
            </div>
            <div class="item">
              <span class='item-label'>物理机性能数据采集时间</span>
              <span class='item-value'>{{info.host_performance_collect_time }}</span>
            </div>

          </el-col>
        </el-row>
      </el-card>
      <!-- <el-card class="box-card">
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
      </el-card> -->
      <br>
      <!-- <el-card class="box-card">
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
      </el-card> -->
    </div>
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
import { getHostDel } from '@/api/admin/hostManage'
import {
  formateAgentStatu,
  formateHostStatu,
  formateMaintainStatu
} from '@/filters/index'
export default {
  data() {
    return {
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
      info: {},
      params: []
    }
  },
  mounted() {
    // console.log(this.$route.params)
    this.params = this.$route.params.uuid.split(' ')
    this.getDetails()
    // console.log(this.$route.params.uuid.split(" ")[0])
  },
  methods: {
    getHostDel,
    formateAgentStatu,
    formateHostStatu,
    formateMaintainStatu,
    getDetails() {
      this.getHostDel({
        host_uuid: this.params[0]
        // user_role: '1'
      }).then(res => {
        if (res.data.code == 0) {
          this.info = res.data.data
          // console.log(this.info.agent_status)
          this.info._agentType = this.formateAgentStatu(this.info.agent_status)
          this.info._status = this.formateHostStatu(this.info.status)
          this.info._maintain_status = this.formateMaintainStatu(
            this.info.maintain_status
          )
          // console.log(this.info.images.replace(/ /g,"\n"))
          // console.log("centos6.8 centos6.8_disk2 vm8 vrouter_img vyos_02 vyos_04 vyos_06 vyos.img".replace(/ /g,"\n"))
          this.info._images = this.info.images.replace(/ /g, ', ')
          // })
          // let hc_str = [],
          //   net_str = []
          // this.info.host_cluster_data_list.forEach((item, index) => {
          //   hc_str.push(item.name)
          // })
          // this.info.ip_info.forEach((item, index) => {
          //   net_str.push(
          //     item.network_segment_name + '  ' + item.subnetwork_segment_name
          //   )
          // })
          // this.info.hc_str = hc_str.join('/')
          // this.info.net_str = net_str.join(',')
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
        // vertical-align: top;
        padding: 10px 0;
        padding-left: 30px;
        .sysEdit {
          color: #128dff;
          font-size: 16px;
          cursor: pointer;
        }
        .item-label {
          display: inline-block;
          // vertical-align: top;
          width: 135px;
          text-align: left;
        }
        .item-value {
          display: inline-block;
          vertical-align: top;
          // margin-left: 10px;
          color: #999;
          width: 300px;
        }
        // .center {
        //   // text-align: center;
        //   // width: 50px;
        // }
        .tableBox {
          padding-left: 100px;
        }
      }
    }
  }
}
</style>

