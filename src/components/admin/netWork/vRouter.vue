<template>
  <div class="vRouterPage">
    <div class="defaultScope">
      <div class="curPage">虚拟路由网络管理</div>
    </div>
    <div class="subNetBtn">
      <el-row>
        <el-col :xs="6" :sm="4" :md="4">
          <div class="privatNetBtnBtn">
            <el-button size="small" type="primary" @click='createVroute'>
              创建</el-button>
          </div>
        </el-col>
        <!-- <el-col :xs="18" :sm="20" :md="20">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入虚拟路由网络名称" size="small" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col> -->
      </el-row>
    </div>
    <div class="vlanList">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          <div class="subNetBtn">
            <el-row>
              <el-col :xs="6" :sm="4" :md="4">
                <div class="privatNetBtnBtn">
                  <span>DHCP</span>
                </div>
              </el-col>
              <el-col :xs="18" :sm="20" :md="20">
                <div class="columSel">
                  <span>
                    <i class="el-icon-refresh" @click="getDHList"></i>
                  </span>
                  <!-- <span>
                    <i class="el-icon-download"></i>
                  </span> -->
                </div>
                <div class="searchBtn">
                  <el-select v-model="searchHD.status" placeholder="选择产品服务" clearable size="small" filterable style='width:130px;background-color:#fff;' @change="getDHList">

                    <el-option v-for="item in searchFilterList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="searchBtn">
                  <el-input placeholder="请输入机房名称" size="small" v-model="searchHD.dc_name" @blur="getDHList">
                  </el-input>
                </div>
                <!-- <div class="searchBtn">
                  <el-input placeholder="请输入状态名称" size="small" v-model="statusHD" @blur="getDHList">
                  </el-input>
                </div> -->
              </el-col>
            </el-row>
          </div>
        </div>
        <el-table :data="tableDataDH" style="width: 100%" stripe v-loading="loadingDH">
          <el-table-column prop="name" label="名称" :show-overflow-tooltip="true">
          </el-table-column>
          <!-- <el-table-column prop="network_segment_name" label="名称" min-width="120">
          </el-table-column>
          <el-table-column prop="network_segment_name" label="类型" min-width="120">
          </el-table-column> -->
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{formateRouter(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column prop="dc_name" label="所属机房" min-width="120">
          </el-table-column>
          <el-table-column prop="area_name" label="所属区域" min-width="120">
          </el-table-column>
          <el-table-column prop="message" label="备注" min-width="120">
          </el-table-column>
          <el-table-column prop="network_segment_name" label="更新时间" min-width="120">
          </el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <div class="btnBox">
                <span class="addArea operateBtn">
                  <!-- <img src="/static/svg/detail.svg" alt=""> -->
                  console
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange(0)" @current-change="handleCurrentChange(0)" :current-page="paginationInfoDHCP.status" :page-sizes="paginationInfoDHCP.pageSizes" :page-size="paginationInfoDHCP.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfoDHCP.total">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <div class="vlanList">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          <div class="subNetBtn">
            <el-row>
              <el-col :xs="6" :sm="4" :md="4">
                <div class="privatNetBtnBtn">
                  <span>VRouter</span>
                </div>
              </el-col>
              <el-col :xs="18" :sm="20" :md="20">
                <div class="columSel">
                  <span>
                    <i class="el-icon-refresh" @click="getVRList"></i>
                  </span>
                  <!-- <span>
                    <i class="el-icon-download"></i>
                  </span> -->
                </div>
                <div class="searchBtn">
                  <el-select v-model="searchVR.status" placeholder="选择产品服务" clearable size="small" filterable style='width:130px;background-color:#fff;' @change="getVRList">
                    <el-option v-for="item in searchFilterList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="searchBtn">
                  <el-input placeholder="请输入子网名称" size="small" v-model="searchVR.subnet_name" @blur="getVRList">
                  </el-input>
                </div>
                <!-- <div class="searchBtn">
                  <el-input placeholder="请输入状态" size="small" v-model="statusVR" @blur="getVRList">
                  </el-input>
                </div> -->
              </el-col>
            </el-row>
          </div>
        </div>
        <el-table :data="tableDataVR" style="width: 100%" stripe v-loading="loadingVR">
          <el-table-column prop="name" label="名称" :show-overflow-tooltip="true">
          </el-table-column>
          <!-- <el-table-column prop="network_segment_name" label="机房名称" min-width="120">
          </el-table-column>
          <el-table-column prop="network_segment_name" label="区域名称" min-width="120">
          </el-table-column> -->
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{formateRouter(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column prop="subnet_name" label="子网名称" min-width="120">
          </el-table-column>
          <el-table-column prop="network_segment_name" label="专网名称" min-width="120" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="message" label="备注" min-width="120" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="updated_at" label="更新时间" min-width="120" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="subnetwork_name" label="操作" min-width="120">
            <template slot-scope="scope">
              <div class="btnBox">
                <span class="addArea operateBtn" fixed="right">
                  <!-- <img src="/static/svg/detail.svg" alt=""> -->
                  console
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange(1)" @current-change="handleCurrentChange(1)" :current-page="paginationInfoVR.status" :page-sizes="paginationInfoVR.pageSizes" :page-size="paginationInfoVR.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfoVR.total">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <el-dialog title="创建虚拟路由网络" @close='cancel' class='dialogTemplate' :visible.sync="create" width="650px" center>
      <el-form v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="请耐心等待..." ref="dcForm" label-width="100px" :model='formData' :rules='formRules'>
        <el-form-item label="区域" prop='topArea'>
          <el-select v-model="formData.topArea" placeholder="请选择区域" @change="selectArea">
            <el-option v-for="(item,index) in topAreaData" :key="index" :label="item.name" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子区域" prop='selectedOptions'>
          <el-cascader :props="props" placeholder="请选择子区域" :options="soureceOptions" change-on-select v-model="formData.selectedOptions" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="机房" prop='datacenter'>
          <el-select v-model="formData.datacenter" placeholder="请选择机房">
            <el-option v-for="(item,index) in datacenterData" :key="index" :label="item.dc_name" :value="item.dc_uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getDHCPList, getRoutList } from '@/api/admin/vmRoutNetWork'
import { formateRouter } from '@/filters/index'
import {
  getAllAreaDcHcNet,
  get_hostcluster_by_area,
  vrnetCreate
} from './../../../api/admin/netWork'
export default {
  data() {
    var checkSubArea = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择子区域'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      loadingDH: false,
      loadingVR: false,
      create: false,
      tableDataDH: [],
      tableDataVR: [],
      paginationInfoDHCP: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      paginationInfoVR: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      props: {
        value: 'uuid',
        label: 'name',
        children: 'child_area'
      },
      topAreaData: [],
      soureceOptions: [],
      datacenterData: [],
      formData: {
        areaUuid: '',
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
      statusHD: '',
      statusVR: '',
      searchHD: {
        dc_name: '',
        status: ''
      },
      searchVR: {
        subnet_name: '',
        status: ''
      },
      searchFilterList: [
        {
          value: '-1',
          label: '初始化'
        },
        {
          value: '0',
          label: '正常'
        },
        {
          value: '1',
          label: '服务异常'
        },
        {
          value: '2',
          label: '无法访问'
        }
      ]
    }
  },
  computed: {},
  mounted() {
    this.getDHList()
    this.getVRList()
  },
  methods: {
    vrnetCreate,
    getAllAreaDcHcNet,
    get_hostcluster_by_area,
    getDHCPList,
    getRoutList,
    formateRouter,
    onSubmit() {
      this.$refs['dcForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.vrnetCreate({
            type: '5',
            dc_uuid: this.formData.datacenter,
            area_uuid: this.formData.areaUuid
          }).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message.success('创建成功')
              this.cancel()
            }
          })
        }
      })
    },
    cancel() {
      this.loading = false
      this.create = false
      this.topAreaData = []
      this.datacenterData = []
      this.datacenterData = []
      this.$refs['dcForm'].resetFields()
    },
    createVroute() {
      this.create = true
      this.loading = true
      this.getAllAreaDcHcNet().then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.topAreaData = res.data.data
          this.getDHList()
          this.getVRList()
        }
      })
    },
    handleChange() {
      this.datacenterData = []
      this.formData.datacenter = ''
      let areaUuid = JSON.parse(
        JSON.stringify(this.formData.selectedOptions)
      ).pop()
      this.get_hostcluster_by_area({
        area_uuid: areaUuid,
        page_size: 10000,
        page_no: 1,
        search: ''
      }).then(res => {
        if (res.data.code == 0) {
          this.datacenterData = res.data.data.datacenter
        }
      })
    },
    selectArea(item) {
      // 联动筛选出子区域信息 如果大区直属有机房 则增加直属机房 id为大区id
      this.soureceOptions = []
      this.datacenterData = []
      this.formData.datacenter = ''
      this.formData.topArea = this.topAreaData[item].name
      this.formData.areaUuid = this.topAreaData[item].uuid
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
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      if (!val) {
        this.paginationInfoDHCP.pageSize = val
      } else {
        this.paginationInfoVR.pageSize = val
      }
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      if (!val) {
        this.paginationInfoDHCP.currentPage = val
      } else {
        this.paginationInfoVR.currentPage = val
      }
    },
    getDHList() {
      //DHCP模块展示页面
      this.loadingDH = true
      this.getDHCPList({
        // role_type: '1',
        page_size: this.paginationInfoDHCP.pageSize,
        page_no: this.paginationInfoDHCP.currentPage,
        search: this.searchHD
        // search: {tenant_name:JSON.stringify(search)} || ''
      }).then(res => {
        this.loadingDH = false
        if (res.data.code == 0) {
          this.tableDataDH = res.data.data.rows
          this.paginationInfoDHCP.total = res.data.data.total
        }
      })
    },
    getVRList() {
      //VROUTER展示页面
      this.loadingVR = true
      this.getRoutList({
        // role_type: '1',
        page_size: this.paginationInfoVR.pageSize,
        page_no: this.paginationInfoVR.currentPage,
        search: this.searchVR
        // search: {tenant_name:JSON.stringify(search)} || ''
      }).then(res => {
        this.loadingVR = false
        if (res.data.code == 0) {
          this.tableDataVR = res.data.data.rows
          this.paginationInfoVR.total = res.data.data.total
        }
      })
    }
    // checkStatus(str) {
    //   let type = ''
    //   switch (str) {
    //     case '初始化':
    //       type = '-1'
    //       break
    //     case '正常':
    //       type = '0'
    //       break
    //     case '服务异常':
    //       type = '1'
    //       break
    //     case '无法访问':
    //       type = '2'
    //       break
    //   }
    //   return type
    // }
  }
}
</script>
<style lang="less">
.vRouterPage {
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
  .vlanList {
    margin-top: 10px;
    .operateBtn {
      cursor: pointer;
      padding: 0 5px;
      font-size: 18px;
      color: #0783f6;
      font-size: 14px;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
