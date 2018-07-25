<template>
  <div class="vlanPage">
    <div class="defaultScope">
      <div class="curPage">VLAN管理</div>
      <div class="selectArea">
        <span v-if="superName!=''" class='superName'>{{superName}}</span>
      </div>
      <div class="selectArea">
        <i class="el-icon-menu" @click="filtShow=!filtShow"></i>
      </div>
      <transition name="fade">
        <div class='filtTerm' v-if="filtShow">
          <el-form ref="formA" label-width="80px" :model='formData' :rules='formRules'>
            <el-form-item label="区域" prop='topArea'>
              <el-select v-model="formData.topArea" placeholder="请选择区域" size="small" @change="selectArea">
                <el-option v-for="(item,index) in topAreaData" :key="index" :label="item.name" :value="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="子区域" prop='selectedOptions'>
              <el-cascader :props="props" placeholder="请选择子区域" size="small" :options="soureceOptions" change-on-select v-model="formData.selectedOptions" @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="机房" prop='datacenter'>
              <el-select v-model="formData.datacenter" placeholder="请选择机房" size="small" @change="selectdatacenter">
                <el-option v-for="(item,index) in datacenterData" :key="index" :label="item.dc_name" :value="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
              <el-button size="small" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </transition>
    </div>
    <div class="subNetBtn">
      <el-row>
        <el-col :xs="6" :sm="4" :md="4">
          <div class="vlanBtn">
            <el-button size="small" type="primary" @click="editDialogShow">
              初始化VLAN</el-button>
          </div>
        </el-col>
        <el-col :xs="18" :sm="20" :md="20">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="getSearchList"></i>
            </span>
            <span @click="editColum">
              <i class="el-icon-menu"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入VLANID(范围11~510)" size="small" prefix-icon="el-icon-search" @change="getSearchList" v-model="searchVLANID">
              <template slot="append">
                <el-select style="width:100px;" v-model="searchStatus" size="small" @change="getSearchList">
                  <el-option label="ALL" value="-1">
                  </el-option>
                  <el-option label="已使用" value="0">
                  </el-option>
                  <el-option label="未使用" value="1">
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="vlanList">
      <el-table :data="tableData" :key='key' style="width: 100%" stripe>
        <el-table-column prop="vlan" label="VLANID" min-width="150">
        </el-table-column>
        <el-table-column prop="datacenter_name" label="所属机房" min-width="120">
        </el-table-column>
        <el-table-column :key='columName.id' :show-overflow-tooltip='true' v-for='columName in formThead' :label="columName.name" min-width="120">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '0' ? 'primary' : 'success'" close-transition>{{formateVlanType(scope.row.status)}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.status" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="Vlan初始化" class='dialogTemplate' :visible.sync="vlanList.vlan" width="500px" center>
      <initVlanDialog :topAreaData='topAreaData' @vlan='editResponse'></initVlanDialog>
    </el-dialog>
    <tableColumNameDialog :columArr='columArr' :checkArr='checkArr' @sendColum='setColum'></tableColumNameDialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import initVlanDialog from './vlan/initVlan'
import { formateVlanType } from './../../../filters/index'
import tableColumNameDialog from './../../common/tableColumName'
import {
  getAllAreaDcHcNet,
  get_hostcluster_by_area,
  getVlan
} from './../../../api/admin/netWork'
const defaultFormThead = [
  // { name: '所属专有网络', id: 'network_segment_name' },
  // { name: '所属子网', id: 'subnetwork_name' }
]
export default {
  data() {
    var checkSubArea = (rule, value, callback) => {
      if (this.formData.selectedOptions.length <= 0) {
        callback(new Error('请选择子区域'))
      } else {
        callback()
      }
    }
    return {
      searchStatus: '-1', //状态
      // 所有列名 供用户自定义
      columArr: [
        { name: '所属专有网络', id: 'network_segment_name' },
        { name: '所属子网', id: 'subnetwork_name' }
      ],
      // 默认选中的值
      checkArr: [],
      // 表格数据
      key: 1, // table key
      formTheadOptions: [
        { name: '所属专有网络', id: 'network_segment_name' },
        { name: '所属子网', id: 'subnetwork_name' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      formData: {
        topArea: '',
        selectedOptions: [],
        datacenter: ''
      },
      formRules: {
        topArea: [
          { required: true, message: '请选择选择区域', trigger: 'change' }
        ],
        selectedOptions: [{ validator: checkSubArea, trigger: 'change' }],
        datacenter: [
          { required: true, message: '请选择机房', trigger: 'change' }
        ]
      },
      name: [],
      filtShow: true,
      superName: '请选择机房',
      topAreaData: [],
      topArea: '',
      datacenterName: '',
      val: [],
      vlanList: {
        vlan: false // 初始化编辑Vlan专有网络状态
      },
      datacenter: '',
      searchVLANID: '',
      datacenterData: [],
      datacenterUuid: '',
      selectedOptions: [], //级联选中
      tableData: [],
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      },
      soureceOptions: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      }
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
  computed: {},
  mounted() {
    this.getAreaList()
  },
  methods: {
    getAllAreaDcHcNet,
    get_hostcluster_by_area,
    getVlan,
    formateVlanType,
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    // 编辑自定义列
    editColum() {
      this.updateTableCloum(true)
    },
    // 设置用户自定的列显示
    setColum(columNew) {
      this.checkboxVal = columNew
    },
    getDefaultList(search) {
      this.getVlan({
        datacenter_uuid: this.datacenterUuid,
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    getSearchList() {
      if (this.datacenterUuid == '') {
        this.$message.warning('请先筛选需要查看的机房')
        return
      }
      let options = {}
      if (this.searchVLANID != '') {
        options.vlan = this.searchVLANID
      }
      if (this.searchStatus != '-1') {
        options.status = this.searchStatus
      }
      this.getDefaultList(options)
    },
    getVlanList(search) {
      this.getVlan({
        datacenter_uuid: this.datacenterUuid,
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
          let subName = JSON.parse(JSON.stringify(this.name))
          if (subName[0] == '直属区域') {
            subName.shift()
          }
          this.superName = `${this.formData.topArea}/${subName.join('/')}${
            subName.length > 0 ? '/' : ''
          }${this.datacenterName}`
          this.filtShow = false
          // this.$refs['formA'].resetFields()
        }
      })
    },
    getAreaList() {
      // 获取所有的区域机房集群信息
      this.getAllAreaDcHcNet().then(res => {
        if (res.data.code == 0) {
          this.topAreaData = res.data.data
        }
      })
    },
    forSelect() {},
    selectArea(item) {
      // 联动筛选出子区域信息 如果大区直属有机房 则增加直属机房 id为大区id
      this.soureceOptions = []
      this.datacenterData = []
      this.formData.datacenter = ''
      this.formData.topArea = this.topAreaData[item].name
      if (
        this.topAreaData[item].datacenter &&
        this.topAreaData[item].datacenter != ''
      ) {
        this.soureceOptions = [
          {
            name: '直属区域',
            uuid: this.topAreaData[item].uuid
          }
        ]
      }
      if (this.topAreaData[item].child_area) {
        this.soureceOptions = this.soureceOptions.concat(
          this.topAreaData[item].child_area
        )
      }
    },
    handleChange(value, search) {
      // 筛选子区域
      // 级联选中
      // 清空
      this.formData.datacenter = ''
      let that = this
      let uuidArr = [].concat(value)
      that.name = []
      function getName(list) {
        list.forEach(item => {
          uuidArr.forEach((tmp, index) => {
            if (tmp == item.uuid) {
              uuidArr.splice(index, 1)
              that.name.push(item.name)
              if (item.child_area) {
                getName(item.child_area)
              }
            }
          })
        })
      }
      getName(this.soureceOptions) // 获取已选中区域名称
      this.get_hostcluster_by_area({
        area_uuid: value[value.length - 1],
        page_size: 10000,
        page_no: 1,
        search: ''
      }).then(res => {
        if (res.data.code == 0) {
          this.datacenterData = res.data.data.datacenter
        }
      })
    },
    selectdatacenter(val) {
      //机房选中
      this.datacenterName = this.datacenterData[val].dc_name
      this.datacenterUuid = this.datacenterData[val].dc_uuid
    },
    setError(key, message) {
      if (this[key] == '') {
        this.$message({
          type: 'error',
          message: message
        })
        return false
      } else {
        return true
      }
    },
    onSubmit() {
      this.$refs['formA'].validate(valid => {
        if (valid) {
          this.getVlanList()
        }
      })
    },
    cancel() {
      this.filtShow = !this.filtShow
      // this.$refs['formA'].resetFields()
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getSearchList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getSearchList()
    },
    editDialogShow() {
      this.vlanList.vlan = true
    },
    editResponse() {
      this.vlanList.vlan = false
    }
  },
  components: {
    tableColumNameDialog,
    initVlanDialog
  }
}
</script>
<style lang="less">
.vlanPage {
  position: relative;
  .superName {
    padding-right: 5px;
    font-size: 14px;
    color: #020;
  }
  .defaultScope {
    .curPage {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      line-height: 50px; // font-weight: 400;
      font-weight: 700;
      margin-right: 20px;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .selectArea {
      display: inline-block; // float: left;
      .el-icon-menu {
        font-size: 16px;
        color: #3a8ee6;
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .filtTerm {
      margin-top: 15px;
      padding: 15px 10px;
      width: 100%;
      background: #eee;
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
      margin-right: 10px;
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
  .vlanList {
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
