<template>
  <div class="hostPage">
    <div class="defaultScope">
      <div class="curPage">HOST</div>
    </div>
    <div class="btnList">
      <el-row>
        <el-col :xs="24">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="createShow">创建</el-button>
            <el-button type="success" :disabled='!multipleSelection.length>0' size="small" @click="bacthOperate({type:0,info:selectHosts})">开机</el-button>
            <el-button type="warning" :disabled='!multipleSelection.length>0' size="small" @click="bacthOperate({type:1,info:selectHosts})">关机</el-button>
            <el-button type="danger" :disabled='!multipleSelection.length>0' size="small" @click="bacthOperate({type:5,info:selectHosts})">删除</el-button>
            <el-button plain size="small" @click="agentUpgradeTrigger">angent升级</el-button>
            <el-button type="danger" size="small" @click="resetPwdTrigger">IPMI密码重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row style='margin-top:10px;'>
        <el-col :xs="24">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click='changeSearch'></i>
            </span>
            <span @click="editColum">
              <i class="el-icon-menu"></i>
            </span>
            <span @click="downloadHostTrigger">
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入内容" @keyup.enter='changeSearch' @change='changeSearch' :disabled="!search.isSearchStatu " size="small" v-model.trim="search.inputVal" class="input-with-select">
              <el-cascader @change='getchangeSearch' clearable v-model="search.searchKey" style='width:120px;background-color:#fff;' :options="search.selectList" size='small' :show-all-levels="false" slot="prepend"></el-cascader>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="hostList">
      <el-table :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange" :data="tableData" v-loading="hostStatu.loading" :key='key' style="width: 100%" stripe>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="host_uuid" :show-overflow-tooltip="true" label="UUID" min-width="120">
        </el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" min-width="100">
          <template slot-scope='scope'>
            <!--  <i class="el-icon-info" style='color:rgb(64, 158, 255);font-size: 16px;cursor: pointer;'></i> -->
            <span class="nameLink" @click='toDetails(scope.row)'>
              {{scope.row.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="_agentType" label="agent状态" :show-overflow-tooltip="true" min-width="100">
          <template slot-scope='scope'>
            <el-tooltip placement="top">
              <div slot="content">
                <!-- <p v-if="scope.row.agent_message.indexOf('。')>=0" class="toolTipText" v-for="(item,index) in scope.row.agent_message.split('。')" :key='index'>
                  {{item}}
                </p> -->
                <p class="toolTipText">
                  {{scope.row.agent_message}}
                </p>
              </div>
              <i class="el-icon-info" style='color:rgb(54, 207, 116);font-size: 16px;cursor: pointer;'></i>
            </el-tooltip>
            <span> {{scope.row._agentType}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="_status" label="状态" :show-overflow-tooltip="true" min-width="100">
        </el-table-column> -->
        <el-table-column :key='columName.id' :prop='columName.name' min-width="120" :show-overflow-tooltip="true" v-for='columName in formThead' :label="columName.name">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click='toConsole(scope.row)'>console</el-button>
            <el-dropdown trigger="click" @command="someOperate">
              <span class="el-dropdown-link">
                <!-- 更多 -->
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style='width:245px;'>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-dropdown-item :disabled="!(scope.row.status=='1')" :command="{type:0,info:scope.row}">开机</el-dropdown-item>
                    <el-dropdown-item :disabled="!(scope.row.status=='0')" :command="{type:3,info:scope.row}">重启</el-dropdown-item>
                    <el-dropdown-item :command="{type:4,info:scope.row}">强制重启</el-dropdown-item>
                    <el-dropdown-item :disabled="!(scope.row.maintain_status=='2')" :command="{type:7,info:scope.row}">删除</el-dropdown-item>
                    <el-dropdown-item :command="{type:11,info:scope.row}">修改信息</el-dropdown-item>
                    <el-dropdown-item :command="{type:12,info:scope.row}">监控</el-dropdown-item>
                  </el-col>
                  <el-col :span="12">
                    <el-dropdown-item :disabled="!(scope.row.status=='0')" :command="{type:1,info:scope.row}">关机</el-dropdown-item>
                    <el-dropdown-item :command="{type:2,info:scope.row}">强制关机</el-dropdown-item>
                    <el-dropdown-item :disabled="!(scope.row.maintain_status=='0')" :command="{type:5,info:scope.row}">锁定</el-dropdown-item>
                    <el-dropdown-item :disabled="!(scope.row.maintain_status=='1')" :command="{type:6,info:scope.row}">解除锁定</el-dropdown-item>
                    <el-dropdown-item :disabled="!(scope.row.maintain_status=='0')" :command="{type:8,info:scope.row}">维护</el-dropdown-item>
                    <el-dropdown-item :disabled="!(scope.row.maintain_status=='2')" :command="{type:9,info:scope.row}">解除维护</el-dropdown-item>
                    <el-dropdown-item :disabled="!(scope.row.status=='0'||scope.row.maintain_status=='3')" :command="{type:13,info:scope.row}">镜像同步</el-dropdown-item>
                  </el-col>
                </el-row>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="重置IPMI密码" @close='handleClose' class='dialogTemplate' :visible.sync="hostStatu.reset" width="500px" center>
      <div>
        <el-form label-width="100px" :model='pwdForm' :rules='pwdRules' ref='pwdForm'>
          <el-form-item label='密码' prop='pwd1'>
            <el-input type='password' v-model='pwdForm.pwd1' placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label='确认密码' prop='pwd2'>
            <el-input type='password' v-model='pwdForm.pwd2' placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' size='small' @click='resetSubmit'>确定</el-button>
            <el-button type='default' size='small' @click='cancel'>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog title="创建HOST" @close='handleClose("create")' class='dialogTemplate' :visible.sync="hostStatu.create" width="650px" center>
      <createDialog @createRes='createRes' :creatId='creatId'></createDialog>
    </el-dialog>
    <!-- 开机 关机 重启 删除 -->
    <el-dialog :title='title' @close='handleClose()' class='dialogTemplate' :visible.sync="hostStatu.operateSome" width="650px" center>
      <someOperateDialog :hostDeltails="hostDeltails" :title='title' @someOperateRes='someOperateRes' :id='dialogId'></someOperateDialog>
    </el-dialog>
    <!-- 开机 关机 删除 批量 -->
    <el-dialog :title='title' @close='handleClose()' class='dialogTemplate' :visible.sync="hostStatu.batchSome" width="650px" center>
      <batchOperate :rowInfos="multipleSelection" :title='title' @batchSomeRes='batchSomeRes' :id='dialogId'></batchOperate>
    </el-dialog>
    <!-- agent升级 -->
    <el-dialog title='agent升级' @close='handleClose()' class='dialogTemplate' :visible.sync="hostStatu.agentUpgrade" width="600px" center>
      <agengUp @agentUpgradeRes='agentUpgradeRes' :id='dialogId'></agengUp>
    </el-dialog>
    <!-- 修改信息 -->
    <el-dialog title='修改信息' @close='handleClose()' class='dialogTemplate' :visible.sync="hostStatu.edit" width="450px" center>
      <editDialog :hostDeltails="hostDeltails" @editRes='editRes' :id='dialogId'></editDialog>
    </el-dialog>

    <tableColumNameDialog :columArr='columArr' :checkArr='checkArr' @sendColum='setColum'></tableColumNameDialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import {
  resetPassWord,
  getHostList,
  getHostDel,
  getImageList,
  downLoadHost
} from '@/api/admin/hostManage'
import {
  formateHostStatu,
  formateMaintainStatu,
  formateAgentStatu
} from '@/filters/index'
import tableColumNameDialog from './../../common/tableColumName'
import someOperateDialog from './host/someOperate'
import batchOperate from './host/batchSomeOperate'
import imageSync from './host/imageSync'
import createDialog from './host/hostCreate'
import editDialog from './host/editName'
import agengUp from './host/agent'
import { checkIp, downloadFile } from '@/filters/index'

const defaultFormThead = [
  { name: 'IP地址', id: 'host_ip' },
  { name: '状态', id: '_status' },
  { name: '业务状态', id: '_maintain_status' },
  { name: '所属集群', id: 'hostcluster' },
  { name: '所属机房', id: 'datacenter' },
  { name: '管理IP', id: 'remote_manage_ip' },
  { name: 'VM数量', id: 'instance_nums' },
  { name: '保留内存', id: 'hold_mem_gb' },
  { name: 'CPU使用率', id: 'current_cpu_used' },
  { name: 'MEM使用率', id: 'current_mem_used' },
  { name: 'DISK使用率', id: 'current_disk_used' },
  { name: '内存分配率', id: 'mem_assign_per' }
]
export default {
  data() {
    var validatePwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.pwd1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      pwdForm: {
        pwd1: '',
        pwd2: ''
      },
      pwdRules: {
        pwd1: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        pwd2: [{ validator: validatePwd2, trigger: 'blur' }]
      },
      dialogId: '',
      creatId: 0,
      // name主机名，可模糊搜索", 	"sn": "序列号，可模糊搜索", 	"host_ip": "物理机ip，可模糊搜索", 	"remote_manage_ip": "物理机远程管理ip，可模糊搜索", 	"status": "物理机状态", 	"area_uuid": "所属区域uuid", 	"datacenter_uuid": "所属机房uuid", 	"hostcluster_uuid": "所属物理机集群uuid" }
      search: {
        selectList: [
          {
            label: '主机名',
            value: 'name'
          },
          {
            label: '序列号',
            value: 'sn'
          },
          {
            label: '物理机ip',
            value: 'host_ip'
          },
          {
            label: '管理IP',
            value: 'remote_manage_ip'
          },
          {
            label: '状态',
            value: 'status',
            children: [
              { label: '运行中', value: '0' },
              { label: '关机', value: '1' },
              { label: '开机中', value: '2' },
              { label: '关机中', value: '3' },
              { label: '未知状态', value: '99' }
            ]
          }
        ],
        isSearchStatu: false,
        status: '',
        searchKey: [],
        inputVal: ''
      },
      consoleUrl: '',
      key: 0,
      loadingText: '拼命加载中',
      imageList: [],
      multipleSelection: [], // 选中的表格数据
      rowInfos: [],
      title: '', // someOperate的弹框名称
      selectHosts: [],
      hostDeltails: [], // 物理机详情
      hostStatu: {
        reset: false, // 重置密码
        edit: false, // 编辑名称
        create: false, // 创建
        loading: false, // 表格加载loading
        operateSome: false, // 物理机开机-关机-强制关机-重启-强制重启
        batchSome: false, // 批量开机关机删除
        sync: false, //镜像同步
        agentUpgrade: false //agent升级
      },
      tableData: [],
      // 所有列名 供用户自定义
      columArr: [
        { name: 'IP地址', id: 'host_ip' },
        // { name: '状态', id: '_status' },
        { name: '业务状态', id: '_maintain_status' },
        { name: '所属集群', id: 'hostcluster' },
        { name: '所属机房', id: 'datacenter' },
        { name: '管理IP', id: 'remote_manage_ip' },
        { name: 'VM数量', id: 'instance_nums' },
        { name: '保留内存', id: 'hold_mem_gb' },
        { name: 'CPU使用率', id: 'current_cpu_used' },
        { name: 'MEM使用率', id: 'current_mem_used' },
        { name: 'DISK使用率', id: 'current_disk_used' },
        { name: '内存分配率', id: 'mem_assign_per' }
      ],
      // 默认选中的值
      checkArr: [
        'host_ip',
        // '_status',
        '_maintain_status',
        'hostcluster',
        'remote_manage_ip',
        'instance_nums'
      ],
      // 表格数据
      key: 1, // table key
      formTheadOptions: [
        { name: 'IP地址', id: 'host_ip' },
        // { name: '状态', id: '_status' },
        { name: '业务状态', id: '_maintain_status' },
        { name: '所属集群', id: 'hostcluster' },
        { name: '所属机房', id: 'datacenter' },
        { name: '管理IP', id: 'remote_manage_ip' },
        { name: 'VM数量', id: 'instance_nums' },
        { name: '保留内存', id: 'hold_mem_gb' },
        { name: 'CPU使用率', id: 'current_cpu_used' },
        { name: 'MEM使用率', id: 'current_mem_used' },
        { name: 'DISK使用率', id: 'current_disk_used' },
        { name: '内存分配率', id: 'mem_assign_per' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      isOperate: false,
      timeOut: null,
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      }
    }
  },
  mounted() {
    this.getDefaultList()
    setTimeout(this.refreshTable, 20000)
  },
  methods: {
    resetPassWord,
    downloadFile,
    downLoadHost,
    checkIp,
    getHostDel,
    formateHostStatu,
    formateMaintainStatu,
    formateAgentStatu,
    getHostList,
    getImageList,
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    cancel() {
      this.$refs.pwdForm.resetFields()
      this.hostStatu.reset = false
    },
    resetSubmit() {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          this.resetPassWord({
            name: 'HOST_IPMI_PASSWD',
            values: this.pwdForm.pwd1,
            type: '1'
          }).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.cancel()
          })
        }
      })
    },
    resetPwdTrigger() {
      this.isOperate = true
      this.hostStatu.reset = true
    },
    downloadHostTrigger() {
      this.downLoadHost().then(res => {
        this.downloadFile(res.data, '物理机信息')
      })
    },
    handleClose(obj) {
      this.isOperate = false
      this.refreshTable()
      if (obj) {
        this.creatId = this.creatId + 1
      } else {
        this.dialogId = ''
      }
    },
    refreshTable() {
      if (this.timeOut) {
        clearInterval(this.timeOut)
      }
      if (!this.isOperate) {
        this.changeSearch()
        this.timeOut = setTimeout(() => {
          this.refreshTable()
        }, 20000)
      }
    },
    changeSearch() {
      if (this.search.searchKey.length > 0) {
        let options = {}
        if (this.search.inputVal == '') {
          this.getDefaultList()
        } else {
          options[this.search.searchKey[0]] = this.search.inputVal
          this.getDefaultList(options)
        }
      } else {
        this.getDefaultList()
      }
    },
    getchangeSearch() {
      if (this.search.searchKey.length > 1) {
        this.search.isSearchStatu = false
        this.search.inputVal = ''
        this.getDefaultList({ status: this.search.searchKey[1] })
      } else if (this.search.searchKey.length == 1) {
        this.search.isSearchStatu = true
      } else {
        this.getDefaultList()
        this.search.inputVal = ''
        this.search.isSearchStatu = false
      }
    },
    // 待测
    toConsole(row) {
      let consoleAddress = window.location.protocol + window.location.hostname
      if (window.location.protocol == 'https') {
        consoleAddress += ':443'
      } else if (window.location.protocol == 'http') {
        consoleAddress += ':80'
      } else {
        consoleAddress += `:${window.location.port}`
      }

      let consoleUrl =
        consoleAddress +
        '/hostconsole?manage_ip=' +
        row.remote_manage_ip +
        '&sn=' +
        row.serial_number
      console.log(consoleUrl)
      window.open(consoleUrl)
    },
    editRes() {
      this.hostStatu.edit = false
    },
    agentUpgradeRes() {
      this.hostStatu.agentUpgrade = false
    },
    agentUpgradeTrigger() {
      this.isOperate = true
      this.hostStatu.agentUpgrade = true
    },
    getDetails(command, dialogStatu) {
      this.getHostDel({ host_uuid: command.info.host_uuid }).then(res => {
        if (res.data.code == 0) {
          this.hostDeltails = res.data.data
          this.hostStatu[dialogStatu] = true
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.isOperate = true
      } else {
        this.isOperate = false
      }
      this.refreshTable()
    },
    bacthOperate(command) {
      switch (command.type) {
        case 0:
          this.title = '开机'
          break
        case 1:
          this.title = '关机'
          break
        // case 2:
        //   this.title = '强制关机'
        //   break
        case 5:
          this.title = '删除'
          break
      }
      this.isOperate = true
      this.hostStatu.batchSome = true
    },
    batchSomeRes() {
      this.hostStatu.batchSome = false
    },
    someOperateRes() {
      this.hostStatu.operateSome = false
    },
    // 0 开机 1 关机 2 强制关机 3 重启 4 强制重启 5 删除 6 锁定 7 解除锁定 8 维护 9 解除维护 10 agent升级 11修改名称 12 监控 13 镜像同步
    someOperate(command) {
      switch (command.type) {
        case 0:
          this.title = '开机'
          this.getDetails(command, 'operateSome')
          break
        case 1:
          this.title = '关机'
          this.getDetails(command, 'operateSome')
          break
        case 2:
          this.title = '强制关机'
          this.getDetails(command, 'operateSome')
          break
        case 3:
          this.title = '重启'
          this.getDetails(command, 'operateSome')
          break
        case 4:
          this.title = '强制重启'
          this.getDetails(command, 'operateSome')
          break
        case 5:
          this.title = '锁定'
          this.getDetails(command, 'operateSome')
          break
        case 6:
          this.title = '解除锁定'
          this.getDetails(command, 'operateSome')
          break
        case 7:
          this.title = '删除'
          this.getDetails(command, 'operateSome')
          break
        case 8:
          this.title = '维护'
          this.getDetails(command, 'operateSome')
          break
        case 9:
          this.title = '解除维护'
          this.getDetails(command, 'operateSome')
          break
        // case 10:
        //   this.title = 'agent升级'
        //   this.getDetails(command, 'operateSome')
        //   break
        case 11:
          this.getDetails(command, 'edit')
          break
        case 12:
          this.title = '监控'
          break
        case 13:
          this.$router.push({
            path: `/sf_cloud/workbench/imageSync/${command.info.host_uuid}`,
            query: { name: command.info.name }
          })
          break
      }
      this.dialogId = command.info.host_uuid
      this.isOperate = true
    },
    imageSyncRes() {
      this.hostStatu.sync = false
    },
    createRes() {
      this.hostStatu.create = false
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
    },
    getDefaultList(search) {
      this.hostStatu.loading = true
      this.getHostList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || ''
      }).then(res => {
        this.hostStatu.loading = false
        if (res.data.code == 0) {
          res.data.data.rows.forEach(item => {
            item._status = this.formateHostStatu(item.status)
            item._maintain_status = this.formateMaintainStatu(
              item.maintain_status
            )
            item._agentType = this.formateAgentStatu(item.agent_status)
          })
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    // 设置用户自定的列显示
    editColum() {
      this.isOperate = true
      this.updateTableCloum(false)
      this.refreshTable()
    },
    setColum(columNew) {
      this.isOperate = false
      this.checkboxVal = columNew
      setTimeout(this.refreshTable, 20000)
    },
    // 筛选
    forSelect() {},
    // host创建
    createShow() {
      this.isOperate = true
      this.hostStatu.create = true
    },
    toDetails(row) {
      this.$router.push(
        `/sf_cloud/workbench/hostDetails/${row.host_uuid} ${row.name}`
      )
    }
  },
  destroyed() {
    this.isOperate = true
  },
  watch: {
    checkboxVal(valArr) {
      this.checkArr = valArr
      this.formThead = this.formTheadOptions.filter(
        i => valArr.indexOf(i.id) >= 0
      )
      this.key = this.key + 1 // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  components: {
    editDialog,
    agengUp,
    imageSync,
    createDialog,
    someOperateDialog,
    batchOperate,
    tableColumNameDialog
  }
}
</script>
<style lang="less">
.hostPage {
  position: relative;
  .btnList {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
    .batchBtn,
    .searchBtn,
    .columSel {
      display: inline-block;
    }
    .searchBtn {
      float: right;
      .el-input-group__prepend {
        padding: 0;
        border: 0;
      }
    }
    .columSel {
      float: right;
      span {
        display: inline-block;
        width: 32px;
        height: 30px;
        line-height: 30px;
        font-size: 22px;
        margin-left: 10px;
        box-sizing: border-box;
        text-align: center;
        border: 1px solid #ccc;
        color: #2277da;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  .defaultScope {
    .el-cascader {
      width: 400px !important;
    }
  }
  .hostList {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    .nameLink {
      cursor: pointer;
      color: #0778fd;
      font-weight: 500;
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #2277da;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .toolTipText {
    text-align: justify;
    line-height: 25px;
  }
}
</style>
