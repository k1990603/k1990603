<template>
  <div class="load-balance-list">
    <div class="defaultScope">
      <div class="curPage">LB</div>
    </div>
    <div class="btnList">
      <div class="batchBtn">
        <el-button type="primary" @click="creatExample()" size="small">新建</el-button>
        <!-- <el-button type="primary" @click="deletelb = true" size="small">删除</el-button> -->
      </div>
      <div class="columSel">
        <span>
          <i class="el-icon-refresh" @click="changeSearch"></i>
        </span>
        <span @click="editColum">
          <i class="el-icon-menu"></i>
        </span>
        <span>
          <i class="el-icon-download"></i>
        </span>
      </div>
      <div class="searchBtn">
        <el-input placeholder="请输入内容" @keyup.enter='changeSearch' @change='changeSearch' size="small" v-model.trim="search.inputVal" class="input-with-select">
          <el-cascader clearable v-model="search.searchKey" style='width:120px;background-color:#fff;' :options="search.selectList" size='small' :show-all-levels="false" slot="prepend"></el-cascader>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="imageTable">
      <el-table :data="tableData" :key='key' style="width: 100%" stripe>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" min-width="100">
          <template slot-scope="scope">
            <span class="proName" @click="toDetails(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for='columName in formThead' :show-overflow-tooltip="true" :key='columName.id' :label="columName.name" min-width="120">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <span class="operateBtn" @click="deleteLbTrigger(scope.row)">删除</span>
            <span class="operateBtn" v-if='scope.row.state==0' @click="$router.push({path:`/sf_cloud/workbench/userLBmonitor/${scope.row.uuid}`,query:{rowInfo:JSON.stringify(scope.row)}})">监听器</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>
    <!-- 表格列==自定义 -->
    <tableColumNameDialog :columArr='columArr' :checkArr='checkArr' @sendColum='setColum'></tableColumNameDialog>
    <!-- 创建负载均衡 -->
    <el-dialog title="创建负载均衡" @close='handleClose' class='dialogTemplate' :visible.sync="creatEdit" width="650px" center>
      <CreatLB @closeDialog="closeCreat" :projectList='projectList' :createNum='createNum'></CreatLB>
    </el-dialog>
    <!-- 删除负载均衡弹框 -->
    <el-dialog title="删除负载均衡" @close='handleClose' class='dialogTemplate' :visible.sync="deletelb" width="650px" center>
      <DeleteLB :rowInfo="rowInfo"></DeleteLB>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletelb = false">取 消</el-button>
        <el-button type="primary" @click="deleteLbSubmit" :disabled="isDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { getProjectArr } from '@/api/admin/lesseeManage'
import { formateLbStatus, formateHealthStatus } from '@/filters/index'
import tableColumNameDialog from './../../common/tableColumName'
import { getLbList, deleteLb } from '@/api/admin/lb'
import DeleteLB from './lbList/DeleteLB'
import CreatLB from './lbList/CreatLB'

export default {
  components: {
    CreatLB,
    tableColumNameDialog,
    DeleteLB
  },
  mounted() {},
  data() {
    const defaultFormThead = [
      // 默认展示表单列
      { name: '状态', id: '_state' },
      { name: '网络类型', id: 'netType' },
      // { name: '监控', id: 'monitor' },
      { name: '内网VIP', id: 'ip' },
      { name: '外网VIP', id: 'internet_vip' },
      { name: '健康状态', id: '_health_state' },
      { name: '所属项目', id: 'project_name' },
      { name: '所属租户', id: 'tenant_name' },
      { name: '创建时间', id: 'created_at' }
    ]
    return {
      isDelete: false, // 是否已经执行删除操作
      projectList: [],
      createNum: 0,
      creatEdit: false, // 创建负载均衡弹框
      deletelb: false, // 删除负载均衡
      rowInfo: {},
      tableData: [],
      paginationInfo: {
        // 分页
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      key: 1,
      formTheadOptions: [
        // 默认展示表单列
        { name: '状态', id: '_state' },
        { name: '网络类型', id: 'netType' },
        // { name: '监控', id: 'monitor' },
        { name: '内网VIP', id: 'ip' },
        { name: '外网VIP', id: 'internet_vip' },
        { name: '健康状态', id: '_health_state' },
        { name: '所属项目', id: 'project_name' },
        { name: '所属租户', id: 'tenant_name' },
        { name: '创建时间', id: 'created_at' }
      ],
      // checkboxVal: defaultFormThead,
      formThead: defaultFormThead, // 默认表头 Default header
      // 所有列名 供用户自定义
      columArr: [
        // 默认展示表单列
        { name: '状态', id: '_state' },
        { name: '网络类型', id: 'netType' },
        // { name: '监控', id: 'monitor' },
        { name: '内网VIP', id: 'ip' },
        { name: '外网VIP', id: 'internet_vip' },
        { name: '健康状态', id: '_health_state' },
        { name: '所属项目', id: 'project_name' },
        { name: '所属租户', id: 'tenant_name' },
        { name: '创建时间', id: 'created_at' }
      ],
      // 默认选中的值
      checkArr: [
        '_state',
        'netType',
        // 'monitor',
        'internet_vip',
        'ip',
        '_health_state',
        'project_name',
        'tenant_name',
        'created_at'
      ],
      search: {
        selectList: [
          {
            label: 'LB名称',
            value: 'name'
          },
          {
            label: 'VIP',
            value: 'vip'
          }
        ],
        searchKey: [],
        inputVal: ''
      },
      searchBox: {
        project_name: '', // 搜索字段
        tenant_uuid: '-1' // 筛选租户名称
      },
      timeOut: null,
      isOperate: false
    }
  },
  mounted() {
    this.searchBox.tenant_uuid = this.userInfo.tenantInfo.tenant_uuid
    this.getList({
      tenant: this.userInfo.tenantInfo.tenant_uuid,
      project: 'all',
      project: 'all'
    })
    setTimeout(this.refreshTable, 20000)
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    getProjectArr,
    deleteLb,
    formateLbStatus,
    formateHealthStatus,
    getLbList,
    ...mapActions({ updateTableCloum: 'updateTableCloum' }),
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
    toDetails(row) {
      this.$router.push({
        path: `/sf_cloud/workbench/userLBdetails/${row.uuid}`,
        query: { internetIp: row.internet_vip }
      })
    },
    deleteLbSubmit() {
      this.isDelete = true
      this.deleteLb({ lb_uuid: this.rowInfo[0].uuid }).then(res => {
        this.isDelete = false
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.deletelb = false
          this.isOperate = false
          this.refreshTable()
        }
      })
    },
    handleClose() {
      this.isOperate = false
      this.refreshTable()
      this.createNum += 1
    },
    deleteLbTrigger(row) {
      this.isOperate = true
      this.isDelete = false
      this.rowInfo = [row]
      this.deletelb = true
    },
    setColum(columNew) {
      // 设置用户自定的列显示
      // this.checkboxVal = columNew
      this.checkArr = columNew
      this.formThead = this.formTheadOptions.filter(
        i => columNew.indexOf(i.id) >= 0
      )
      this.key = this.key + 1 // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    },
    editColum() {
      // 编辑表单展示列
      this.isOperate = true
      this.updateTableCloum(true)
    },
    getList(search) {
      this.getLbList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        role_type: 1,
        user_id: JSON.parse(localStorage.getItem('userInfo')).user_id,
        search: JSON.stringify(search) || {}
      }).then(res => {
        if (res.data.code == 0) {
          res.data.data.rows.forEach(item => {
            item._state = this.formateLbStatus(item.state)
            item._health_state = this.formateLbStatus(item.health_state)
            item.netType = item.network_type == '0' ? '内网' : '外网'
          })
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    // 搜索框方法
    changeSearch() {
      if (this.search.searchKey.length > 0) {
        let options = {}
        if (this.search.inputVal != '') {
          options[this.search.searchKey[0]] = this.search.inputVal
        }
        options.tenant_uuid = this.searchBox.tenant_uuid
        options.project = 'all'
        this.getList(options)
      } else {
        this.getList({
          tenant: this.userInfo.tenantInfo.tenant_uuid,
          project: 'all'
        })
      }
    },
    closeCreat() {
      // 这里还要刷新当前页面列表
      this.creatEdit = false
      this.changeSearch()
    },
    // 以下为测试数据
    // 关闭创建负载均衡

    handleSizeChange(val) {
      // 分页相关
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.changeSearch()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.changeSearch()
    },
    creatExample() {
      // 创建负载均衡操作
      this.getProjectArr({
        tenant_uuid: this.userInfo.tenantInfo.tenant_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.projectList = res.data.data
        }
      })
      this.isOperate = true
      this.creatEdit = true
    }
  },
  watch: {},
  destroyed() {
    this.isOperate = true
  }
}
</script>
<style lang="less">
.load-balance-list {
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
  .btnList {
    margin-top: 10px;
    margin-bottom: 15px;
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
  .imageTable {
    .proName {
      cursor: pointer;
      color: #128dff;
    }
    .operateBtn {
      cursor: pointer;
      display: inline-block;
      color: #128dff;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
