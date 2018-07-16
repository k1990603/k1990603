<template>
  <div class="privatNetPage">
    <div class="defaultScope">
      <div class="curPage">专有网络</div>
      <selectComponent @getSelect="getSelect"></selectComponent>
    </div>
    <div class="privatNetBtn">
      <el-row>
        <el-col :xs="6" :sm="4" :md="4">
          <div class="privatNetBtnBtn">
            <el-button size="small" type="primary" @click='$router.push("/sf_cloud/workbench/privatNetCreate")'>
              新建专有网络
            </el-button>
          </div>
        </el-col>
        <el-col :xs="18" :sm="20" :md="20">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="searchNetworkName"></i>
            </span>
            <!-- <span @click="editColum">
              <i class="el-icon-menu"></i>
            </span> -->
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input style="width:150px;" placeholder="请输入专有网络名称" size="small" prefix-icon="el-icon-search" @change='searchNetworkName' @keyup.enter.native="searchNetworkName" clearable v-model="searchname">
            </el-input>
            <el-select v-model='searchNetType' clearable @change='searchNetworkName' style="width:150px;" size="small">
              <el-option value="0" label='公有基础网络'></el-option>
              <el-option value="1" label='私有网络'></el-option>
              <el-option value="2" label='管理员专用网络'></el-option>
              <el-option value="3" label='公有NAS网络'></el-option>
              <el-option value="4" label='模板机网络'></el-option>
              <el-option value="5" label='虚拟路由网络'></el-option>
              <el-option value="-1" label='外网网络'></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="privatNetList">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="name" label="名称" min-width="120" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="cidr" label="CIDR" :show-overflow-tooltip='true' min-width="120">
        </el-table-column>
        <el-table-column prop="network_status" label="状态" min-width="120">
          <template slot-scope='scope'>
            {{formateNetStatus(scope.row.network_status)}}
          </template>
        </el-table-column>
        <el-table-column prop="area_name" label="所属区域" min-width="120">
        </el-table-column>
        <el-table-column prop="sub_network_num" label="子网数量" min-width="120">
        </el-table-column>
        <el-table-column prop="instance_num" label="云主机数量" min-width="120">
        </el-table-column>
        <el-table-column prop="network_type" label="网络类型" min-width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.network_type === '0' ? 'primary' : 'success'" close-transition>{{formateNetworkType(scope.row.network_type)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tenant_name" label="所属租户" min-width="120">
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <div class="btnBox">
              <span class="operateBtn" @click="deleteDialogShow(scope)">
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

    <el-dialog title="删除专有网络" class='dialogTemplate' :visible.sync="privatStatu.delete" width="650px" center>
      <deleteDialog :deleteInfo="rowInfo" @delete='deleteResponse'></deleteDialog>
    </el-dialog>

    <el-dialog width="500px" class='dialogTemplate' title="编辑专有网络名称" :visible.sync="privatStatu.edit" center>
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
  </div>
</template>
<script>
import selectComponent from './selectComponent'
import { formateNetworkType, formateNetStatus } from './../../../filters/index'
import deleteDialog from './privateNet/deletePrivate'
import {
  getNetWorkList,
  getUserList,
  getTopAreaList,
  getsegment_init,
  editNetworkName
} from './../../../api/admin/netWork'
import { checkUserName } from '@/filters/index'
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
      isShow: false,
      copyArr: [],
      searchNetType: '', //搜索网络类型
      searchname: '', //搜索框
      privatStatu: {
        edit: false,
        delete: false // 删除网络弹窗状态
      },
      options: [
        {
          value: '1',
          label: '公有基础网络'
        },
        {
          value: '2',
          label: '私有网络'
        },
        {
          value: '3',
          label: '管理员专用网络'
        },
        {
          value: '4',
          label: '公有NAS网络'
        }
      ],
      value: '',
      selectAreaValue: '',
      rowInfo: [], // 选中行的租户信息
      networkvalue: '',
      userMeData: [], //租户信息
      tableData: [],
      SegmentInitList: [], //初始化init顶层用户信息
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      searchBox: {
        project_name: '', // 搜索字段
        tenant_uuid: '-1' // 筛选租户名称
      }
    }
  },
  mounted() {
    this.getList()
    this.getUserMeList()
  },
  methods: {
    formateNetStatus,
    checkUserName,
    getNetWorkList,
    formateNetworkType,
    getUserList,
    getTopAreaList,
    editNetworkName,
    editName(scope) {
      this.editNameForm.uuid = scope.uuid
      this.editNameForm.name = scope.name
      this.privatStatu.edit = true
    },
    cancel() {
      this.privatStatu.edit = false
      this.searchNetworkName()
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
      this.searchname = ''
    },
    getList(search) {
      // debugger
      this.getNetWorkList({
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
    selectArea(selectArea) {
      this.getList({
        area_uuid: selectArea
      })
    },
    getUserMeList() {
      this.getUserList().then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.userMeData = res.data.data
        }
      })
    },
    getSelVal(val) {
      // console.log(val)
    },
    handleClick(row) {
      // console.log(row)
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.searchNetworkName()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.searchNetworkName()
    },
    // 确认修改用户名称
    confirmEdit(row) {
      let options = {
        uuid: this.editNameForm.uuid,
        name: this.editNameForm.name
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editNetworkName(options).then(res => {
            if (res.data.code === 0) {
              this.privatStatu.edit = false
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.searchNetworkName()
            }
          })
        }
      })
    },
    // 删除租户
    deleteDialogShow(scope) {
      this.rowInfo = scope.row
      this.privatStatu.delete = true
    },
    deleteResponse() {
      this.privatStatu.delete = false
      this.searchNetworkName()
    },
    editColum() {
      // 编辑表单展示列
      this.searchNetworkName
    },
    searchNetworkName() {
      //搜索框
      this.getList({
        name: this.searchname,
        tenant_uuid:
          this.searchBox.tenant_uuid == '-1' ? '' : this.searchBox.tenant_uuid,
        network_type: this.searchNetType
      })
    }
  },
  components: {
    deleteDialog,
    selectComponent
  }
}
</script>
<style lang="less">
.privatNetPage {
  position: relative;
  .defaultScope {
    .el-cascader {
      width: 400px !important;
    }
  }
  .privatNetBtn {
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
  .privatNetList {
    margin-top: 10px;
    .operateBtn {
      cursor: pointer;
      padding: 0 5px;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>

<style lang="less">
.searchList {
  padding-left: 15px;
  display: inline-block;
  position: relative;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
  .parentName {
    display: inline-block;
    position: relative;
    height: 36px;
    line-height: 36px;
    white-space: nowrap;
    font-size: 13px;
    padding: 0 10px;
    border-width: 1px 1px 0;
    border-style: solid;
    border-color: transparent;
    z-index: 2;
    color: #404a58;
    cursor: pointer;
    &.active {
      border-color: #d1d2d3;
      background-color: #fff;
    }
    span {
      padding-right: 10px;
    }
    i {
      float: right;
      line-height: 36px;
    }
  }
  .childList {
    position: absolute;
    margin-top: -1px;
    border: 1px solid #ddd;
    z-index: 1;
    white-space: nowrap;
    & > li {
      color: #404a58;
      padding: 0 10px;
      text-align: left;
      box-sizing: border-box;
      min-width: 121px;
      font-weight: 400;
      height: 36px;
      line-height: 36px;
      background: #fff;
      cursor: default;
      &.active {
        background-color: #409eff;
        color: #fff;
      }
      &:not(.active):hover {
        background-color: #ddd;
      }
    }
  }
}
</style>
