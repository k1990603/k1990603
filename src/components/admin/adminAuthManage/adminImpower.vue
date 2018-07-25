<template>
  <div class="adminImpowerPage">
    <div class="defaultScope">
      <div class="curPage">区域授权</div>
    </div>
    <div class="btnList">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="batchBtn" :class="{hasNoCreate:!(env == 'development')}">
            <el-button v-if="(env == 'development')" type="primary" size="small" @click="adminGroupCreate">创建</el-button>
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
            <el-input placeholder="请输入组名" v-model='search.search_name' size="small" prefix-icon="el-icon-search" @blur="getDefaultList">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="adminImpowerList">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="name" label="管理组名称">
        </el-table-column>
        <el-table-column prop="group_user_num" label="成员数量">
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="owner_name" label="所有者" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.ownerid +'-'+ scope.row.owner_name}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click='deleteGroup(scope.row)'>删除</el-button>
            <el-dropdown trigger="click" @command="someOperate">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type:'editOwner',info:scope.row}">修改所有者</el-dropdown-item>
                <el-dropdown-item :command="{type:'editArea',info:scope.row}">调整区域</el-dropdown-item>
                <el-dropdown-item :command="{type:'member',info:scope.row}">成员列表</el-dropdown-item>
                <el-dropdown-item :command="{type:'addUser',info:scope.row}">添加成员</el-dropdown-item>
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
    <el-dialog title="删除组" class='dialogTemplate' :visible.sync="groupStatu.delete" width="650px" center>
      <deleteDialog :deleteInfo="rowInfo" @delete='deleteResponse'></deleteDialog>
    </el-dialog>

    <el-dialog title="修改所有者" class='dialogTemplate' :visible.sync="groupStatu.editOwner" width="650px" center>
      <editOwnerDialog :rowInfo="rowInfo" @editOwner='editResponse' :memberList="memberList"></editOwnerDialog>
    </el-dialog>
    <el-dialog title="成员列表" class='dialogTemplate' :visible.sync="groupStatu.showMember" width="650px" center>
      <memberList :memberList="memberList" :rowInfo='rowInfo' @memberRes="memberRes" @deletememberRes="deletememberRes"></memberList>
    </el-dialog>

    <el-dialog title="添加成员" class='dialogTemplate' :visible.sync="groupStatu.add" width="650px" center>
      <addDialog :rowInfo='rowInfo' @addmemberRes="addmemberRes"></addDialog>
    </el-dialog>

  </div>
</template>
<script>
import {
  getGroupList,
  editName,
  getMembers
} from '@/api/admin/adminGroupManage'
import { mapGetters, mapActions } from 'vuex'
import addDialog from './common/addAdminMember'
import deleteDialog from './common/deleteInfo'
import memberList from './common/memberList'
import editOwnerDialog from './common/editInfo'
import store from './../../../state'

export default {
  data() {
    return {
      env: '',
      memberList: [], // 成员列表
      groupStatu: {
        delete: false, // 删除
        editOwner: false, // 修改所有者
        showMember: false, // 成员列表
        add: false // 添加用户
      },
      rowInfo: [],
      tableData: [], //列表数据
      search: {
        search_name: ''
      },
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      // 以下为测试数据
      store,
      deleteInfo: {
        title: '删除管理员组',
        info: [
          { label: '名称', value: 'text_ii' },
          { label: '用户数量', value: 5 },
          {
            label: '所有者',
            value: '80002473'
          }
        ]
      },
      title: '' // someOperate的弹框名称
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  mounted() {
    this.env = process.env.NODE_ENV
    this.getDefaultList()
  },
  methods: {
    editName,
    getGroupList,
    getMembers,
    deleteGroup(row) {
      this.rowInfo = row
      this.groupStatu.delete = true
    },
    deletememberRes() {
      this.getDefaultMemberList(this.rowInfo)
    },
    addmemberRes() {
      this.groupStatu.add = false
      this.getDefaultList()
    },
    memberRes() {
      this.groupStatu.showMember = false
      this.getDefaultList()
    },
    editResponse() {
      this.groupStatu.editOwner = false
      this.getDefaultList()
    },
    deleteResponse() {
      this.groupStatu.delete = false
      this.getDefaultList()
    },
    getDefaultMemberList(info) {
      this.getMembers({
        group_id: info.id
      }).then(res => {
        if (res.data.code != 0) {
          this.memberList = []
        } else {
          this.memberList = res.data.data
        }
      })
    },
    someOperate(command) {
      switch (command.type) {
        case 'editOwner':
          this.rowInfo = command.info
          this.getDefaultMemberList(command.info)
          this.groupStatu.editOwner = true
          break
        case 'editArea':
          this.$router.push({
            path: `/sf_cloud/workbench/adminArea/${command.info.uuid}`,
            query: { rowInfo: JSON.stringify(command.info) }
          })

        case 'member':
          this.groupStatu.showMember = true
          // this.groupOwner = command.info.owner_name
          this.rowInfo = command.info
          this.getDefaultMemberList(command.info)
          break
        case 'addUser':
          this.rowInfo = command.info
          this.groupStatu.add = true
          break
      }
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
      if (this.search.search_name == '') {
        search = ''
      } else {
        search = { name: this.search.search_name }
      }
      this.getGroupList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: search
      }).then(res => {
        if (res.data.code != 0) {
          this.tableData = []
        } else {
          res.data.data.rows.forEach(item => {
            item.edit = false
          })
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    adminGroupCreate() {
      this.$router.push('/sf_cloud/workbench/adminCreate')
    }
  },
  watch: {},
  components: {
    addDialog,
    deleteDialog,
    memberList,
    editOwnerDialog
  }
}
</script>
<style lang="less">
.adminImpowerPage {
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
    .hasNoCreate {
      height: 1px;
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
  .adminImpowerList {
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
