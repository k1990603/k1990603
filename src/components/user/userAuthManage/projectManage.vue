<template>
  <div class="lesseePage">
    <div class="defaultScope">
      <div class="curPage">项目管理</div>
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
              <i class="el-icon-refresh" @click="getDefaultList"></i>
            </span>
            <span @click="editColum">
              <i class="el-icon-menu"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入内容" @blur="getDefaultList" v-model='search.project_name' size="small" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="lesseeList">
      <el-table :data="projectList" :key='key' style="width: 100%" stripe>
        <el-table-column prop="project_name" label="项目名称" min-width="200">
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.edit">
              <el-input class="edit-input" size="small" v-model="scope.row.project_name"></el-input>
              <el-button v-if="scope.row.edit" type="text" @click="confirmEdit(scope.row)">Ok</el-button>
              <el-button class='cancel-btn' type="text" @click="cancelEdit(scope.row)">cancel</el-button>
            </div>
            <div v-else>
              <span>{{ scope.row.project_name }}</span>
              <el-button type="text" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">Edit</el-button>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" min-width="120" :key='columName.id' v-for='columName in formThead' :label="columName.name">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column prop="quato" :show-overflow-tooltip="true" label="配额(CPU / MEM / DISK /VM/安全组/LB/专有网络/公网IP/公网带宽)" min-width="250px">
          <template slot-scope="scope">
            {{formateQuato(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click='deletePro(scope.row)'>删除</el-button>
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

    <el-dialog title="删除项目" class='dialogTemplate' :visible.sync="projectStau.delete" width="650px" center>
      <deleteDialog :deleteInfo="rowInfo" @delete='deleteResponse'></deleteDialog>
    </el-dialog>
    <el-dialog title="调整配额" top="8vh" :visible.sync="projectStau.editQuato" width="650px" center>
      <editQuatoDialog :editInfo="rowInfo" @editQuato='editQuatoResponse'></editQuatoDialog>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="projectStau.editInfo" width="650px" center>
      <editProjectInfo :projectInfo="rowInfo" @editInfoResponse="editInfoResponse"></editProjectInfo>
    </el-dialog>
    <el-dialog title="成员列表" class="dialogTemplate" :visible.sync="projectStau.members" width="650px" center>
      <memberList :memberList="members" :projectInfo="rowInfo" @memberResponse="memberResponse" @deleteMember="deleteMember"></memberList>
    </el-dialog>

    <el-dialog title="添加成员" class="dialogTemplate" :visible.sync="projectStau.add" width="650px" center>
      <addMember :rowInfo="rowInfo" @addMemberRes="addMemberRes"></addMember>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import tableColumNameDialog from './../../common/tableColumName'
import deleteDialog from './common/deleteCom'
import editQuatoDialog from './common/editQuato'
import editProjectInfo from './project/editProjectInfo'
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
  { name: '所有者ID', id: 'ownerid' },
  { name: '所有者名称', id: 'owner_name' },
  { name: '所属租户', id: 'tenant_name' }
]
export default {
  data() {
    return {
      members: [],
      rowInfo: {},
      projectStau: {
        delete: false,
        editQuato: false,
        editInfo: false,
        members: false,
        add: false
      },
      projectList: [], // 列表数据
      search: {
        // 租户ID为头部默认选中的租户
        tenant_uuid: '',
        project_name: ''
      },
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      title: '', // someOperate的弹框名称
      // 所有列名 供用户自定义
      columArr: [
        { name: '用户数量', id: 'user_nums' },
        { name: '所有者ID', id: 'ownerid' },
        { name: '所有者', id: 'owner_name' },
        { name: '创建时间', id: 'created_at' },
        { name: '所属租户', id: 'tenant_name' }
      ],
      // 默认选中的值
      checkArr: ['owner_name', 'ownerid', 'tenant_name'],
      // 表格数据
      key: 1, // table key
      formTheadOptions: [
        { name: '用户数量', id: 'user_nums' },
        { name: '所有者ID', id: 'ownerid' },
        { name: '所有者名称', id: 'owner_name' },
        { name: '创建时间', id: 'created_at' },
        { name: '所属租户', id: 'tenant_name' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead // 默认表头 Default header
    }
  },
  mounted() {
    this.search.tenant_uuid = this.userInfo.tenantInfo.tenant_uuid
    this.getDefaultList()
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
      showTableCloum: 'getTableCloum'
    })
  },
  methods: {
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    getProjectList,
    editProjectName,
    getProjectDetails,
    getUsers,
    formateQuato,
    someOperate(command) {
      switch (command.type) {
        case 'editQuato':
          this.rowInfo = command.info
          this.projectStau.editQuato = true
          break
        case 'editArea':
          this.$router.push({
            path: `/sf_cloud/workbench/editProArea/${
              command.info.project_uuid
            }`,
            query: { rowInfo: JSON.stringify(command.info) }
          })
          break
        case 'editInfo':
          this.rowInfo = command.info
          this.projectStau.editInfo = true
          break
        case 'members':
          this.getOneProMembers(command.info)
          this.rowInfo = command.info
          this.projectStau.members = true
          break
        case 'addMember':
          this.rowInfo = command.info
          this.projectStau.add = true
          break
      }
    },
    deletePro(row) {
      this.rowInfo = row
      this.projectStau.delete = true
    },
    addMemberRes() {
      this.projectStau.add = false
      this.getDefaultList()
    },
    getOneProMembers(info) {
      this.getUsers({ uuid: info.project_uuid }).then(res => {
        if (res.data.code != 0) {
          this.members = []
        } else {
          this.members = res.data.data
        }
      })
    },
    deleteMember() {
      this.getOneProMembers(this.rowInfo)
    },
    memberResponse() {
      this.projectStau.members = false
      this.getDefaultList()
    },
    editInfoResponse() {
      this.projectStau.editInfo = false
      this.getDefaultList()
    },
    editQuatoResponse() {
      this.projectStau.editQuato = false
      this.getDefaultList()
    },
    deleteResponse() {
      this.projectStau.delete = false
      this.getDefaultList()
    },
    editColum() {
      this.updateTableCloum(true)
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getDefaultList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getDefaultList()
    },
    getDefaultList() {
      let search = ''
      if (this.search.project_name != '') {
        search = { project_name: this.search.project_name }
      } else {
        search = {}
      }
      this.getProjectList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        user_role: 2,
        tenant_uuid: this.userInfo.tenantInfo.tenant_uuid,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
          this.projectList = []
        } else {
          res.data.data.rows.forEach(item => {
            item.edit = false
          })
          this.projectList = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    lesseeCreate() {
      this.$router.push('/sf_cloud/workbench/userProjectCreate')
    },
    // 设置用户自定的列显示
    setColum(columNew) {
      this.checkboxVal = columNew
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
.lesseePage {
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
