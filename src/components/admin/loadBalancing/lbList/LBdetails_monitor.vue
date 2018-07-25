<template>
  <div class="load-balance-details">
    <div class="details-title">
      <el-button class="back-but" icon="el-icon-arrow-left" @click="back()" type="text">返回</el-button>
      <span class="title-content">监听器 管理</span>
    </div>
    <div class="details-content">
      <div class="details-box">
        <div class="LBdetails_monitor">
          <p class="details-search">
            <br> &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" plain @click="newMonitor" size="small">新建</el-button>
          </p>
          <el-table class="content-table" :data="tableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="my-table" label-width="150">
                  <el-form-item label="ID">
                    <span>{{ props.row.uuid }}</span>
                  </el-form-item>
                  <el-form-item label="证书" v-if="props.row.protocol=='2'">
                    <span>{{ props.row.certificate_name }}</span>
                  </el-form-item>
                  <el-form-item label="均衡方式">
                    <span>{{ formatebalanceStrategy(props.row.strategy_id) }}</span>
                  </el-form-item>
                  <el-form-item label="健康检查">
                    <span>{{ props.row.isactived=='0'?'启用':'未启用'}}</span>
                  </el-form-item>
                  <!-- <el-form-item label="健康状态">
                    <span>{{ props.row.healthyType }}</span>
                  </el-form-item> -->
                  <el-form-item label="请求方式" v-if="props.row.isactived=='0'">
                    <span>{{ props.row.http_request_method =='0'?'head':'get' }}</span>
                  </el-form-item>
                  <el-form-item label="健康检查路径" v-if="props.row.isactived=='0'">
                    <span>{{ props.row.check_directory }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="监听器" prop="name" :show-overflow-tooltip="true">
              <template slot-scope="props">
                <span>{{props.row.name}} ({{formateProtocol(props.row.protocol)}}:{{props.row.port}})</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="id" min-width="400">
              <template slot-scope="props">
                <span class="operations" @click="getVmDetails(props.row)">查看关联实例</span>
                <span class="operations" @click='editTrigger(props.row)'>修改</span>
                <span class="operations" @click="deleteDialog(props.row)">删除</span>
                <span class="operations" @click="bindVmTrigger(props.row)">绑定实例</span>
                <span class="operations" @click="getUnbindData(props.row)">解绑实例</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <div class="paginationBox">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
            </el-pagination>
          </div>
          <!-- 关联云主机展示 -->
          <el-dialog width="650px" center :visible.sync="statu.vmDetails" class='dialogTemplate' title='关联云主机列表'>
            <div>
              <el-table :data="instancerDeatils" style="width: 100%">
                <el-table-column prop="name" label="实例名称" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="ip_address" label="IP" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="port" label="端口" :show-overflow-tooltip="true">
                </el-table-column>
              </el-table>
            </div>
          </el-dialog>
          <!-- 解绑云主机 -->
          <el-dialog @close='unbindLoading=false' width="650px" center :visible.sync="statu.unBind" class='dialogTemplate' title='解绑云主机'>
            <div v-loading="unbindLoading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading">
              <el-table :data="unbindData" ref='unbindTable' @selection-change="handleUnbindChange" style="width: 100%" height='500'>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="name" label="实例名称" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="ip_address" label="IP" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="port" label="端口" :show-overflow-tooltip="true">
                </el-table-column>
              </el-table>
              <br>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancelUnbind">取消</el-button>
                <el-button type="primary" @click="unBindSubmit">确定解绑</el-button>
              </span>
            </div>
          </el-dialog>

          <!-- 绑定云主机 -->
          <el-dialog @close='bingLoading=false' width="650px" center :visible.sync="statu.bind" class='dialogTemplate' title='绑定实例'>
            <div v-loading="bingLoading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading">
              <el-form ref="bindFrom">
                <el-table :data="bindData" ref='multipleTable' @selection-change="handleSelectionChange" style="width: 100%" height='500'>
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="instance_name" label="名称" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column prop="ip_address" label="IP" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column label="端口号" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <el-form :model='scope.row' :rules='bindRules' :ref="'_'+scope.$index">
                        <el-form-item prop='port'>
                          <el-input type='text' v-model.number='scope.row.port' placeholder="请输入端口号"></el-input>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <br>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancelBind">取消</el-button>
                <el-button type="primary" @click="bindSubmit">确定绑定</el-button>
              </span>
            </div>
          </el-dialog>

          <!-- 监听器创建弹框 -->
          <el-dialog @close='createLoading=false' class="monitor-dialog dialogTemplate" title="创建监听器" :visible.sync="statu.create" width="650px" center>
            <el-form v-loading="createLoading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" ref="createForm" :model="createForm" :rules='createRules' label-width="120px">
              <el-form-item label="名称" prop='name'>
                <el-col :span='12'>
                  <el-input v-model="createForm.name"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="监听协议端口" class='listenerPort' prop='port'>
                <el-col :span='12'>
                  <el-input placeholder="请输入内容" v-model.number="createForm.port" class="input-with-select">
                    <el-select slot="prepend" v-model="createForm.protocol" @change='handleChangeProtocol' placeholder="请选择">
                      <el-option label="TCP" value="0"></el-option>
                      <el-option label="HTTP" value="1"></el-option>
                      <el-option label="HTTPS" value="2"></el-option>
                    </el-select>
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="证书" prop='certificate_uuid' v-if='createForm.protocol=="2"'>
                <el-select v-model="createForm.certificate_uuid">
                  <el-option :label='item.name' :value='item.uuid' v-for='item in createList.certificateList' :key='item.uuid'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="均衡方式" prop='balance_strategy'>
                <el-select v-model="createForm.balance_strategy">
                  <el-option label='轮询(roundrobin)' value='1'></el-option>
                  <el-option label='静态轮询(static-rr)' value='2'></el-option>
                  <el-option label='源ip(source)' value='3'></el-option>
                  <el-option label='最小连接(leastconn)' value='4'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="健康检查" prop='health_actived'>
                <el-switch v-model="createForm.health_actived" @change='handleChangeHealth'></el-switch>
              </el-form-item>
              <div v-if="createForm.health_actived && createForm.protocol!='0'">
                <el-form-item class="stepWidth" label="请求方式" prop='request_method'>
                  <el-select v-model="createForm.request_method">
                    <el-option label='head' value='0'></el-option>
                    <!-- <el-option label='get' value='1'></el-option> -->
                  </el-select>
                </el-form-item>
                <el-form-item class="stepWidth" label="健康检查路径" prop='check_path'>
                  <el-select v-model="createForm.check_path">
                    <el-option label='/index.html' value='/index.html'></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button @click="createCancel">取消</el-button>
                <el-button @click="submit">确认创建</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <!-- 监听器编辑弹框 -->
          <el-dialog @close='editLoading =false' class="monitor-dialog dialogTemplate" title="编辑监听器" :visible.sync="statu.edit" width="650px" center>
            <el-form v-loading="editLoading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" ref="editForm" :model="rowInfo" :rules='editRules' label-width="120px">
              <el-form-item label="名称" prop='name'>
                <el-col :span='12'>
                  <el-input v-model="rowInfo.name"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="监听协议端口" class='listenerPort' prop='port'>
                <el-col :span='12'>
                  <el-input placeholder="请输入内容" v-model.number="rowInfo.port" class="input-with-select">
                    <el-select slot="prepend" v-model="rowInfo.protocol" @change='handleChangeEditProtocol' placeholder="请选择">
                      <el-option label="TCP" value="0"></el-option>
                      <el-option label="HTTP" value="1"></el-option>
                      <el-option label="HTTPS" value="2"></el-option>
                    </el-select>
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="证书" prop='certificate_uuid' v-if='rowInfo.protocol=="2"'>
                <el-select v-model="rowInfo.certificate_uuid">
                  <el-option :label='item.name' :value='item.uuid' v-for='item in editList.certificateList' :key='item.uuid'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="均衡方式" prop='strategy_id'>
                <el-select v-model="rowInfo.strategy_id">
                  <el-option label='轮询(roundrobin)' :value='1'></el-option>
                  <el-option label='静态轮询(static-rr)' :value='2'></el-option>
                  <el-option label='源ip(source)' :value='3'></el-option>
                  <el-option label='最小连接(leastconn)' :value='4'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="健康检查" prop='isactived'>
                <el-switch v-model="rowInfo.isactived" @change='handleChangeHealth'></el-switch>
              </el-form-item>
              <div v-if="rowInfo.isactived &&rowInfo.protocol != 0">
                <el-form-item class="stepWidth" label="请求方式" prop='http_request_method'>
                  <el-select v-model="rowInfo.http_request_method">
                    <el-option label='head' value='0'></el-option>
                    <!-- <el-option label='get' value='1'></el-option> -->
                  </el-select>
                </el-form-item>
                <el-form-item class="stepWidth" label="健康检查路径" prop='check_directory'>
                  <el-select v-model="rowInfo.check_directory">
                    <el-option label='/index.html' value='/index.html'></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button @click="cancelEdit">取消</el-button>
                <el-button @click="editSubmit">确认修改</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <!--删除弹框 -->
          <el-dialog class="delete-dialog dialogTemplate" title="删除监听器" :visible.sync="statu.delte" width="400px" center>
            <p style="text-align: center; line-height: 50px;">确认删除{{rowInfo.name}}吗？</p>
            <span class="host-footer">
              <el-button size="small" @click='cancelDelete'>取 消</el-button>
              <el-button size="small" type="primary" @click='deleteSubmit'>确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  editListenerInfo,
  getBindedVmlist,
  unBindedVmlist,
  bindVm,
  getVmList,
  deleteListener,
  getListenerList,
  createListener,
  getCertificateList
} from '@/api/admin/lb'
import { formatebalanceStrategy, formateProtocol } from '@/filters/index'
import { mapGetters, mapActions } from 'vuex'
export default {
  mounted() {
    let id = this.$route.params.id
  },
  data() {
    var checkPort = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入端口号'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('端口号必须为数字'))
      } else if (value < 0 || value > 65535) {
        callback(new Error('端口号范围为0-65535'))
      } else {
        callback()
      }
    }
    return {
      instancerDeatils: [],
      unbindLoading: false,
      bingLoading: false,
      createLoading: false,
      editLoading: false,
      editList: { certificateList: [] },
      editRules: {
        name: [{ required: true, message: '请选择输入名称', trigger: 'blur' }],
        port: [{ validator: checkPort, trigger: 'blur' }],
        certificate_uuid: [
          { required: true, message: '请选择证书', trigger: 'change' }
        ],
        strategy_id: [
          { required: true, message: '请选择均衡方式', trigger: 'change' }
        ],
        http_request_method: [
          { required: true, message: '请选择请求方式', trigger: 'change' }
        ],
        check_directory: [
          { required: true, message: '请选择健康检查路径', trigger: 'change' }
        ]
      },
      unbingParams: [],
      unbindData: [],
      bindParams: [],
      bindData: [],
      bindRules: {
        port: [{ validator: checkPort, trigger: 'blur' }]
      },
      rowInfo: {},
      createList: {
        certificateList: []
      },
      createRules: {
        name: [{ required: true, message: '请选择输入名称', trigger: 'blur' }],
        port: [{ validator: checkPort, trigger: 'blur' }],
        certificate_uuid: [
          { required: true, message: '请选择证书', trigger: 'change' }
        ],
        balance_strategy: [
          { required: true, message: '请选择均衡方式', trigger: 'change' }
        ],
        request_method: [
          { required: true, message: '请选择请求方式', trigger: 'change' }
        ],
        check_path: [
          { required: true, message: '请选择健康检查路径', trigger: 'change' }
        ]
      },
      createForm: {
        name: '',
        protocol: '',
        certificate_uuid: '',
        port: '',
        balance_strategy: '',
        health_actived: true,
        request_method: '',
        check_path: ''
      },
      statu: {
        create: false,
        unBind: false,
        bind: false,
        delte: false,
        edit: false,
        vmDetails: false
      },
      tableData: [],
      paginationInfo: {
        // 分页
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      changeName: false, // 修改name弹框
      activeName: '0',
      changeBox: '',
      details: {
        name: '2dfe5-5sdf5es'
      },
      deleteTitle: '', // 解绑/删除标题
      localSelect: 0 // 以勾选选框
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    editListenerInfo,
    getBindedVmlist,
    unBindedVmlist,
    bindVm,
    getVmList,
    deleteListener,
    formateProtocol,
    formatebalanceStrategy,
    getCertificateList,
    getListenerList,
    createListener,
    getVmDetails(row) {
      this.rowInfo = row
      this.getBindedVmlist({
        loadbalance_listener_uuid: row.uuid,
        page_size: 1000000,
        page_no: 1,
        search: {}
      }).then(res => {
        if (res.data.code == 0) {
          this.statu.vmDetails = true
          this.instancerDeatils = res.data.data.rows
        }
      })
    },
    getCertificateInfo() {
      this.getCertificateList({
        tenant_uuid: JSON.parse(this.$route.query.rowInfo).tenant_uuid,
        page_size: 100000,
        page_no: 1,
        user_role: 1,
        search: {}
      }).then(res => {
        if (res.data.code == 0) {
          this.editList.certificateList = res.data.data.rows
        }
      })
    },
    handleChangeEditProtocol() {
      if (this.rowInfo.protocol == '2') {
        this.rowInfo.certificate_uuid = ''
        this.getCertificateInfo()
      }
    },
    editSubmit() {
      let options = {
        name: this.rowInfo.name,
        protocol: this.rowInfo.protocol,
        port: this.rowInfo.port,
        balance_strategy: this.rowInfo.strategy_id,
        health_actived: this.rowInfo.isactived ? 0 : 1,
        loadbalance_uuid: this.$route.params.id,
        lb_listener_uuid: this.rowInfo.uuid,
        is_bind: this.rowInfo.is_bind
      }
      if (this.rowInfo.protocol == '2') {
        options.certificate_uuid = this.rowInfo.certificate_uuid
      }
      if (this.rowInfo.health_actived && this.rowInfo.port != '0') {
        options.request_method = this.rowInfo.http_request_method
        options.check_path = this.rowInfo.check_directory
      }
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.editLoading = true
          this.editListenerInfo(options).then(res => {
            this.editLoading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.cancelEdit()
            }
          })
        }
      })
    },
    cancelEdit() {
      this.statu.edit = false
      this.rowInfo = {}
      this.getList()
    },
    editTrigger(row) {
      row.isactived == '0' ? (row.isactived = true) : (row.isactived = false)
      if (row.protocol == '2') {
        this.getCertificateInfo()
      }
      this.rowInfo = row
      this.statu.edit = true
    },
    handleUnbindChange(val) {
      this.unbingParams = val
    },
    getUnbindData(row) {
      this.rowInfo = row
      this.getBindedVmlist({
        loadbalance_listener_uuid: row.uuid,
        page_size: 1000000,
        page_no: 1,
        search: {}
      }).then(res => {
        if (res.data.code == 0) {
          this.statu.unBind = true
          this.unbindData = res.data.data.rows
        }
      })
    },
    cancelUnbind() {
      this.statu.unBind = false
      this.getList()
      this.$refs.unbindTable.clearSelection()
    },
    unBindSubmit() {
      if (this.unbingParams.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择需要解绑的云主机'
        })
        return
      }
      let options = {
        lb_listener_uuid: this.rowInfo.uuid,
        lb_uuid: this.$route.params.id
      }
      let binding_lst = []
      this.unbingParams.forEach(item => {
        binding_lst.push({
          ip_uuid: item.ip_uuid,
          ip_address: item.ip_address,
          business_port: item.port
        })
      })
      options.binding_lst = JSON.stringify(binding_lst)
      this.unbindLoading = true
      this.unBindedVmlist(options).then(res => {
        this.unbindLoading = false
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '解绑成功'
          })
          this.cancelUnbind()
        }
      })
    },
    cancelBind() {
      this.bindData.forEach((obj, index) => {
        let _ref = '_' + index
        this.$refs[_ref].resetFields()
      })
      this.statu.bind = false
      this.$refs.multipleTable.clearSelection()
      this.getList()
    },
    bindSubmit() {
      if (this.bindParams.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择需要绑定的云主机'
        })
        return
      }
      let deg = true
      let id_arr = []
      this.bindParams.forEach(v => {
        id_arr.push(v.ip_uuid)
      })
      this.bindData.forEach((obj, index) => {
        if (id_arr.indexOf(obj.ip_uuid) >= 0) {
          let _ref = '_' + index
          this.$refs[_ref].validate(valid => {
            if (!valid) {
              deg = false
            }
          })
        }
      })
      if (deg) {
        let options = {
          loadbalance_uuid: this.$route.params.id,
          loadbalance_listener_uuid: this.rowInfo.uuid,
          project_name: JSON.parse(this.$route.query.rowInfo).project_name
        }
        let binding_lst = []
        this.bindParams.forEach(item => {
          binding_lst.push({
            ip_uuid: item.ip_uuid,
            ip_address: item.ip_address,
            business_port: item.port
          })
        })
        options.binding_lst = JSON.stringify(binding_lst)
        this.bingLoading = true
        this.bindVm(options).then(res => {
          this.bingLoading = false
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '绑定成功'
            })
            this.cancelBind()
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.bindParams = val
    },
    bindVmTrigger(row) {
      this.rowInfo = row
      this.getVmList({
        project_uuid: row.project_uuid
      }).then(res => {
        if (res.data.code == 0) {
          res.data.data.forEach(item => {
            item.port = ''
          })
          this.bindData = res.data.data
          this.statu.bind = true
        }
      })
    },
    cancelDelete() {
      this.statu.delte = false
      this.getList()
    },
    deleteSubmit() {
      let options = {
        lb_listener_uuid: this.rowInfo.uuid,
        lb_uuid: this.$route.params.id,
        is_bind: this.rowInfo.is_bind
      }
      this.deleteListener(options).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.cancelDelete()
        }
      })
    },
    submit() {
      let options = {
        name: this.createForm.name,
        protocol: this.createForm.protocol,
        port: this.createForm.port,
        balance_strategy: this.createForm.balance_strategy,
        health_actived: this.createForm.health_actived ? 0 : 1,
        loadbalance_uuid: this.$route.params.id
      }
      if (this.createForm.protocol == '2') {
        options.certificate_uuid = this.createForm.certificate_uuid
      }
      if (this.createForm.health_actived && this.createForm.protocol != '0') {
        options.request_method = this.createForm.request_method
        options.check_path = this.createForm.check_path
      }
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.createLoading = true
          this.createListener(options).then(res => {
            this.createLoading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.createForm.protocol = ''
              this.createCancel()
              this.getList()
            }
          })
        }
      })
    },
    createCancel() {
      this.statu.create = false
      this.$refs.createForm.resetFields()
    },
    handleChangeHealth() {
      if (this.createForm.health_actived) {
        this.createForm.request_method = ''
        this.createForm.check_path = ''
      }
    },
    handleChangeProtocol() {
      if (this.createForm.protocol == '2') {
        this.createForm.certificate_uuid = ''
        this.getCertificateList({
          tenant_uuid: JSON.parse(this.$route.query.rowInfo).tenant_uuid,
          page_size: 100000,
          page_no: 1,
          user_role: 1,
          search: {}
        }).then(res => {
          if (res.data.code == 0) {
            this.createList.certificateList = res.data.data.rows
          }
        })
      }
    },
    getList() {
      this.getListenerList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        loadbalance_uuid: this.$route.params.id
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // 分页相关
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getList()
    },
    // 以下为测试数据
    back() {
      window.history.back(-1)
    },
    // 修改名称按钮
    changeClick() {
      this.changeBox = this.details.name
    },
    sureChange() {
      this.details.name = this.changeBox
      this.changeName = false
    },
    deleteDialog(row) {
      // 删除按钮
      this.rowInfo = row
      this.statu.delte = true
    },
    unbundling() {
      this.deleteTitle = '解绑云主机'
      this.statu.unBind = true
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    newMonitor() {
      this.statu.create = true
    },
    // 表格复选框
    clickCheck(selection, row) {
      this.localSelect = selection.length
    },
    clickAll(selection) {
      this.localSelect = selection.length
    }
  },
  watch: {}
}
</script>
<style lang="less">
.load-balance-details {
  box-sizing: border-box;
  padding: 5px 0;
  .details-title {
    background: #ffffff;
    .back-but {
      margin-left: 10px;
    }
    .title-content {
      font-weight: 700;
      font-size: 16px;
      padding-left: 20px;
    }
    .details-tabs {
      .el-tabs__nav {
        margin-left: 20px;
      }
      .el-tabs__header {
        margin: 0;
      }
    }
  }
  .details-content {
    background: #ffffff;
    margin-top: 10px;
    box-sizing: border-box;
    padding: 0 15px;
    min-height: ~'calc(100vh - 160px)';
    .change-but {
      color: #128dff;
      cursor: pointer;
    }
    .details-box {
      float: left;
      width: 100%;
      .content-title {
        font-weight: 700;
        font-size: 16px;
        line-height: 50px;
      }
      .operations {
        color: #128dff;
        padding: 0 10px;
        cursor: pointer;
      }
      .LBdetails_monitor {
        .content-table {
          .my-table {
            font-size: 0;
          }
          .my-table label {
            width: 120px;
            color: #99a9bf;
          }
          .my-table .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 40%;
            &:nth-child(odd) {
              width: 60%;
            }
          }
        }
        .details-search {
          .f-r {
            float: right;
          }
          .searchInput {
            width: 250px;
          }
          .updata {
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
        .paginationBox {
          margin-top: 15px;
          text-align: right;
        }
        .monitor-dialog {
          .listenerPort {
            .el-select {
              width: 100px;
            }
          }
          .monitor-content {
            height: 300px;
            padding-top: 15px;
            .el-input,
            .el-select {
              width: 160px;
            }
            .stepWidth {
              .el-input {
                width: 100%;
              }
            }
            .el-slider__runway {
              width: 250px;
              margin-left: 20px;
            }
          }
        }
        .host-dialog {
          .host-content {
            .host-title {
              line-height: 50px;
              color: #003b80;
              border: 1px solid #97c7ff;
              border-radius: 2px;
              background: #e5f0ff;
            }
            .transfer {
              width: 500px;
              margin: 30px auto;
            }
          }
        }
        .weight-dialog {
          .weight-content {
            text-align: center;
            padding: 25px;
          }
        }
        .host-footer {
          text-align: center;
          display: block;
        }
      }
    }
  }
}
</style>
