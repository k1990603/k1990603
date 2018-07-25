<template>
  <div class="projectManagePage">
    <div class="defaultScope">
      <div class="curPage">项目管理</div>
      <selectComponent @getSelect="getSelect"></selectComponent>
    </div>
    <div class="btnList">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="lesseeCreate">创建</el-button>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="inputSearch"></i>
            </span>
            <span @click="editColum">
              <i class="el-icon-menu"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入项目名称" @change="inputSearch" size="small" v-model="searchBox.project_name" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="lesseeList">
      <el-table :data="projectList" :key='key' style="width: 100%" stripe v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading">
        <el-table-column prop="project_name" label="项目名称" min-width="150">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :key='columName.id' v-for='columName in formThead' :label="columName.name">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="quato" label="配额(CPU / MEM / DISK /VM/安全组/LB/专有网络/公网IP/公网带宽)" min-width="250px">
          <template slot-scope="scope">
            {{formateQuato(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click='deleteProject(scope.row.project_uuid)'>删除</el-button>
            <el-dropdown trigger="click" @command="someOperate">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type: 'editQuato', info: scope.row}">调整配额</el-dropdown-item>
                <el-dropdown-item :command="{type: 'editArea', info: scope.row}">调整区域</el-dropdown-item>
                <el-dropdown-item :command="{type: 'editInfo', info: scope.row}">修改信息</el-dropdown-item>
                <el-dropdown-item :command="{type: 'members', info: scope.row}">成员列表</el-dropdown-item>
                <el-dropdown-item :command="{type: 'addMember', info: scope.row}">添加成员</el-dropdown-item>
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
    <el-dialog title="删除项目" class='dialogTemplate' :visible.sync="projectStatu.delete" width="650px" center>
      <deleteDialog :deleteInfo="rowInfo" @delete='deleteResponse'></deleteDialog>
    </el-dialog>
    <el-dialog title="调整配额" top="8vh" :visible.sync="projectStatu.editQuato" width="650px" center>
      <editQuatoDialog :editInfo="rowInfo" @editQuato='editQuatoResponse'></editQuatoDialog>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="projectStatu.editInfo" width="650px" center>
      <editProjectInfo :projectInfo="rowInfo" @editInfoResponse="editInfoResponse"></editProjectInfo>
    </el-dialog>
    <el-dialog title="成员列表" :visible.sync="projectStatu.members" width="650px" center>
      <memberList :memberList="memberList" :projectInfo="rowInfo" @memberResponse="memberResponse" @deleteMember="deleteMember"></memberList>
    </el-dialog>

    <el-dialog title="添加成员" class="dialogTemplate" :visible.sync="projectStatu.add" width="650px" center>
      <addMember :rowInfo="rowInfo" @addMember="addMember"></addMember>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import tableColumNameDialog from './../../common/tableColumName'
import deleteDialog from './project/delete'
import editQuatoDialog from './project/editQuato'
import editProjectInfo from './project/editProjectInfo'
import selectComponent from './project/selectComponent'
import memberList from './project/projectMember'
import addMember from './project/addMember'

import {
  getProjectList,
  editProjectName,
  getProjectDetails,
  getUsers
} from '@/api/admin/lesseeManage'
import { formateQuato } from '@/filters/index'
const defaultFormThead = [
  { name: '用户数量', id: 'user_nums' },
  { name: '所有者', id: 'owner_name' },
  { name: '创建时间', id: 'created_at' },
  { name: '所属租户', id: 'tenant_name' }
]
export default {
  data() {
    return {
      loading: false,
      projectStatu: {
        delete: false, // 项目删除
        editQuato: false, // 编辑项目配额
        editInfo: false, // 编辑项目信息
        members: false, // 成员列表
        add: false // 添加成员
      },
      memberList: [], //项目成员列表
      deleteInfo: {}, //删除项目信息
      rowInfo: [], // 单行项目信息
      projectList: [], // 租户项目信息列表
      searchBox: {
        project_name: '', // 搜索字段
        tenant_uuid: '-1' // 筛选租户名称
      },
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      // 所有列名 供用户自定义
      columArr: [
        { name: '用户数量', id: 'user_nums' },
        { name: '所有者', id: 'owner_name' },
        { name: '创建时间', id: 'created_at' },
        { name: '所属租户', id: 'tenant_name' }
      ],
      // 默认选中的值
      checkArr: ['user_nums', 'owner_name', 'created_at', 'tenant_name'],
      // 表格数据
      key: 1, // table key
      formTheadOptions: [
        { name: '用户数量', id: 'user_nums' },
        { name: '所有者', id: 'owner_name' },
        { name: '创建时间', id: 'created_at' },
        { name: '所属租户', id: 'tenant_name' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      // 以下为测试数据
      dialogVisible: false,
      title: '' // someOperate的弹框名称
    }
  },
  created() {
    this.getDefaultProjectList()
  },
  mounted() {},
  methods: {
    getProjectList,
    editProjectName,
    formateQuato,
    getProjectDetails,
    getUsers,
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    getSelect(item) {
      //// 获取租户筛选项目
      this.searchBox.tenant_uuid = item.tenant_uuid
      if (item.tenant_uuid === '-1') {
        this.getDefaultProjectList()
      } else {
        this.getDefaultProjectList({ tenant_uuid: this.searchBox.tenant_uuid })
      }
      this.searchBox.project_name = ''
    },
    inputSearch() {
      if (
        this.searchBox.project_name === '' &&
        this.searchBox.tenant_uuid === '-1'
      ) {
        this.getDefaultProjectList()
      } else if (
        this.searchBox.tenant_uuid != '-1' &&
        this.searchBox.project_name == ''
      ) {
        this.getDefaultProjectList({
          tenant_uuid: this.searchBox.tenant_uuid
        })
      } else if (
        this.searchBox.tenant_uuid == '-1' &&
        this.searchBox.project_name != ''
      ) {
        this.getDefaultProjectList({
          project_name: this.searchBox.project_name
        })
      } else {
        this.getDefaultProjectList(this.searchBox)
      }
    },
    getOneProjectInfo(command) {
      this.getProjectDetails({ uuid: command.info.project_uuid }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.rowInfo = res.data.data
          this.projectStatu[command.type] = true
        }
      })
    },
    getProjectMembers(command) {
      this.getUsers({ uuid: command.info.project_uuid }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.memberList = res.data.data
          this.projectStatu.members = true
        }
      })
    },
    addMember() {
      this.projectStatu.add = false
      this.inputSearch()
    },
    someOperate(command) {
      switch (command.type) {
        case 'editQuato':
        case 'editInfo':
          this.getOneProjectInfo(command)
          break
        case 'editArea':
          this.$router.push({
            path: `/sf_cloud/workbench/editProjectHostpool/${
              command.info.project_uuid
            }`,
            query: { rowInfo: JSON.stringify(command.info) }
          })
          break
        case 'members':
          this.rowInfo = command.info
          this.getProjectMembers(command)
          break
        case 'addMember':
          this.rowInfo = command.info
          this.projectStatu.add = true
          break
      }
    },
    deleteMember(info) {
      // 删除项目成员相应
      this.getUsers({ uuid: info.info.project_uuid }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.memberList = res.data.data
        }
      })
    },
    memberResponse() {
      this.projectStatu.members = false
      this.inputSearch()
    },
    editInfoResponse() {
      this.projectStatu.editInfo = false
      this.inputSearch()
    },
    // 修改配额
    editQuatoResponse() {
      this.projectStatu.editQuato = false
      this.inputSearch()
    },
    // 删除项目
    deleteProject(uuid) {
      this.getProjectDetails({ uuid: uuid }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.rowInfo = res.data.data
          this.projectStatu.delete = true
        }
      })
    },
    deleteResponse() {
      this.projectStatu.delete = false
      this.inputSearch()
    },
    handleSearch() {},
    getDefaultProjectList(search) {
      this.loading = true
      this.getProjectList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        user_role: '1',
        search: JSON.stringify(search) || ''
      }).then(res => {
        this.loading = false
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          res.data.data.rows.forEach(item => {
            item.edit = false
          })
          this.projectList = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.inputSearch()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.inputSearch()
    },
    lesseeCreate() {
      this.$router.push('/sf_cloud/workbench/projectCreate')
    },
    // 设置用户自定的列显示
    setColum(columNew) {
      this.checkboxVal = columNew
    },
    editColum() {
      this.updateTableCloum(true)
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
    tableColumNameDialog,
    deleteDialog,
    editQuatoDialog,
    editProjectInfo,
    memberList,
    addMember
  }
}
</script>
<style lang="less">
.projectManagePage {
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
    .curPage {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      line-height: 50px;
      // font-weight: 400;
      font-weight: 700;
      margin-right: 20px;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .lesseeList {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
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
}
</style>
