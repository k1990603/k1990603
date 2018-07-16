<template>
  <div class="userPage">
    <div class="defaultScope">
      <div class="curPage">用户管理</div>
    </div>
    <div class="btnList">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="addUser">添加用户</el-button>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="getDefaultList"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入内容" v-model='search.user_id' @change="getDefaultList" size="small" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="userList">
      <el-table :data="tableData" style="width: 100%" stripe v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading">
        <el-table-column prop="user_id" label="工号" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class='nameLink' @click='toDetails(scope.row)'>{{ scope.row.user_id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="姓名" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" :show-overflow-tooltip="true">
        </el-table-column>
        <!-- <el-table-column prop="group_name" label="所属组" :show-overflow-tooltip="true">
        </el-table-column> -->
        <!-- <el-table-column prop="role_status" label="状态">
          <template slot-scope="scope">
            <span :class="{waringColor: scope.row.role_status=='1', errorColor:scope.row.role_status==null,
            normalColor:scope.row.role_status=='0'}">
              {{formateStatus(scope.row.role_status)}}
            </span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click='deleteUserSubmit(scope.row)'>删除</el-button>
            <el-dropdown trigger="click" @command="someOperate">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :disabled="scope.row.role_status==null ||scope.row.role_status=='0'" :command="{type:'activeUser',info:scope.row}">激活</el-dropdown-item> -->
                <!-- <el-dropdown-item :disabled="scope.row.role_status==null ||scope.row.role_status=='1'" :command="{type:'disableUser',info:scope.row}">禁用</el-dropdown-item> -->
                <el-dropdown-item :command="{type:'editInfo',info:scope.row}">修改信息</el-dropdown-item>
                <el-dropdown-item :command="{type:'allotGroup',info:scope.row}">分配至组</el-dropdown-item>
                <el-dropdown-item :command="{type:'changePwd',info:scope.row}">修改密码</el-dropdown-item>
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
    <el-dialog title="添加用户" class='dialogTemplate' :visible.sync="adminUserStatu.add" width="650px" center>
      <addUser @addUserRes="addUserRes" :groupList='groupList'></addUser>
    </el-dialog>

    <el-dialog :title="authTitle" class='dialogTemplate' :visible.sync="adminUserStatu.edit" width="650px" center>
      <editAminGroup @editProInfoRes="editProInfoRes" :userDel="userDel"></editAminGroup>
    </el-dialog>

    <el-dialog title="分配至组" class='dialogTemplate' :visible.sync="adminUserStatu.allotUser" width="650px" center>
      <allotGroup @allotInfoRes="allotInfoRes" :rowInfo="rowInfo"></allotGroup>
    </el-dialog>

    <el-dialog title="删除用户" class='dialogTemplate' :visible.sync="adminUserStatu.delete" width="650px" center>
      <deleteUser :rowInfo="rowInfo" @deleteRes="deleteRes"></deleteUser>
    </el-dialog>
    <el-dialog :title="authTitle" class='dialogTemplate' :visible.sync="adminUserStatu.change" width="650px" center>
      <changePwd :rowInfo="rowInfo" @changeRes="changeRes"></changePwd>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAviableGroup,
  getAllAdminUser,
  getAdminUserInfo
} from '@/api/admin/adminGroupManage'
import { formateStatus } from '@/filters/index'
import addUser from './common/addNewUser'
import authUser from './common/authUser'
import editAminGroup from './common/editAdminUserInfo'
import allotGroup from './common/allotGroup'
import deleteUser from './common/deleteAdminUser'
import changePwd from './common/changePwd'

export default {
  data() {
    return {
      groupList: [],
      userDel: {}, // 外部用户详情
      authTitle: '', // 激活禁用的弹窗名称
      loading: false,
      adminUserStatu: {
        add: false,
        delete: false,
        authUser: false,
        allotUser: false,
        edit: false,
        change: false
      },
      rowInfo: [],
      tableData: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      search: {
        user_id: ''
      }
    }
  },
  created() {
    this.getDefaultList()
  },
  methods: {
    getAviableGroup,
    getAdminUserInfo,
    formateStatus,
    getAllAdminUser,
    someOperate(command) {
      switch (command.type) {
        case 'editInfo':
          this.authTitle = '修改信息'
          this.getAdminUserInfo({ user_id: command.info.user_id }).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.userDel = res.data.data
              this.adminUserStatu.edit = true
            }
          })
          break
        case 'allotGroup':
          this.rowInfo = command.info
          this.adminUserStatu.allotUser = true
          break
        case 'changePwd':
          this.authTitle = '修改密码'
          this.rowInfo = command.info
          this.adminUserStatu.change = true
      }
    },
    deleteRes() {
      this.adminUserStatu.delete = false
      this.getDefaultList()
    },
    allotInfoRes() {
      this.adminUserStatu.allotUser = false
      this.getDefaultList()
    },
    editProInfoRes() {
      this.adminUserStatu.edit = false
      this.getDefaultList()
    },
    // authUserRes() {
    //   this.adminUserStatu.authUser = false
    //   this.getDefaultList()
    // },
    addUser() {
      this.getAviableGroup().then(res => {
        if (res.data.code == 0) {
          this.groupList = res.data.data
          this.adminUserStatu.add = true
        }
      })
    },
    addUserRes() {
      this.adminUserStatu.add = false
      this.getDefaultList()
    },
    changeRes() {
      this.adminUserStatu.change = false
      this.getDefaultList()
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
      this.loading = true
      let search = ''
      if (this.search.user_id == '') {
        search = ''
      } else {
        search = { user_id: this.search.user_id }
      }
      this.getAllAdminUser({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: search || ''
      }).then(res => {
        this.loading = false
        if (res.data.code != 0) {
          this.tableData = []
          this.paginationInfo.total = 0
        } else {
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    deleteUserSubmit(row) {
      this.rowInfo = row
      this.adminUserStatu.delete = true
    },
    toDetails(row) {
      this.$router.push(
        `/sf_cloud/workbench/adminDetails/${row.user_id} ${row.user_name}`
      )
    }
  },
  watch: {},
  components: {
    deleteUser,
    addUser,
    authUser,
    editAminGroup,
    allotGroup,
    changePwd
  }
}
</script>
<style lang="less">
.userPage {
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
  .userList {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    .nameLink {
      cursor: pointer;
      color: #0778fd;
      font-weight: 500;
    }
    .waringColor {
      color: #9b153e;
    }
    .errorColor {
      color: #f00;
    }
    .normalColor {
      color: #2277da;
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
}
</style>
