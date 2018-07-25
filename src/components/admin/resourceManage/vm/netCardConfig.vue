<template>
  <div class="netCardPage" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
    <div>
      <div class="oldInfo">
        <div class="itemInfo">
          <label>名称</label>
          <span>{{rowInfo.displayname}}</span>
        </div>
        <div class="itemInfo">
          <label>IP地址</label>
          <span>{{rowInfo.ip_address}}</span>
        </div>
        <div class="itemInfo">
          <label>所属项目</label>
          <span>{{rowInfo.project_name}}</span>
        </div>
        <!-- <div class="itemInfo">
          <label>所属租户</label>
          <span>{{rowInfo.value}}</span>
        </div> -->
      </div>
      <el-table :data="netCardInfo.nic_data">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="nic_type" :show-overflow-tooltip='true' label="IP类型" min-width="50">
          <template slot-scope='scope'>
            {{formateNetCardType(scope.row.network_type)}}
          </template>
        </el-table-column>
        <el-table-column prop="ip_addr" label="IP地址">
          <template slot-scope='scope'>
            {{scope.row.ip_addr}}&nbsp;&nbsp;
            <i class="el-icon-edit editIp" @click="changeIpAddr(scope.row)"></i>
            <!-- 网卡编辑 -->
            <el-dialog class="dialogTemplate" title="网卡IP编辑" :visible.sync='ipEditShow' width="650px" center append-to-body>
              <div class="oldInfo">
                <div class="itemInfo">
                  <label>原IP</label>
                  <span>{{netCardDetail.defaultIp}}</span>
                </div>
                <div class="itemInfo">
                  <label>网卡类型</label>
                  <span>{{netCardDetail.netCardType}}</span>
                </div>
              </div>
              <div class="newInfo">
                <el-form :model='newIpInfo' ref='newIpInfoForm' label-width="120px" label-position='left'>
                  <el-form-item label='网卡IP类型'>
                    <el-select v-model="newIpInfo.newIpType" :disabled="netCardDetail.nic_use_type=='0'" @change='handleChangeIpType' placeholder="请选择网卡IP类型">
                      <el-option v-for='item in netCardDefaultType' :disabled="item.isdisabled" :label="item.label" :value="item.value" :key='item.value'>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label='网卡IP' prop='newIpAdd' :rules="{required: true, message: ' 请选择网卡IP ', trigger: 'change ' }">
                    <el-select v-model="newIpInfo.newIpAdd" placeholder="请选择IP">
                      <el-option v-for='(item,index) in ipList' :label="item.ip_address" :value="item.ip_address" :key='index'>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveChange(scope.$index)">确 定</el-button>
                <el-button @click="cancelChange">取 消</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip='true' prop="mac_addr" label="MAC地址">
        </el-table-column>
        <el-table-column prop="connectType" label="连接状态" min-width="100px">
          <template slot-scope='scope'>
            <div v-if="scope.row.nic_status=='0'||scope.row.nic_status=='1'">
              <el-radio-group v-model="scope.row.nic_status" @change='handleChangeStatus(scope.$index)'>
                <el-radio label="1">连接</el-radio>
                <el-radio label="0">断开</el-radio>
              </el-radio-group>
            </div>
            <div v-else>
              其他
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="addNetCard">
        <el-button type="primary" plain @click="addNetCardTrigger">添加网卡</el-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureChange()">确 定</el-button>
      <el-button @click="$emit('diskScaleClick')">取 消</el-button>
    </span>
    <!-- 添加网卡 -->
    <el-dialog class="dialogTemplate" title="添加网卡" :visible.sync='addNetCardShow' width="650px" center append-to-body>
      <el-form :model='newCardInfo' ref='newCardForm' label-width="120px" label-position='left'>
        <el-form-item label='网卡IP类型' prop='type' :rules="{required: true, message: ' 请选择网卡IP ', trigger: 'change ' }">
          <el-select v-model="newCardInfo.type" placeholder="请选择网卡IP类型">
            <el-option v-for='item in netCardDefaultType' :label="item.label" :value="item.value" :disabled="item.isdisabled" :key='item.value'>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="tipText">
        确定执行
        <span>添加网卡</span>
        操作？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNewNetCard()">确 定</el-button>
        <el-button @click="addNetCardShow=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  netCardInitInfo,
  changeNetCardInitInfo,
  addNetCard
} from '@/api/admin/vm'
import { formateNetCardType, formateNetCardKey } from '@/filters/index'
export default {
  props: ['netCartId', 'rowInfo'],
  data() {
    return {
      loading: false,
      // 增加网卡信息
      newCardInfo: {
        type: '0'
      },
      // 修改网卡IP信息
      newIpInfo: {
        newIpAdd: '',
        newIpType: '',
        vlan: ''
      },
      ipRowInfo: {},
      ipList: [], // 修改网卡IP的IP数据
      netCardInfo: {}, // 当前探矿数据
      newInf: [], // 存在变动的记录
      allData: [], // 备份当前所有数据

      ipEditShow: false,
      addNetCardShow: false,
      netCardDetail: {},
      defaultTypeCode: [],
      netCardDefaultType: [
        { label: '公有基础网络', value: '0', isdisabled: false },
        { label: '私有网络', value: '1', isdisabled: false },
        { label: '管理员专用网络', value: '2', isdisabled: false },
        { label: '公有NAS网络', value: '3', isdisabled: false },
        { label: '模板机网络', value: '4', isdisabled: false },
        { label: '虚拟路由网络', value: '5', isdisabled: false }
      ]
    }
  },
  mounted() {
    this.getList(this.netCartId)
  },
  watch: {
    netCartId: function(val) {
      if (val != '') {
        this.getList(val)
      }
    }
  },
  methods: {
    formateNetCardKey,
    formateNetCardType,
    addNetCard,
    netCardInitInfo,
    changeNetCardInitInfo,
    // 获取当前记录列表
    getList(uuid) {
      this.newInf = []
      this.netCardInitInfo({
        instance_uuid: uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.netCardInfo = res.data.data
          this.allData = JSON.parse(JSON.stringify(res.data.data.nic_data))
          this.allData.forEach(item => {
            this.defaultTypeCode.push(item.network_type)
          })
        }
      })
    },
    handleChangeStatus(val) {
      if (this.newInf.indexOf(val) == -1) {
        this.newInf.push(val)
      }
    },
    setDisabled(val) {
      this.netCardDefaultType.forEach(item => {
        if (item.value == val) {
          item.isdisabled = false
        } else if (this.defaultTypeCode.indexOf(item.value) >= 0) {
          item.isdisabled = true
        }
      })
    },
    // 保存修改记录项
    saveChange(val) {
      this.$refs.newIpInfoForm.validate(valid => {
        if (valid) {
          if (this.newInf.indexOf(val) == -1) {
            this.newInf.push(val)
          }
          this.netCardInfo.nic_data[val].ip_addr = this.newIpInfo.newIpAdd
          this.netCardInfo.nic_data[val].nic_type = this.newIpInfo.newIpType
          this.netCardInfo.nic_data[val].vlan = this.newIpInfo.vlan
          this.ipEditShow = false
        }
      })
    },
    cancelChange() {
      this.newIpInfo.newIpAdd = ''
      this.newIpInfo.newIpType = ''
      this.ipList = []
      this.ipEditShow = false
    },
    // 确认修改网卡配置
    sureChange() {
      let changeList = []
      this.loading = true
      this.newInf.forEach(item => {
        // this.netCardInfo 变动所有数据
        // this.allData 备份表格数据
        // .nic_data.nic_status断开连接状态
        // .nic_data.ip_addr IP地址
        let data = {
          nic_uuid: this.allData[item].nic_uuid,
          mac_addr: this.allData[item].mac_addr,
          ip_type: this.allData[item].ip_type,
          vlan: this.allData[item].ip_vlan ? this.allData[item].ip_vlan : '',
          ip_addr: this.allData[item].ip_addr,
          network_type: this.netCardInfo.nic_data[item].network_type,
          nic_use_type: this.allData[item].nic_use_type
        }
        // 如果是旧网卡则判断是否有改变IP从而获取IPvaln
        if (
          this.allData[item].ip_addr != this.netCardInfo.nic_data[item].ip_addr
        ) {
          data.vlan_new = this.netCardInfo.nic_data[item].ip_vlan
        } else {
          data.vlan_new = this.allData[item].ip_vlan
        }
        // 判断网卡是否有操作连接断开
        if (this.allData[item].nic_status) {
          data.nic_status = this.netCardInfo.nic_data[item].nic_status
        } else {
          // 新增网卡默认连接
          data.nic_status = '1'
        }
        //如果是新增的网卡 则旧IP传空
        if (
          this.allData[item].ip_addr &&
          !this.allData[item].isNew &&
          this.allData[item].ip_addr != this.netCardInfo.nic_data[item].ip_addr
        ) {
          data.ip_addr_new = this.netCardInfo.nic_data[item].ip_addr
        } else if (this.allData[item].isNew) {
          data.ip_addr_new = this.allData[item].ip_addr
          data.ip_addr = ''
        } else {
          data.ip_addr_new = ''
        }
        changeList.push(data)
      })
      let putData = {
        instance_uuid: this.rowInfo.instance_uuid,
        net_status_list: JSON.stringify(changeList)
      }
      this.changeNetCardInitInfo(putData).then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.$message.success('网卡配置成功')
          this.$emit('diskScaleClick')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 修改ip地址按钮
    changeIpAddr(row) {
      this.netCardDetail.defaultIp = row.ip_addr
      this.netCardDetail.netCardType = this.formateNetCardType(row.network_type)
      this.netCardDetail.nic_use_type = row.nic_use_type
      this.ipRowInfo = row
      this.newIpInfo.newIpType = row.network_type
      this.getIpList(row)
      this.ipEditShow = true
    },
    getIpList(row) {
      // 获取所选IP类型的IP列表
      this.newIpInfo.newIpAdd = ''
      this.ipList = []
      this.ipList = [].concat(
        this.netCardInfo.ip_data[0].ip_list[
          this.formateNetCardKey(this.newIpInfo.newIpType)
        ]
      )
      if (this.ipList.length <= 0) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '所选类型无可用IP'
        })
        return false
      }
      if (this.newIpInfo.newIpType == row.network_type) {
        this.ipList.push({ ip_address: row.ip_addr })
        this.newIpInfo.newIpAdd = row.ip_addr
      } else {
        this.newIpInfo.vlan = this.ipList[0].vlan
      }
      // 判断哪一个类型不可选
      this.setDisabled(row.network_type)
    },
    handleChangeIpType() {
      this.getIpList(this.ipRowInfo)
    },
    // 添加网卡 addNetCardShow
    addNetCardTrigger() {
      this.newCardInfo.type = ''
      this.netCardDefaultType.forEach(item => {
        if (this.defaultTypeCode.indexOf(item.value) >= 0) {
          item.isdisabled = true
        } else {
          item.isdisabled = false
        }
      })
      this.addNetCardShow = true
    },
    addNewNetCard() {
      this.$refs.newCardForm.validate(valid => {
        if (valid) {
          let list = this.netCardInfo.ip_data[0].ip_list[
            this.formateNetCardKey(this.newCardInfo.type)
          ]
          if (list.length > 0) {
            let data = {
              instance_uuid: this.netCartId,
              network_type: this.newCardInfo.type
            }
            addNetCard(data).then(res => {
              if (res.data.code == 0) {
                this.$message({
                  message: '添加网卡成功！',
                  type: 'success'
                })
                let obj = res.data.data
                obj.ip_addr = list[0].ip_address
                this.netCardInfo.nic_data.push(JSON.parse(JSON.stringify(obj)))
                obj.ip_vlan = list[0].vlan
                obj.isNew = true
                this.allData.push(obj)
                this.newInf.push(this.netCardInfo.nic_data.length - 1)
                this.addNetCardShow = false
              } else {
                this.$message.error(res.data.msg)
              }
            })
          } else {
            this.$message.error('该网卡IP类型无IP资源')
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.oldInfo {
  .itemInfo {
    font-size: 16px;
    padding-left: 15px;
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
.tipText {
  margin-top: 15px;
  font-size: 18px;
  span {
    font-size: 20px;
    color: #f00;
  }
}
.netCardPage {
  .editIp {
    cursor: pointer;
    font-size: 16px;
    color: #66b1ff;
  }
  .addNetCard {
    font-size: 16px;
    padding-top: 15px;
    padding-bottom: 15px;
  }
}
.newInfo {
  font-size: 16px;
  padding-left: 15px;
  padding-bottom: 15px;
}
.dialog-footer {
  display: inline-block;
  text-align: center;
  width: 100%;
}
</style>

