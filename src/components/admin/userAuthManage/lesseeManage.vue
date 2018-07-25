<template>
  <div class="lesseePage">
    <div class="defaultScope">
      <div class="curPage">租户管理</div>
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
              <i class="el-icon-refresh" @click="searchLessee"></i>
            </span>
            <span @click="editColum">
              <i class="el-icon-menu"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入租户名称" size="small" v-model="name" prefix-icon="el-icon-search" @change="searchLessee">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="lesseeList">
      <el-table v-loading="lesseeStatu.listLoading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" :data="lesseeList" :key='key' style="width: 100%" stripe>
        <el-table-column prop="tenantname" label="租户名称" min-width="200">
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.edit">
              <el-input class="edit-input" v-model="scope.row.tenantname"></el-input>
              <el-button v-if="scope.row.edit" type="text" @click="confirmEdit(scope.row)">Ok</el-button>
              <el-button class='cancel-btn' type="text" @click="cancelEdit(scope.row)">cancel</el-button>
            </div>
            <div v-else>
              <span>{{ scope.row.tenantname }}</span>
              <el-button type="text" @click='scope.row.edit=!scope.row.edit' icon="el-icon-edit">Edit</el-button>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :key='columName.id' v-for='columName in formThead' :label="columName.name" min-width="100px">
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
            <el-button type="text" @click='deleteLessee(scope)'>删除</el-button>
            <el-dropdown trigger="click" @command="someOperate">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type: 'editQuato', info: scope.row}">调整配额</el-dropdown-item>
                <el-dropdown-item :command="{type: 'editArea', info: scope.row}">调整集群</el-dropdown-item>
                <el-dropdown-item :command="{type: 'editInfo', info: scope.row}">修改信息</el-dropdown-item>
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

    <el-dialog title="删除租户" class='dialogTemplate' :visible.sync="lesseeStatu.delete" width="650px" center>
      <deleteDialog :deleteInfo="rowInfo" @delete='deleteResponse'></deleteDialog>
    </el-dialog>

    <el-dialog title="调整配额" :visible.sync="lesseeStatu.editQuato" width="650px" center>
      <editQuatoDialog :editInfo="rowInfo" @editQuato='editQuatoResponse'></editQuatoDialog>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="lesseeStatu.lesseeInfoDiag" width="650px" center>
      <editLesseeInfo :lesseeInfo="rowInfo" @editResponse="editResponse"></editLesseeInfo>
    </el-dialog>

  </div>
</template>
<script>
import { mapActions } from 'vuex'
import tableColumNameDialog from './../../common/tableColumName'
import deleteDialog from './lessee/deleteLessee'
import editQuatoDialog from './lessee/editQuato'
import editLesseeInfo from './lessee/editLesseeInfo'

import {
  getLesseeList,
  editLesseeName,
  getLesseeInfo
} from '@/api/admin/lesseeManage'
import { formateQuato } from '@/filters/index'
const defaultFormThead = [
  { name: '项目数量', id: 'project_nums' },
  { name: '创建时间', id: 'created_at' }
]
export default {
  data() {
    return {
      name: '', // 搜索租户名称
      lesseeStatu: {
        listLoading: false, // 列表loading
        delete: false, // 删除租户弹窗状态
        editQuato: false, // 修改配额弹窗状态
        lesseeInfoDiag: false // 修改租户信息
      },
      lesseeList: [], // 列表数据
      paginationInfo: {
        // 分页
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      rowInfo: [], // 选中行的租户信息
      // 所有列名 供用户自定义
      columArr: [
        { name: '项目数量', id: 'project_nums' },
        { name: '创建时间', id: 'created_at' }
      ],
      // 默认选中的值
      checkArr: ['project_nums', 'created_at'],
      // 表格数据
      key: 1, // table key
      formTheadOptions: [
        { name: '项目数量', id: 'project_nums' },
        { name: '创建时间', id: 'created_at' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      areaList: [] // 所有区域信息
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getLesseeList,
    editLesseeName,
    formateQuato,
    getLesseeInfo,
    getLesseeInfo,
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    getList() {
      // 获取租户列表
      this.getLesseeList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: ''
      }).then(res => {
        this.lesseeStatu.listLoading = false
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          res.data.data.rows.forEach(item => {
            item.edit = false
          })
          this.lesseeList = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    // 删除租户
    deleteLessee(scope) {
      this.lesseeStatu.delete = true
      this.rowInfo = scope.row
    },
    deleteResponse() {
      this.lesseeStatu.delete = false
      this.getList()
    },
    // 租户创建
    lesseeCreate() {
      this.$router.push('/sf_cloud/workbench/lesseeCreate')
    },
    // // 确认以及取消修改名称
    // cancelEdit(row) {
    //   row.edit = false
    //   this.getList()
    // },
    // 编辑租户信息
    editResponse() {
      this.lesseeStatu.lesseeInfoDiag = false
      this.getList()
    },
    // confirmEdit(row) {
    //   let options = {
    //     uuid: row.uuid,
    //     name: row.tenantname
    //   }
    //   this.editLesseeName(options).then(res => {
    //     if (res.data.code != 0) {
    //       this.$message({
    //         type: 'error',
    //         message: res.data.msg
    //       })
    //     } else {
    //       row.edit = false
    //       this.$message({
    //         type: 'success',
    //         message: '修改成功'
    //       })
    //       this.getList()
    //     }
    //   })
    // },
    // 修改配额
    editQuatoResponse() {
      this.lesseeStatu.editQuato = false
      this.getList()
    },
    // 设置用户自定的列显示
    setColum(columNew) {
      this.checkboxVal = columNew
    },
    handleSizeChange(val) {
      this.lesseeStatu.listLoading = true
      this.paginationInfo.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.lesseeStatu.listLoading = true
      this.paginationInfo.currentPage = val
      this.getList()
    },
    // 获取指定租户的信息
    getOneInfo(uuid) {
      this.getLesseeInfo({ tenant_uuid: uuid }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.rowInfo = res.data.data
        }
      })
    },
    someOperate(command) {
      switch (command.type) {
        case 'editQuato':
          this.getOneInfo(command.info.uuid)
          this.lesseeStatu.editQuato = true
          break
        case 'editArea':
          this.$router.push(
            `/sf_cloud/workbench/editLesseeHostpool/${command.info.uuid}`
          )
          break
        case 'editInfo':
          this.getOneInfo(command.info.uuid)
          this.lesseeStatu.lesseeInfoDiag = true
          break
      }
    },
    editColum() {
      this.updateTableCloum(true)
    },
    // 搜索租户
    searchLessee() {
      this.getLesseeList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify({ name: this.name })
      }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          res.data.data.rows.forEach(item => {
            item.edit = false
          })
          this.lesseeList = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    }
  },
  watch: {
    checkboxVal(valArr) {
      console.log(valArr)
      this.checkArr = valArr
      this.getList()
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
    editLesseeInfo
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
