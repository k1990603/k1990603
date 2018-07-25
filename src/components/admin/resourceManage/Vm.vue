<template>
  <div class="vmPage">
    <div class="defaultScope">
      <div class="curPage">VM</div>
      <selectComponent @getSelect="getSelect"></selectComponent>
    </div>
    <div class="btnList">
      <el-row>
        <el-col :xs="24">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="createShow">创建</el-button>
            <el-button type="success" :disabled="multipleSelection.length<=0 || (filterType==2||filterType==3)" size="small" @click="someOperate({type:'startUp',info:multipleSelection})">开机</el-button>
            <el-button type="warning" :disabled="multipleSelection.length<=0|| (filterType==2||filterType==3)" size="small" @click="someOperate({type:'shutDown',info:multipleSelection})">关机</el-button>
            <el-button type="warning" :disabled="multipleSelection.length<=0|| (filterType==2||filterType==3)" size="small" @click="someOperate({type:'powerOff',info:multipleSelection})">强制关机</el-button>
            <el-button type="primary" :disabled="multipleSelection.length<=0|| (filterType==2||filterType==3)" size="small" @click="someOperate({type:'reBoot',info:multipleSelection})">重启</el-button>
            <el-button type="danger" :disabled="multipleSelection.length<=0|| (filterType==2||filterType==3)" size="small" @click="someOperate({type:'powerReBoot',info:multipleSelection})">强制重启</el-button>
            <el-button type="warning" :disabled="multipleSelection.length<=0|| filterType!=0" size="small" @click="someOperate({type:'delete',info:multipleSelection})">删除</el-button>

            <el-button type="info" :disabled="multipleSelection.length<=0|| (filterType==2||filterType==3)" size="small" @click="someOperate({type:'reTry',info:multipleSelection})">重试</el-button>
            <!-- <el-button type="primary" :disabled="multipleSelection.length<=0" size="small" @click="assignProject">分配至项目</el-button> -->
          </div>
        </el-col>
      </el-row>
      <el-row style='margin-top:10px;'>
        <el-col :xs="24">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="changeSearch"></i>
            </span>
            <span @click="editColum">
              <i class="el-icon-menu"></i>
            </span>
            <span @click='downloadVmList'>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入内容" @keyup.enter='changeSearch' @change='changeSearch' :disabled="!search.isSearchStatu" size="small" v-model.trim="search.inputVal" class="input-with-select">
              <el-cascader @change='getchangeSearch' clearable v-model="search.searchKey" style='width:120px;background-color:#fff;' :options="search.selectList" size='small' :show-all-levels="false" slot="prepend"></el-cascader>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="vmList">
      <el-table :data="tableData" :key='key' style="width: 100%" element-loading-spinner="el-icon-loading" element-loading-text="请耐心等待,加载中..." v-loading='listLoading' stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="instance_uuid" :show-overflow-tooltip='true' label="UUID" min-width="150">
        </el-table-column>
        <el-table-column prop="displayname" :show-overflow-tooltip='true' label="名称" min-width="120">
          <template slot-scope="scope">
            <span v-if='scope.row.used_type==2||scope.row.used_type==3'>{{ scope.row.displayname }}</span>
            <span class='nameLink' v-else @click='toDetails(scope.row)'>{{ scope.row.displayname }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="used_type" :show-overflow-tooltip='true' label="类型" width="120">
          <template slot-scope="scope">
            <span>{{ formateVmType(scope.row.used_type) }}</span>
          </template>
        </el-table-column>
        <el-table-column :key='columName.id' :show-overflow-tooltip='true' v-for='columName in formThead' :label="columName.name" min-width="120">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click='toConsole(scope.row)' :disabled="!(scope.row.status == '2'||scope.row.status == '3'||scope.row.status == '4'||scope.row.status == '7'||scope.row.status == '104')">console</el-button>
            <el-dropdown trigger="click" @command="someOperate" v-if="scope.row.used_type!=2&&scope.row.used_type!=3">
              <span class="el-dropdown-link">
                <!-- 更多 -->
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style='width:245px;'>
                <el-row>
                  <el-col :span="12">
                    <el-dropdown-item :disabled="scope.row.status != 1" :command="{type:'startUp',info:[scope.row]}">开机</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 3 && scope.row.status != 2" :command="{type:'shutDown',info:[scope.row]}">关机</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 3&&scope.row.status != 2" :command="{type:'powerOff',info:[scope.row]}">强制关机</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 3" :command="{type:'reBoot',info:[scope.row]}">重启</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 3" :command="{type:'powerReBoot',info:[scope.row]}">强制重启</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 3 && scope.row.status != 100 && scope.row.status != 101" :command="{type:'reTry',info:[scope.row]}">重试</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.used_type != '1'" :disabled="scope.row.status != 1 && scope.row.status != 3 && scope.row.status != 99 && scope.row.status != 100 && scope.row.status != 101 && scope.row.status != 102" :command="{type:'delete',info:[scope.row]}">删除</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.used_type != '1'" :disabled="scope.row.status != 3" :command="{type:'resetPassword',info:scope.row}">重置密码</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 3" :command="{type:'diskExtent',info:scope.row}">磁盘扩容</el-dropdown-item>
                  </el-col>
                  <el-col :span="12">
                    <el-dropdown-item v-if="scope.row.used_type != '1'" :disabled="scope.row.status != 3||scope.row.internet_ip_exist==0" :command="{type:'resetNet',info:scope.row}">调整网络</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 1" :command="{type:'resetConfig',info:scope.row}">调整配置</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.used_type != '1'" :disabled="scope.row.status != 1 && scope.row.status != 3" :command="{type:'conferProject',info:scope.row}">分配至项目</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.used_type != '1'" :disabled="scope.row.status != 1 && scope.row.status != 3" :command="{type:'cloneBackups',info:[scope.row]}">克隆备份</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.used_type != '1'" :disabled="scope.row.status != 1" :command="{type:'cloneCreate',info:scope.row}">克隆创建</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 1" :command="{type:'offLineMigrate',info:scope.row}">冷迁移</el-dropdown-item>
                    <el-dropdown-item :disabled="scope.row.status != 3" :command="{type:'hostMigrate',info:scope.row}">热迁移</el-dropdown-item>
                    <!-- <el-dropdown-item :command="{type:'bindNet',info:scope.row}">绑定公网IP</el-dropdown-item>
                    <el-dropdown-item :command="{type:'unbindNet',info:[scope.row]}">解绑公网IP</el-dropdown-item> -->
                    <el-dropdown-item v-if="scope.row.used_type != '1'" :disabled="scope.row.status != 1 && scope.row.status != 3" :command="{type:'seecurityConfig',info:scope.row}">配置安全组</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.used_type != '1'" :disabled="scope.row.status != 3" :command="{type:'netCardConfig',info:scope.row}">网卡配置</el-dropdown-item>
                  </el-col>
                </el-row>

                <!-- 以下功能暂缓 -->
                <!-- <el-dropdown-item>监控</el-dropdown-item>
                <el-dropdown-item>镜像同步</el-dropdown-item> -->
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

    <tableColumNameDialog :columArr='columArr' :checkArr='checkArr' @sendColum='setColum'></tableColumNameDialog>

    <el-dialog class="dialogTemplate" :title="title" @close="handleClose" width="750px" :visible.sync="vmOperateStatu.someOperate" center>
      <someOperateDialog :title='title' :instanceUuid='instanceUuid' :someOperateInfo="someOperateInfo" @operateRes="operateRes"></someOperateDialog>
    </el-dialog>

    <el-dialog title="重置密码" width="650px" @close="handleClose" class='dialogTemplate' :visible.sync="vmOperateStatu.resetPwd" center>
      <resetVmPwdDialog :rowInfo='rowInfo' :instanceUuid='instanceUuid' @resetPwdRes='resetPwdRes'></resetVmPwdDialog>
    </el-dialog>

    <el-dialog title="分配至项目" width="650px" @close="handleClose" class='dialogTemplate' :visible.sync="vmOperateStatu.editPro" center>
      <editProject :rowInfo='rowInfo' :instanceUuid='instanceUuid' :projectList='requestList.projectList' @editProRes='editProRes'></editProject>
    </el-dialog>

    <el-dialog title="调整配置" width="650px" @close="handleClose" class='dialogTemplate' :visible.sync="vmOperateStatu.config" center>
      <editConfig :rowInfo='rowInfo' :instanceUuid='instanceUuid' @configRes='configRes' :configList='requestList.configList'></editConfig>
    </el-dialog>

    <el-dialog title="配置安全组" @close="handleClose" class="dialogTemplate" width="650px" :visible.sync="vmOperateStatu.editSecuirty" center>
      <editSafeGroup :instanceUuid='instanceUuid' :netCardList='requestList.netCardList' @editSecurityRes='editSecurityRes'></editSafeGroup>
    </el-dialog>

    <el-dialog title="调整网络" @close="handleClose" class="dialogTemplate" width="650px" :visible.sync="vmOperateStatu.internet" center>
      <editNet :instanceUuid='instanceUuid' @editNetRes='editNetRes' :rowInfo='rowInfo'></editNet>
    </el-dialog>
    <el-dialog class="dialogTemplate" @close="handleClose" title="网卡配置" width="650px" :visible.sync="vmOperateStatu.netCartConfigShow" center>
      <netCardConfig :instanceUuid='instanceUuid' @diskScaleClick='netCartConfigClick' :netCartId='netCartId' :rowInfo='rowInfo'></netCardConfig>
    </el-dialog>
    <el-dialog class="dialogTemplate" @close="handleClose" title="热迁移" width="750px" :visible.sync="vmOperateStatu.hotMigrateVisible" center>
      <hotMigrate :instanceUuid='instanceUuid' :rowInfo='rowInfo' :hostMigrateInfo='requestList.hostMigrateInfo' @hotMigrateRes='hotMigrateRes'></hotMigrate>
    </el-dialog>

    <el-dialog class="dialogTemplate" @close="handleClose" title="冷迁移" width="750px" :visible.sync="vmOperateStatu.offLineMigrateVisible" center>
      <offLineMigrate :instanceUuid='instanceUuid' :rowInfo='rowInfo' :offLineMigrateInfo='requestList.offLineMigrateInfo' @offLineMigratRes='offLineMigratRes'></offLineMigrate>
    </el-dialog>

    <editVmName></editVmName>

    <bindPubNetIp></bindPubNetIp>

  </div>
</template>
<script>
import {
  downLoadVm,
  getConsoleHost,
  getColdMigrateInfo,
  getHotMigrateInfo,
  getVmList,
  getConfigInfo,
  getNetCardInfo
} from '@/api/admin/vm'
import { downloadFile, formateVmType } from '@/filters/index'
import { formateVmStatus } from '@/filters/index'
import selectComponent from './selectCommon'
import { mapActions } from 'vuex'
import tableColumNameDialog from './../../common/tableColumName'
import someOperateDialog from './vm/someOperate'
import resetVmPwdDialog from './vm/resetPwd'
import { getProjectArr } from '@/api/admin/lesseeManage'
import editNet from './vm/editNet'
import editConfig from './vm/editConfig'
import editProject from './vm/editProject'
import editSafeGroup from './vm/editSafeGroup'
import hotMigrate from './vm/hotMigrate'
import offLineMigrate from './vm/offLineMigrate'
import editVmName from './vm/editVmName'
import bindPubNetIp from './vm/bindPubNetIp'
import netCardConfig from './vm/netCardConfig'
const defaultFormThead = [
  { name: 'IP地址', id: 'ip_address' },
  { name: 'HOST IP', id: 'host_ip_address' },
  { name: '状态', id: '_status' },
  { name: '应用管理员', id: 'owner' },
  { name: '所属项目', id: 'project_name' },
  { name: '操作系统', id: 'os_type' },
  // { name: '应用系统信息', id: 'app_info' },
  // { name: '所属集群', id: 'hostcluster_name' },
  // { name: '所属网络', id: 'network_segment_name' }
  { name: '所属子网', id: 'subnetwork_segment_name' },
  { name: '公网IP', id: 'internet_ip' }
]
export default {
  data() {
    return {
      filterType: 0,
      isOperate: false, // 判断是否是操作功能模块 是则停止定时器 不是则启动定时器
      instanceUuid: '',
      listLoading: false,
      netCartId: '', // 当前操作记录的id
      requestList: {
        projectList: [],
        configList: [],
        netCardList: [], // 安全组分配网卡信息
        netCardInfo: [], // 网卡配置网卡信息
        hostMigrateInfo: [], // 热迁移信息
        offLineMigrateInfo: [] // 冷迁移信息
      },
      rowInfo: {},
      // 弹窗状态管理
      vmOperateStatu: {
        someOperate: false,
        resetPwd: false, // 重置密码
        editPro: false, // 分配项目
        config: false, // 调整配置
        editSecuirty: false,
        internet: false, // 调整网络
        netCartConfigShow: false, // 网卡配置
        hotMigrateVisible: false, // 热迁移
        offLineMigrateVisible: false
      },
      title: '', // someOperate的弹框名称
      multipleSelection: [], // 表格多选数据
      someOperateInfo: [], //单行操作数据
      // 所有列名 供用户自定义
      columArr: [
        { name: 'IP地址', id: 'ip_address' },
        { name: 'HOST IP', id: 'host_ip_address' },
        { name: '操作系统', id: 'os_type' },
        { name: '状态', id: '_status' },
        { name: '应用管理员', id: 'owner' },
        { name: '所属项目', id: 'project_name' },
        { name: '应用系统信息', id: 'app_info' },
        { name: '所属集群', id: 'hostcluster_name' },
        { name: '所属网络', id: 'network_segment_name' },
        { name: '所属子网', id: 'subnetwork_segment_name' },
        { name: '公网IP', id: 'internet_ip' }
      ],
      // 默认选中的值
      checkArr: [
        'ip_address',
        'host_ip_address',
        '_status',
        'owner',
        'os_type',
        'project_name',
        // 'app_info',
        // 'hostcluster_name',
        // 'network_segment_name',
        'subnetwork_segment_name',
        'internet_ip'
      ],
      // 表格数据
      key: 1, // table key
      formTheadOptions: [
        { name: 'IP地址', id: 'ip_address' },
        { name: 'HOST IP', id: 'host_ip_address' },
        { name: '操作系统', id: 'os_type' },
        { name: '状态', id: '_status' },
        { name: '应用管理员', id: 'owner' },
        { name: '所属项目', id: 'project_name' },
        { name: '应用系统信息', id: 'app_info' },
        { name: '所属集群', id: 'hostcluster_name' },
        { name: '所属网络', id: 'network_segment_name' },
        { name: '所属子网', id: 'subnetwork_segment_name' },
        { name: '公网IP', id: 'internet_ip' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      search: {
        selectList: [
          {
            label: 'VM名称',
            value: 'instance_name'
          },
          {
            label: 'VM IP',
            value: 'ip_address'
          },
          {
            label: '物理机IP',
            value: 'host_ip'
          },
          {
            label: '管理员工号',
            value: 'owner'
          },
          {
            label: '项目',
            value: 'project_name'
          },
          {
            label: 'VM状态',
            value: 'status',
            //  0创建中，1关机，2关机中，3运行中，4开机中，5挂起，6暂停，7热迁移中，8冷迁移中，9转化中，10克隆中，98其他，99错误，100虚机创建失败，101克隆备份失败，102克隆创建失败，103被克隆中，104配置中
            children: [
              { label: '创建中', value: '0' },
              { label: '关机', value: '1' },
              { label: '关机中', value: '2' },
              { label: '运行中', value: '3' },
              { label: '开机中', value: '4' },
              { label: '挂起', value: '5' },
              { label: '暂停', value: '6' },
              { label: '热迁移中', value: '7' },
              { label: '冷迁移中', value: '8' },
              { label: '转化中', value: '9' },
              { label: '克隆中', value: '10' },
              { label: '其他', value: '98' },
              { label: '错误', value: '99' },
              { label: '虚机创建失败', value: '100' },
              { label: '克隆备份失败', value: '101' },
              { label: '克隆创建失败', value: '102' },
              { label: '被克隆中', value: '103' },
              { label: '配置中', value: '104' }
            ]
          },
          {
            label: 'VM类型',
            value: 'vm_used_type',
            children: [
              { label: '普通虚拟机', value: '0' },
              { label: 'haproxy+keepalive服务虚拟机', value: '1' },
              { label: '虚拟路由DHCP设备', value: '2' },
              { label: '虚拟路由设备', value: '3' },
            ]
          }
        ],
        isSearchStatu: false,
        status: '',
        searchKey: [],
        inputVal: ''
      },
      tableData: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      searchBox: {
        project_name: '', // 搜索字段
        tenant_uuid: '-1' // 筛选租户名称
      },
      timeOut: null
    }
  },
  mounted() {
    this.getList()
    setTimeout(this.refreshTable, 20000)
  },
  methods: {
    formateVmType,
    downLoadVm,
    downloadFile,
    getConsoleHost,
    getColdMigrateInfo,
    getHotMigrateInfo,
    getNetCardInfo,
    getConfigInfo,
    getProjectArr,
    formateVmStatus,
    getVmList,
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    downloadVmList() {
      this.downLoadVm().then(res => {
        this.downloadFile(res.data.data, '虚拟机列表')
      })
    },
    toConsole(row) {
      this.getConsoleHost({ instance_uuid: row.instance_uuid }).then(res => {
        function setCookie(name, value) {
          var Days = 30
          var exp = new Date()
          exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
          document.cookie =
            name + '=' + escape(value) + ';expires=' + exp.toGMTString()
        }
        setCookie('token', res.data.data.host_ip + '-' + res.data.data.port)
        window.open(
          `/static/html/vnc_lite.html?name=${row.displayname}&ip=${
            row.ip_address
          }`
        )
      })
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
    offLineMigratRes() {
      this.vmOperateStatu.offLineMigrateVisible = false
    },
    hotMigrateRes() {
      this.vmOperateStatu.hotMigrateVisible = false
    },
    netCartConfigClick() {
      this.netCartId = ''
      this.vmOperateStatu.netCartConfigShow = false
    },
    editNetRes() {
      this.vmOperateStatu.internet = false
    },
    editSecurityRes() {
      this.vmOperateStatu.editSecuirty = false
    },
    configRes() {
      this.vmOperateStatu.config = false
    },
    editProRes() {
      this.vmOperateStatu.editPro = false
    },
    resetPwdRes() {
      this.vmOperateStatu.resetPwd = false
    },
    toDetails(row) {
      this.$router.push(`/sf_cloud/workbench/vmDetails/${row.instance_uuid}`)
    },
    filterUseType() {
      // 如果不是普通虚拟机则需对批量操作按钮进行控制
      this.multipleSelection.forEach(item => {
        if (item.used_type == 2 || item.used_type == 3) {
          // 如果是DHCP或者vrouter
          this.filterType = 2
          return false
        } else if (item.used_type == 1) {
          // 如果是keepalive虚拟机
          this.filterType = 1
          return false
        }
        this.filterType = 0
      })
      if (this.filterType == 1 || this.filterType == 2) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '只有普通虚拟机才能做删除操作'
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 0) {
        this.filterUseType()
        this.isOperate = true
      } else {
        this.isOperate = false
      }
      this.refreshTable()
    },
    handleClose() {
      this.instanceUuid = ''
      this.changeSearch()
      this.isOperate = false
      this.refreshTable()
    },
    operateRes() {
      this.vmOperateStatu.someOperate = false
    },
    // 搜索框方法
    changeSearch() {
      if (this.search.searchKey.length > 0) {
        let options = {}
        if (this.search.inputVal != '') {
          options[this.search.searchKey[0]] = this.search.inputVal
        }
        if (this.search.searchKey.length > 1) {
          options[this.search.searchKey[0]] = this.search.searchKey[1]
        }
        if (this.searchBox.tenant_uuid === '-1') {
          this.getList(options)
        } else {
          options.tenant_uuid = this.searchBox.tenant_uuid
          this.getList(options)
        }
      } else {
        if (this.searchBox.tenant_uuid != '-1') {
          this.getList({ tenant_uuid: this.searchBox.tenant_uuid })
        } else {
          this.getList()
        }
      }
    },
    getchangeSearch() {
      this.search.inputVal = ''
      let options = {}
      if (this.searchBox.tenant_uuid != '-1') {
        options.tenant_uuid = this.searchBox.tenant_uuid
      }
      if (this.search.searchKey.length > 1) {
        this.search.isSearchStatu = false
        options[this.search.searchKey[0]] = this.search.searchKey[1]
        this.getList(options)
      } else if (this.search.searchKey.length == 1) {
        this.search.isSearchStatu = true
      } else {
        this.search.isSearchStatu = false
        this.getList(options)
      }
    },
    // 编辑自定义列
    editColum() {
      this.isOperate = true
      this.refreshTable()
      this.updateTableCloum(true)
    },
    // 设置用户自定的列显示
    setColum(columNew) {
      this.checkboxVal = columNew
      this.isOperate = false
      setTimeout(this.refreshTable, 20000)
    },
    getList(search) {
      // 获取VM列表
      this.listLoading = true
      this.getVmList({
        page_no: this.paginationInfo.currentPage,
        page_size: this.paginationInfo.pageSize,
        user_role: '1',
        search: JSON.stringify(search) || ''
      }).then(res => {
        this.listLoading = false
        if (res.data.code == 0) {
          res.data.data.rows.forEach(item => {
            item._status = this.formateVmStatus(item.status)
          })
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    getSelect(item) {
      //// 获取租户筛选项目
      this.searchBox.tenant_uuid = item.tenant_uuid
      if (item.tenant_uuid === '-1') {
        this.getList()
      } else {
        this.getList({
          tenant_uuid: this.searchBox.tenant_uuid
        })
      }
      // 此处还需初始化VM其他搜索条件
      this.search.searchKey = []
      this.search.inputVal = ''
      this.search.isSearchStatu = false
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.changeSearch()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.changeSearch()
    },
    // 以下测试数据

    // 筛选
    forSelect() {},
    getSelVal(val) {
      // console.log(val)
    },
    handleClick(row) {
      // console.log(row)
    },
    // vm创建
    createShow() {
      this.isOperate = true
      this.$router.push('/sf_cloud/workbench/vmCreate')
    },
    // 0 开机 1 关机 2 重启 3 重试 4 删除  5 磁盘扩容 6 调整网络 7 调整配置 8 分配至项目 9 克隆备份 10 克隆创建 11 冷迁移 12 热迁移 13 绑定公网IP 14 解绑公网IP 15 监控 16 镜像同步 17 console 18 重置密码 19 配置安全组 20 网卡配置
    someOperate(command) {
      this.isOperate = true
      this.instanceUuid = command.info.instance_uuid
      switch (command.type) {
        case 'startUp':
          this.title = '开机'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'shutDown':
          this.title = '关机'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'powerOff':
          this.title = '强制关机'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'reBoot':
          this.title = '重启'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'powerReBoot':
          this.title = '强制重启'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'reTry':
          this.title = '重试'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'delete':
          this.title = '删除'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'diskExtent':
          this.$router.push({
            path: `/sf_cloud/workbench/vmDiskScale/${
              command.info.instance_uuid
            }`,
            query: { info: JSON.stringify(command.info) }
          })
          break
        case 'resetNet':
          this.rowInfo = command.info
          this.vmOperateStatu.internet = true
          break
        case 'resetConfig':
          this.getConfigInfo().then(res => {
            if (res.data.code == 0) {
              this.rowInfo = command.info
              this.requestList.configList = res.data.data
              this.vmOperateStatu.config = true
            }
          })
          break
        case 'conferProject':
          this.getProjectArr({
            tenant_uuid: command.info.tenant_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.rowInfo = command.info
              this.requestList.projectList = res.data.data
              this.vmOperateStatu.editPro = true
            }
          })

          break
        case 'cloneBackups':
          this.title = '克隆备份'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'cloneCreate':
          this.$router.push(
            `/sf_cloud/workbench/cloneCreate/${command.info.instance_uuid}`
          )
          break
        case 'offLineMigrate':
          this.getColdMigrateInfo({
            instance_uuid: command.info.instance_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.rowInfo = command.info
              this.requestList.offLineMigrateInfo = res.data.data
              this.vmOperateStatu.offLineMigrateVisible = true
            }
          })
          break
        case 'hostMigrate':
          this.getHotMigrateInfo({
            instance_uuid: command.info.instance_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.rowInfo = command.info
              this.requestList.hostMigrateInfo = res.data.data
              this.vmOperateStatu.hotMigrateVisible = true
            }
          })

          break
        // 公网IP延后
        case 'bindNet':
          this.title = '绑定公网IP'
          break
        case 'unbindNet':
          this.title = '解绑公网IP'
          this.someOperateInfo = command
          this.vmOperateStatu.someOperate = true
          break
        case 'resetPassword':
          this.rowInfo = command.info
          this.vmOperateStatu.resetPwd = true
          break
        case 'seecurityConfig':
          this.getNetCardInfo({
            instance_uuid: command.info.instance_uuid
          }).then(res => {
            if (res.data.code == 0) {
              this.requestList.netCardList = res.data.data
              this.vmOperateStatu.editSecuirty = true
            }
          })
          break
        case 'netCardConfig':
          this.rowInfo = command.info
          this.netCartId = command.info.instance_uuid
          this.vmOperateStatu.netCartConfigShow = true
          // this.netCardInitInfo({
          //   instance_uuid: command.info.instance_uuid
          // }).then(res => {
          //   if (res.data.code == 0) {
          //     this.rowInfo = command.info
          //     this.requestList.netCardInfo = res.data.data
          //     this.vmOperateStatu.netCartConfigShow = true
          //   }
          // })

          break
      }
    }
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
    selectComponent,
    offLineMigrate,
    someOperateDialog,
    resetVmPwdDialog,
    editVmName,
    editNet,
    editConfig,
    editProject,
    editSafeGroup,
    hotMigrate,
    bindPubNetIp,
    tableColumNameDialog,
    netCardConfig
  },
  destroyed() {
    this.isOperate = true
  }
}
</script>
<style lang="less">
// .el-cascader-menu {
//   height: inherit;
// }
.vmPage {
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
  .ipManageBtn {
    margin-left: 10px;
    .filtTerm {
      margin-top: 15px;
      padding: 15px 10px;
      width: 100%;
      background: #eee;
    }
  }
  .vmList {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    .nameLink {
      cursor: pointer;
      color: #0778fd;
      font-weight: 500;
    }
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
    .vmConfigList {
      position: absolute;
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
}
</style>
