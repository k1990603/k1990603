<template>
  <div class="safeGroupTemplatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      {{securityName}} 规则设置
    </div>
    <div class="ruleTabs">
      <el-tabs tab-position="top" v-model="rulePos" style="height: 200px;" @tab-click='tabClick'>
        <el-tab-pane label="入站规则" name="first">
        </el-tab-pane>
        <el-tab-pane label="出站规则" name="second"></el-tab-pane>
      </el-tabs>
      <div class="ruleList">
        <div class="ruleBtnBox">
          <el-button type="primary" @click='addSomeRules' size="small" :disabled="isDrag || isEdit ||isInsert ||  (multipleSelection.length>0)">添加规则</el-button>
          <a>
            <el-button @click='downloadTmpTrigger' type="default" size="small" :disabled="isDrag || isEdit || isInsert || (multipleSelection.length>0)">下载模板</el-button>
          </a>
          <span style='display: inline-block;'>
            <el-upload :headers="{'currentUserInfo':currentUserInfo}" :action="uploadInfo.importFileUrl" :file-list='[]' :data="uploadInfo.upLoadData" :onError="uploadError" :onSuccess="uploadSuccess" :beforeUpload="beforeAvatarUpload">
              <el-button type="default" size="small" :disabled="isDrag || isEdit || isInsert || (multipleSelection.length>0)">导入规则</el-button>
            </el-upload>
          </span>
          <a>
            <el-button @click='downloadRuleTrigger' type="default" size="small" :disabled="isDrag || isEdit || isInsert || (multipleSelection.length>0)">下载规则</el-button>
          </a>
          <el-button type="default" size="small" :disabled="isDrag || isEdit ||isInsert ||  (multipleSelection.length>0)" @click="updateSort">排序</el-button>

          <el-button type="default" size="small" @click="deleteTrigger" :disabled='!(multipleSelection.length>0)'>删除</el-button>
        </div>
        <el-table @selection-change="handleSelectionChange" :data="list" style="width: 100%" stripe>
          <el-table-column v-show="isDrag" type="selection" width="55" :selectable="selectable">
          </el-table-column>
          <el-table-column prop="protocol" label="协议" min-width="120">
            <template slot-scope='scope'>
              <span v-if="!scope.row.edit">{{formatProtocol(scope.row.protocol)}}</span>
              <el-select v-else size='small' @change="getChange(scope)" v-model="scope.row.protocol" placeholder="请选择">
                <el-option label="ALL" value="0">
                </el-option>
                <el-option label="TCP" value="1">
                </el-option>
                <el-option label="UDP" value="2">
                </el-option>
                <el-option label="ICMP" value="3">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="cidr" label="CIDR" min-width="120">
            <template slot-scope='scope'>
              <span v-if="!scope.row.edit">{{scope.row.cidr}}</span>
              <el-input v-else type="text" size='small' v-model.trim='scope.row.cidr' placeholder="如10.0.0.0/16"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="start_port" label="开始端口" min-width='100'>
            <template slot-scope='scope'>
              <span v-if="!scope.row.edit">{{scope.row.start_port}}</span>
              <el-input v-else type="text" :placeholder="scope.row.noPort?'':'0-65535的整数'" :disabled="scope.row.noPort" size='small' v-model.trim='scope.row.start_port'></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="end_port" label="结束端口" min-width='100'>
            <template slot-scope='scope'>
              <span v-if="!scope.row.edit">{{scope.row.end_port}}</span>
              <el-input v-else type="text" :placeholder="scope.row.noPort?'':'0-65535的整数'" :disabled="scope.row.noPort" size='small' v-model.trim='scope.row.end_port'></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="备注" min-width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{scope.row.description}}</span>
              <el-input v-else type="text" size='small' v-model.trim='scope.row.description'></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <div v-if="!scope.row.edit" class="templateBtn">
                <el-button type="text" size="small" @click="editRow(scope)" :disabled='isEdit||isInsert || isDrag || (multipleSelection.length>0)'>编辑</el-button>
                <el-dropdown trigger="click" style="margin:0 5px;" @command="handleCommand">
                  <span class="el-dropdown-link">
                    插入
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{type:0,info:scope}" :disabled='isEdit||isDrag || isInsert || (multipleSelection.length>0)'>向上添加一行</el-dropdown-item>
                    <el-dropdown-item :command="{type:1,info:scope}" :disabled='isEdit||isDrag || isInsert || (multipleSelection.length>0)'>向下添加一行</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="text" size="small" :disabled='isEdit||isDrag || isInsert || (multipleSelection.length>0)' @click="deleteRowRule(scope.row)">删除</el-button>
                <i class="el-icon-rank drag-handler" v-show='isDrag'></i>
              </div>
              <div class="saveEditRow" v-else>
                <el-button type='text' @click="confirmEdit(scope)">保存</el-button>
                <el-button type='text' @click="cancelEdit(scope)">取消</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div> -->
      <div class='saveSortBtn' v-if="isDrag">
        <el-button type='primary' size='small' @click="saveSort">保存</el-button>
        <el-button type='default' size='small' @click="updateSort">取消</el-button>
      </div>
    </div>
    <!-- 添加出入站规则 -->
    <el-dialog title="添加入站规则" @close='handleClose' class='dialogTemplate' :visible.sync="ruleDialogStatu.add" width="960px" center>
      <addRules @addRes="addRes" :showId='showId' :ruleType='ruleType'></addRules>
    </el-dialog>
    <el-dialog title="删除规则" @close='handleClose' class='dialogTemplate' :visible.sync="ruleDialogStatu.delete" width="750px" center>
      <delteRules @deleteRes="deleteRes" :showId='showId' :ruleType='ruleType' :multipleSelection='multipleSelection'></delteRules>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  downLoadTmp,
  getAllRules,
  sortUpdate,
  deleteRule,
  editRule,
  insertRule,
  downLoadRules,
  upLoadRules
} from '@/api/admin/securityManage'
import {
  checkQuatoVal,
  checkIp,
  formatProtocol,
  downloadFile
} from '@/filters/index'
import Sortable from 'sortablejs'
import addRules from './addRules'
import delteRules from './deleteRules'
export default {
  data() {
    return {
      currentUserInfo: '',
      showId: 0,
      uploadInfo: {
        importFileUrl: '',
        upLoadData: ''
      },
      downLoadRulesTmp: '',
      downLoadRulesSrc: '',
      securityName: '',
      rulePos: 'first',
      id_pri: [],
      isInsert: false,
      isEdit: false, // 表格行内编辑
      isDrag: false,
      multipleSelection: [],
      ruleDialogStatu: {
        add: false,
        delete: false
      },
      ruleType: 0,
      list: [],
      oldList: [],
      newList: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      sortable: null
    }
  },
  created() {
    if (this.userInfo) {
      if (
        this.userInfo.curRole == '系统管理员' ||
        this.userInfo.curRole == '一般管理员'
      ) {
        this.currentUserInfo = JSON.stringify({ tab: '2' })
      } else if (this.userInfo.curRole == '用户') {
        this.currentUserInfo = JSON.stringify({
          tab: '1',
          tenant_uuid: this.userInfo.tenantInfo.tenant_uuid
        })
      }
    }
    this.getList()
    this.securityName = this.$route.query.name
    this.setUpLoadInfo()
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    downloadFile,
    downLoadTmp,
    upLoadRules,
    downLoadRules,
    insertRule,
    editRule,
    checkQuatoVal,
    checkIp,
    deleteRule,
    sortUpdate,
    formatProtocol,
    getAllRules,
    downloadTmpTrigger() {
      this.downLoadTmp().then(res => {
        this.downloadFile(res.data, '安全组模板')
      })
    },
    handleClose() {
      this.showId = this.showId + 1
      this.getList()
    },
    setUpLoadInfo() {
      this.uploadInfo.upLoadData = {
        owner_uuid: this.$route.params.uuid,
        type: this.ruleType,
        // bind_vm: JSON.stringify(this.getBindVm()),
        bind_vm: JSON.stringify({})
      }
      this.uploadInfo.importFileUrl = this.upLoadRules()
    },
    uploadError(response, file, fileList) {
      this.$message.error('上传失败')
    },
    uploadSuccess(response, file, fileList) {
      if (response.code == 0) {
        this.$message.success('上传成功')
        this.getList()
      } else {
        this.$message.error(response.msg)
      }
    },
    beforeAvatarUpload(file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      // const extension3 = file.name.split('.')[1] === 'doc'
      // const extension4 = file.name.split('.')[1] === 'docx'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!extension && !extension2) {
        console.log('上传模板只能是 xls、xlsx格式!')
      }
      if (!isLt2M) {
        console.log('上传模板大小不能超过 2MB!')
      }
      // return extension || extension2 || extension3 || (extension4 && isLt2M)
    },
    tabClick(tab, event) {
      switch (tab.name) {
        case 'first':
          this.ruleType = 0
          break
        case 'second':
          this.ruleType = 1
          break
      }
      this.setUpLoadInfo()
      this.getList()
    },
    downloadRuleTrigger() {
      this.downLoadRules({
        owner_uuid: this.$route.params.uuid,
        rule_type: this.ruleType
      }).then(res => {
        this.downloadFile(
          res.data,
          this.ruleType == 0 ? '入站规则表' : '出站规则表'
        )
      })
    },
    deleteTrigger() {
      this.ruleDialogStatu.delete = true
    },
    deleteRes() {
      this.ruleDialogStatu.delete = false
    },
    getBindVm() {
      let bind_vm = {}
      if (this.$route.query.isTmp) {
        bind_vm = JSON.stringify({})
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
        this.$route.query.nic_info.length > 0
          ? (bind_vm = JSON.stringify(bind_vm))
          : ''
      }
      return bind_vm
    },
    getChange(scope) {
      if (scope.row.protocol == 0 || scope.row.protocol == 3) {
        this.list[scope.$index].noPort = true
        this.list[scope.$index].start_port = ''
        this.list[scope.$index].end_port = ''
      } else {
        this.list[scope.$index].noPort = false
      }
    },
    deleteRowRule(row) {
      const h = this.$createElement
      this.$msgbox({
        title: '删除规则',
        center: true,
        message: h('p', null, [
          h('span', null, '确认执行删除规则操作？ '),
          h('i', { style: 'color: teal' }, '')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        let id_pri_lst = {}
        id_pri_lst[row.id] = row.priority
        this.deleteRule({
          owner_uuid: this.$route.params.uuid,
          bind_vm: this.getBindVm(),
          rule_type: this.ruleType,
          id_pri_lst: JSON.stringify(id_pri_lst)
        }).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
          }
        })
      })
    },
    selectable(row, index) {
      if (this.isDrag || this.isEdit || this.isInsert) {
        return false
      } else {
        return true
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addSomeRules() {
      this.ruleDialogStatu.add = true
    },
    addRes() {
      this.ruleDialogStatu.add = false
    },
    checkCidr(value) {
      if (value == '') {
        return { type: false, message: '请输入CIDR' }
      } else if (value.indexOf('/') >= 0) {
        let ip = value.split('/')[0]
        let netMask = parseInt(value.split('/')[1])
        if (netMask < 0 || netMask > 32) {
          return { type: false, message: 'CIDR中掩码为0-32中的整数' }
        }
        if (ip == '0.0.0.0') {
          return { type: true }
        } else if (!this.checkIp(ip)) {
          return { type: false, message: 'CIDR格式不正确(例：10.1.1.1/16)' }
        }
        return { type: true }
      } else {
        return { type: false, message: 'CIDR格式不正确(例：10.1.1.1/16)' }
      }
    },
    checkPort(value, scope) {
      if (value === '') {
        return { type: false, message: '请输入端口号' }
      } else if (!this.checkQuatoVal(value) || (value < 0 || value > 65535)) {
        return { type: false, message: '端口号必须是0-65535的整数' }
      } else if (
        parseInt(this.list[scope.$index].end_port) <
        parseInt(this.list[scope.$index].start_port)
      ) {
        return { type: false, message: '开始端口必须小于结束端口' }
      } else {
        return { type: true }
      }
    },
    confirmEdit(scope) {
      if (!this.checkCidr(this.list[scope.$index].cidr).type) {
        this.$message({
          type: 'error',
          message: this.checkCidr(this.list[scope.$index].cidr).message
        })
        return false
      }
      switch (this.list[scope.$index].protocol) {
        case '0':
        case '3':
          this.list[scope.$index].start_port = ''
          this.list[scope.$index].end_prot = ''
          break
        case '1':
        case '2':
          let start_messages = this.checkPort(
            this.list[scope.$index].start_port,
            scope
          )
          if (!start_messages.type) {
            this.$message({
              type: 'error',
              message: start_messages.message
            })
            return false
          }
          let end_messages = this.checkPort(
            this.list[scope.$index].end_port,
            scope
          )
          if (!end_messages.type) {
            this.$message({
              type: 'error',
              message: end_messages.message
            })
            return false
          }
          break
      }
      let options = {
        owner_uuid: this.$route.params.uuid,
        cidr: scope.row.cidr,
        protocol: scope.row.protocol,
        start_port: scope.row.start_port,
        end_port: scope.row.end_port,
        description: scope.row.description,
        type: this.ruleType,
        bind_vm: this.getBindVm()
      }
      if (scope.row.newRow) {
        options.pos = scope.row.pos
        options.priority = scope.row.priority
        options.rule_id = scope.row.rule_id
        this.insertRule(options).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '插入成功'
            })
            this.cancelEdit()
          }
        })
      } else {
        options.priority = scope.row.priority
        options.rule_id = scope.row.id
        this.editRule(options).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.cancelEdit()
          }
        })
      }
    },
    cancelEdit(scope) {
      this.getList()
      this.isEdit = false
      this.isInsert = false
    },
    editRow(scope) {
      this.isEdit = true
      scope.row.edit = true
    },
    goBack() {
      this.$router.go(-1)
    },
    getList(search) {
      this.getAllRules({
        owner_uuid: this.$route.params.uuid,
        // page_size: this.paginationInfo.pageSize,
        // page_no: this.paginationInfo.currentPage,
        rule_type: this.ruleType,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.id_pri = []
          this.paginationInfo.total = res.data.data.total
          res.data.data.rows.forEach(item => {
            this.id_pri.push({
              rule_id: item.id,
              old_pri: item.priority
            })
            if (item.protocol == 0 || item.protocol == 3) {
              item.noPort = true
              item.start_port = ''
              item.end_port = ''
            } else {
              item.noPort = false
            }
            item.edit = false
          })
          this.list = res.data.data.rows
          this.oldList = this.list.map(v => v.priority)
          this.newList = this.oldList.slice()
          this.$nextTick(() => {
            this.setSort()
          })
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getList()
    },
    // 拖拽排序
    setSort() {
      let that = this
      const el = document.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        disabled: !that.isDrag,
        onEnd: evt => {
          const targetRow = that.list.splice(evt.oldIndex, 1)[0]
          that.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = that.newList.splice(evt.oldIndex, 1)[0]
          that.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    updateSort() {
      this.getList()
      this.isDrag = !this.isDrag
    },
    saveSort() {
      for (var i in this.id_pri) {
        this.id_pri[i].new_pri = this.newList[i]
      }
      this.sortUpdate({
        owner_uuid: this.$route.params.uuid,
        bind_vm: this.getBindVm(),
        new_id_pri: JSON.stringify(this.id_pri)
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '规则优先级修改成功'
          })
        }
        this.updateSort()
      })
    },
    handleCommand(command) {
      this.isInsert = true
      let arr = {
        cidr: '',
        protocol: '1',
        start_port: '',
        end_port: '',
        description: '',
        edit: true,
        noPort: false,
        newRow: true,
        rule_id: command.info.row.id,
        priority: command.info.row.priority,
        pos: '' // 0 上 1 下 插入
      }
      switch (command.type) {
        case 0:
          arr.pos = 0
          this.list.splice(command.info.$index, 0, arr)
          break
        case 1:
          arr.pos = 1
          this.list.splice(command.info.$index + 1, 0, arr)
          break
      }
    }
  },
  components: {
    addRules,
    delteRules
  }
}
</script>
<style lang="less">
.safeGroupTemplatePage {
  min-height: 500px;
  background: #fff;
  padding-bottom: 30px;
  .sortable-ghost {
    opacity: 0.8;
    color: #fff !important;
    background: #42b983 !important;
  }
  & > .title {
    padding-left: 15px;
    height: 90px;
    line-height: 90px;
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
  .ruleTabs {
    padding: 0 20px;
    .el-tabs {
      height: inherit !important;
    }
    .templateBtn {
      .el-button--mini,
      .el-button--small {
        font-size: 16px;
      }
    }
    .ruleList {
      padding: 0 15px;
      .el-upload-list.el-upload-list--text {
        display: none;
      }
      .el-table {
        .el-button {
          padding: 0;
          font-size: 14px;
        }
        .el-dropdown-link {
          color: #409eff;
          cursor: pointer;
        }
        .drag-handler {
          font-size: 18px;
          color: #128dff;
          cursor: pointer;
        }
        .typeSelect {
          height: 27px;
          line-height: 15px;
          padding: 5px 24px 4px 6px;
          font-size: 12px;
        }
        .typeSelect1 {
          min-width: 120px;
        }
        .typeSelect2 {
          width: 60px;
          padding: 0;
        }
        .tableInput {
          width: 80%;
          height: 29px;
          font-size: 12px;
          padding-left: 5px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          box-sizing: border-box;
        }
        .remarkInput {
          width: 80%;
        }
      }
    }
    .paginationBox {
      margin-top: 15px;
      padding-right: 15px;
      text-align: right;
    }
    .saveSortBtn {
      border-top: 1px solid #ccc;
      padding: 15px 10px;
    }
  }
}
</style>

