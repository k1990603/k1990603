<template>
  <div class="subNetPage">
    <div class="defaultScope">
      <div class="curPage">子网</div>
    </div>
    <div class="subNetBtn">
      <el-row>
        <el-col :span='18' :offset='6'>
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="searchSubNetNetworkName"></i>
            </span>
            <span>
              <i class="el-icon-menu" @click='editColum'></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入名称" size="small" style="width:300px;" @change='searchSubNetNetworkName' @keyup.enter.native="searchSubNetNetworkName" v-model="searchSubNetworkname">
              <el-select style="width:140px;" @change='searchSubNetNetworkName' v-model="selectKey" slot="prepend" placeholder="请选择">
                <el-option label="按子网名称" value="name"></el-option>
                <el-option label="按专有网络名称" value="p_name"></el-option>
              </el-select>
            </el-input>
            <el-select v-model='searchNetType' clearable @change='searchSubNetNetworkName' style="width:150px;" size="small">
              <el-option value="0" label='公有基础网络'></el-option>
              <el-option value="1" label='私有网络'></el-option>
              <el-option value="3" label='公有NAS网络'></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="subNetList">
      <el-table :data="tableData" style="width: 100%" :key='key' stripe>
        <el-table-column prop="name" label="名称" min-width="120" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="p_name" label="所属网络" min-width="150">
        </el-table-column>
        <el-table-column prop="network_status" label="状态" min-width="120">
          <template slot-scope='scope'>
            {{formateNetStatus(scope.row.network_status)}}
          </template>
        </el-table-column>
        <el-table-column prop="network_type" label="网络类型" min-width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.segment_type === '0' ? 'primary' : 'success'" close-transition>{{formateNetworkType(scope.row.segment_type)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :key='columName.id' min-width="120" :show-overflow-tooltip="true" v-for='columName in formThead' :label="columName.name">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <div class="btnBox">
              <span class="addArea operateBtn" @click="deleteDialogShow(scope)">
                <img src="/static/svg/delete.svg" alt="">
              </span>
              <span class="operateBtn" @click="editName(scope.row)">
                <img src="/static/svg/edit.svg" alt="">
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog width="500px" class='dialogTemplate' title="编辑子网名称" :visible.sync="childNetStatu.edit" center>
      <el-form :model="editNameForm" :rules="rules" ref="editForm" label-width="120px">
        <el-form-item label="专有网络名称" prop="name" required>
          <el-input type="text" v-model="editNameForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除子网" class='dialogTemplate' :visible.sync="childNetStatu.delete" width="650px" center>
      <deleteSubNetDialog :deleteInfo="rowInfo" @delete='deleteResponse'></deleteSubNetDialog>
    </el-dialog>
    <editSubNetName></editSubNetName>
    <tableColumNameDialog :columArr='columArr' :checkArr='checkArr' @sendColum='setColum'></tableColumNameDialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import deleteSubNetDialog from './subNet/deleteSubNet'
import editSubNetName from './subNet/editSubNetName'
import {
  formateNetworkType,
  checkUserName,
  formateNetStatus
} from './../../../filters/index'
import {
  getSubNetWorkList,
  editSubNetworkName
} from './../../../api/admin/netWork'
import tableColumNameDialog from './../../common/tableColumName'
const defaultFormThead = [
  { name: '可用IP', id: 'ip_num' },
  { name: '云主机数量', id: 'instance_num' },
  { name: '所属租户', id: 'tenant_name' },
  { name: '所属机区域', id: 'area_name' },
  { name: '所属机房', id: 'datacenter_name' },
  { name: '所属集群', id: 'hostcluster_name' }
]
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入名称'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('名称由字母大小写字母+数字6位以上'))
      }
      callback()
    }
    return {
      editNameForm: {
        uuid: '',
        name: ''
      },
      rules: {
        name: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ]
      },
      // 所有列名 供用户自定义
      columArr: [
        { name: '可用IP', id: 'ip_num' },
        { name: '云主机数量', id: 'instance_num' },
        { name: '所属租户', id: 'tenant_name' },
        { name: '所属机区域', id: 'area_name' },
        { name: '所属机房', id: 'datacenter_name' },
        { name: '所属集群', id: 'hostcluster_name' }
      ],
      // 默认选中的值
      checkArr: [
        'ip_num',
        'instance_num',
        'tenant_name',
        'area_name',
        'datacenter_name',
        'hostcluster_name'
      ],
      // 表格数据
      key: 1, // table key
      formTheadOptions: [
        { name: '可用IP', id: 'ip_num' },
        { name: '云主机数量', id: 'instance_num' },
        { name: '所属租户', id: 'tenant_name' },
        { name: '所属机区域', id: 'area_name' },
        { name: '所属机房', id: 'datacenter_name' },
        { name: '所属集群', id: 'hostcluster_name' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      // 创建组件的显示隐藏
      childNetStatu: {
        edit: false,
        delete: false, // 删除网络弹窗状态
        vlan: false // 编辑Vlan专有网络状态
      },
      searchNetType: '', // 专有网络类型
      selectKey: 'name', // 按什么名称搜
      searchSubNetworkname: '',
      ruleForm: '', //修改vlan信息
      rowInfo: [], // 选中行的租户信息
      tableData: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      }
    }
  },
  mounted() {
    this.getList({ tenant_uuid: this.userInfo.tenantInfo.tenant_uuid })
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    formateNetStatus,
    checkUserName,
    getSubNetWorkList,
    editSubNetworkName,
    formateNetworkType,
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    editName(scope) {
      this.editNameForm.uuid = scope.uuid
      this.editNameForm.name = scope.name
      this.childNetStatu.edit = true
    },
    setColum(columNew) {
      this.checkboxVal = columNew
    },
    // 设置用户自定的列显示
    editColum() {
      this.updateTableCloum(true)
    },
    // 筛选
    getList(search) {
      // debugger
      this.getSubNetWorkList({
        role_type: '1',
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || ''
        // search: {tenant_name:JSON.stringify(search)} || ''
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
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    forSelect() {},
    getSelVal(val) {
      // console.log(val)
    },
    handleClick(row) {
      // console.log(row)
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.searchSubNetNetworkName()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.searchSubNetNetworkName()
    },
    // 确认修改用户名称
    confirmEdit(row) {
      let options = {
        uuid: row.uuid,
        name: row.name
      }
      this.editSubNetworkName(options).then(res => {
        if (res.data.code === 0) {
          row.edit = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.searchSubNetNetworkName()
        }
      })
    },
    cancel() {
      this.childNetStatu.edit = false
      this.searchSubNetNetworkName()
    },
    // 确认修改用户名称
    confirmEdit(row) {
      let options = {
        uuid: this.editNameForm.uuid,
        name: this.editNameForm.name
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editSubNetworkName(options).then(res => {
            if (res.data.code === 0) {
              this.childNetStatu.edit = false
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.searchSubNetNetworkName()
            }
          })
        }
      })
    },
    deleteResponse() {
      this.childNetStatu.delete = false
      this.searchSubNetNetworkName()
    },
    deleteDialogShow(scope) {
      this.rowInfo = scope.row
      this.childNetStatu.delete = true
    },
    searchSubNetNetworkName() {
      //搜索框
      let options = {
        tenant_uuid: this.userInfo.tenantInfo.tenant_uuid,
        segment_type: this.searchNetType
      }
      options[this.selectKey] = this.searchSubNetworkname
      this.getList(options)
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
    deleteSubNetDialog,
    editSubNetName,
    tableColumNameDialog
  }
}
</script>
<style lang="less">
.subNetPage {
  position: relative;
  .defaultScope {
    .el-cascader {
      width: 400px !important;
    }
  }
  .subNetBtn {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
    .batchBtn,
    .searchBtn,
    .selectArea,
    .columSel {
      display: inline-block;
    }
    .searchBtn {
      float: right;
    }
    .selectArea {
      float: right;
      margin-right: 10px;
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
  .subNetList {
    margin-top: 10px;
    .operateBtn {
      cursor: pointer;
      padding: 0 5px;
      i {
        font-size: 18px;
        color: #0783f6;
      }
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
