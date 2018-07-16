<template>
  <div class="hostpoolPage">
    <div class="defaultScope">
      <div class="curPage">集群</div>
      <!-- <selectComponent @getSelect="getSelect"></selectComponent>
      <selectComponent @getSelect="getSelect"></selectComponent> -->
    </div>
    <div class="btnList">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="createDialogShow">
              新建集群</el-button>
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
            <!-- <span>
              <i class="el-icon-download"></i>
            </span> -->
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入名称" @blur='inputSearch' size="small" v-model="defaultListParams.name" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="hostpoolList">
      <el-table :data="tableData" style="width: 100%" stripe :key='key' v-loading="loading">
        <el-table-column prop="name" :show-overflow-tooltip="true" label="集群名" min-width="120px">
        </el-table-column>
        <el-table-column prop="dc_name" label="所属机房" :show-overflow-tooltip="true" min-width="100">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :key='columName.id' v-for='columName in formThead' :label="columName.name" min-width="120">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <div class="btnBox">
              <!-- <span class="operateBtn">
                <img src="/static/svg/detail.svg" alt="">
              </span> -->
              <span class="operateBtn" @click="editDialogShow(scope.row)">
                <img src="/static/svg/edit.svg" alt="">
              </span>
              <span class="operateBtn" @click="deleteDialogShow(scope.row)">
                <img src="/static/svg/delete.svg" alt="">
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
    <el-dialog width="650px" title="集群信息编辑" @close='handleClose' :visible.sync="dialogStatus.edit" center>
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="130px">
        <el-form-item label="集群名称" prop="name" required>
          <el-input type="text" v-model="editRuleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="HOST下限" prop="hostLimit" required>
          <el-input-number v-model="editRuleForm.hostLimit" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="镜像缓存服务器" prop="imageCacheHost" required>
          <el-input type="textarea" :rows="4" v-model="editRuleForm.imageCacheHost" placeholder="一行代表一个服务器地址,多个请换行输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <tableColumNameDialog :columArr='columArr' :checkArr='checkArr' @sendColum='setColum'></tableColumNameDialog>

    <hsotpoolCreate @infRefresh="infRefresh" :areaChildList="areaChildList" :hostpoolCreateVisible.sync="dialogStates.hostpoolCreateVisible"></hsotpoolCreate>
    <hostpoolDelete></hostpoolDelete>

  </div>
</template>
<script>
import { mapActions } from 'vuex'
import selectComponent from './hostpoolComponent/selectCom'
import tableColumNameDialog from './../../common/tableColumName'
import hsotpoolCreate from './hostpoolComponent/hostpoolCreate'
import hostpoolDelete from './hostpoolComponent/hostpoolDelete'
import store from './../../../state'
import {
  getImagecacheInfo,
  editHcInfo,
  queryAreaList,
  queryHostList,
  deleteHostPoolPageData,
  filterHostPoolPageData
} from '@/api/admin/areaManage'

const defaultFormThead = [
  { name: 'HOST数量', id: 'host_nums' },
  { name: 'HOST下限', id: 'least_host_nums' },
  { name: 'VM数量', id: 'vm_nums' },
  { name: 'CPU数(核)', id: 'cpu_nums' },
  { name: 'CPU使用率(%)', id: 'cpu_used_rate' },
  { name: 'MEM总量(MB)', id: 'mem_nums' },
  { name: 'MEM使用率(%)', id: 'mem_used_rate' },
  { name: '可创建VM数', id: 'vm_available_nums' }
]
export default {
  data() {
    return {
      loading: false,
      rowInfo: {},
      editRules: {
        name: [{ required: true, message: '请填写集群名称', trigger: 'blur' }],
        imageCacheHost: [
          {
            required: true,
            message: '请输入镜像缓存服务器地址',
            trigger: 'blur'
          }
        ]
      },
      editRuleForm: {
        uuid: '',
        dc_uuid: '',
        name: '',
        hostLimit: '',
        imageCacheHost: ''
      },
      dialogStatus: {
        edit: false
      },
      // 所有列名 供用户自定义
      columArr: [
        { name: 'HOST数量', id: 'host_nums' },
        { name: 'HOST下限', id: 'least_host_nums' },
        { name: 'VM数量', id: 'vm_nums' },
        { name: 'CPU数(核)', id: 'cpu_nums' },
        { name: 'CPU使用率(%)', id: 'cpu_used_rate' },
        { name: 'MEM总量(MB)', id: 'mem_nums' },
        { name: 'MEM使用率(%)', id: 'mem_used_rate' },
        { name: '可创建VM数', id: 'vm_available_nums' }
      ],
      // 默认选中的值
      checkArr: [
        'host_nums',
        'least_host_nums',
        'vm_nums',
        'cpu_nums',
        'cpu_used_rate',
        'mem_nums',
        'mem_used_rate',
        'vm_available_nums'
      ],
      // 表格数据
      key: 1, // table key
      formTheadOptions: [
        { name: 'HOST数量', id: 'host_nums' },
        { name: 'HOST下限', id: 'least_host_nums' },
        { name: 'VM数量', id: 'vm_nums' },
        { name: 'CPU数(核)', id: 'cpu_nums' },
        { name: 'CPU使用率(%)', id: 'cpu_used_rate' },
        { name: 'MEM总量(MB)', id: 'mem_nums' },
        { name: 'MEM使用率(%)', id: 'mem_used_rate' },
        { name: '可创建VM数', id: 'vm_available_nums' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      defaultListParams: {
        datacenter_uuid: '', // 非必须
        name: '' // 非必须
      },
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      store,
      dialogStates: {
        hostpoolCreateVisible: false // 新建集群
      },
      areaChildList: [], // 查询所有大小区的信息
      tableData: []
    }
  },
  mounted() {
    this.getAllHostpool()
    this.getAreaChildList()
  },
  methods: {
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    getImagecacheInfo,
    editHcInfo,
    filterHostPoolPageData,
    deleteHostPoolPageData,
    queryAreaList,
    queryHostList,
    handleClose() {},
    cancelEdit() {
      this.$refs.editRuleForm.resetFields()
      this.dialogStatus.edit = false
    },
    editSubmit() {
      this.editHcInfo({
        uuid: this.editRuleForm.uuid,
        name: this.editRuleForm.name,
        least_host_nums: this.editRuleForm.hostLimit,
        imgcache_server: this.editRuleForm.imageCacheHost // 待添加字段
      }).then(res => {
        if (res.data.code == 0) {
          this.$message.success('编辑集群信息成功')
          this.cancelEdit()
        }
      })
    },
    getSelect(item) {
      //// 获取机房筛选筛选项目
      this.defaultListParams.datacenter_uuid = item.datacenter_uuid
      if (item.tenant_uuid === '-1') {
        this.getAllHostpool()
      } else {
        this.getAllHostpool({
          datacenter_uuid: this.defaultListParams.datacenter_uuid
        })
      }
      this.defaultListParams.name = ''
    },
    inputSearch() {
      if (this.defaultListParams.name == '') {
        this.getAllHostpool()
      } else {
        this.getAllHostpool({
          name: this.defaultListParams.name
        })
      }
    },
    // 设置用户自定的列显示
    setColum(columNew) {
      this.checkboxVal = columNew
    },
    editColum() {
      this.inputSearch = true
      this.updateTableCloum(true)
    },
    handleClick(row) {
      console.log(row)
    },
    // 刷新页面信息
    infRefresh() {
      this.inputSearch()
    },
    // 查询所有集群信息
    getAllHostpool(defaultListParams) {
      this.loading = true
      this.queryHostList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: defaultListParams || ''
      }).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          let data = res.data.data
          this.paginationInfo.total = data.total
          this.tableData = data.rows
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getAllHostpool()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getAllHostpool()
    },
    // 查询所有区域信息
    getAreaChildList() {
      this.queryAreaList().then(res => {
        let data = res.data
        if (data.code === 0) {
          this.areaChildList = data.data
        }
      })
    },
    createDialogShow() {
      this.dialogStates.hostpoolCreateVisible = true
    },
    editDialogShow(row) {
      this.getImagecacheInfo({ hostcluster_uuid: row.uuid }).then(res => {
        if (res.data.code == 0) {
          this.editRuleForm.uuid = row.uuid
          this.editRuleForm.name = row.name
          this.editRuleForm.hostLimit = row.least_host_nums
          this.editRuleForm.imageCacheHost = res.data.data.join('\n')
          this.dialogStatus.edit = true
        }
      })
    },
    deleteDialogShow(row) {
      // this.store.state.hostpoolDialog.delete = false
      let data = {}
      data.uuid = row.uuid
      this.$confirm(
        `此操作将移除集群名为${row.name}的集群, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.deleteHostPoolPageData(data).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getAllHostpool()
          }
        })
      })
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.checkArr = valArr
      // this.getList()
      this.formThead = this.formTheadOptions.filter(
        i => valArr.indexOf(i.id) >= 0
      )
      this.key = this.key + 1 // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  components: {
    selectComponent,
    tableColumNameDialog,
    hsotpoolCreate,
    hostpoolDelete
  }
}
</script>
<style lang="less">
.hostpoolPage {
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
  .hostpoolList {
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
