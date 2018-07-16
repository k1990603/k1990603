<template>
  <div class="workOrder">
    <!-- 标题start -->
    <div class="title">
      <h3>工单列表</h3>
    </div>
    <!-- 标题end -->
    <!-- 面板start -->
    <div class="manageMain">
      <!-- <div class="remind  hidden-sm-and-down">
                <ul>
                    <li>
                        <p>我的工单提醒:</p>
                    </li>
                    <li>
                        <el-button type="text" size="small">创建</el-button>
                    </li>
                    <li>
                        <el-button type="text" size="small">待确认工单</el-button>
                    </li>
                </ul>
            </div> -->
      <!-- 操作start -->
      <!-- 面板start -->
      <div class="manageMain">
        <!-- 操作start -->
        <div class="workOrderMsg">
          <div class="logMsgLeft">
            <div>
              <el-radio-group v-model="currentTime" @change="getCurrentTime">
                <el-radio-button label="today">今天</el-radio-button>
                <el-radio-button label="yester">昨天</el-radio-button>
                <el-radio-button label="week">近七天</el-radio-button>
                <el-radio-button label="month">一个月</el-radio-button>
                <el-radio-button label="all">全部</el-radio-button>
              </el-radio-group>
            </div>
            <!-- 日期 -->
            <div class="block hidden-md-and-down">
              <el-date-picker v-model="betwenTime" @change="timeChange" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00']">
              </el-date-picker>
            </div>
            <!-- 日期end -->
          </div>

        </div>
        <div class="workOrderMsg">
          <div class="logMsgRight">
            <div>
              <div class="columSel">
                <span>
                  <i class="el-icon-refresh" @click="getList"></i>
                </span>
                <span>
                  <i class="el-icon-download" @click="exportWork"></i>
                </span>
              </div>
              <div class="searchBtn">
                <el-cascader placeholder="选择产品服务" :options="statusList" v-model="searchFilter" change-on-select clearable @change="selectChange"></el-cascader>
              </div>
              <div class="searchBtn">
                <el-input placeholder="请输入搜索用户" prefix-icon="el-icon-search" v-model="search.submit_id" @keyup.enter.native="getList" @blur="getList" style="width:150px">
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <!-- 面板end -->
      </div>
      <!-- 表单列表开始 -->
      <div class="tabsLIst">
        <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" v-loading="loading">
          <el-table-column prop="submit_user" label="提交用户" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="order_no" label="工单编号" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="status" label="状态" :show-overflow-tooltip="true" width="110">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '已结单'? 'primary' : 'success'">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="relate_category" label="相关产品与服务" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="description" label="问题描述">
          </el-table-column>
          <el-table-column prop="submit_time" label="提交时间" sortable width="220" :show-overflow-tooltip="true">
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-dropdown class="operateBtn" trigger="click" @command="operationWork " @click.native.prevent="deleteRow(scope.row)">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <router-link :to="{path:'/sf_cloud/workbench/adminParticulars/',query:{id:[transportData.status,transportData.order_no,transportData.contact_phone,transportData.submit_user]}}">
                    <el-button type="text">查看工单</el-button>
                  </router-link>
                  <el-dropdown-item command="2" :disabled="!(scope.row.status=='处理中')">确认工单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表单列表结束 -->
      </div>
      <div class="paging">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
      <!-- 面板end -->
    </div>
    <!-- 工单操作 -->
    <el-dialog title="确认工单" :visible.sync="OpreationShow" width="650px" center>
      <div v-loading="loading2" element-loading-text="拼命加载中">
        <div class="image-operation">
          确认工单？
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="OpreationShow = false" v-if="!loading2">取 消</el-button>
          <el-button type="primary" @click="adminConfirmWk" v-if="!loading2">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import 'element-ui/lib/theme-chalk/display.css'
import store from './../../../state'
import tableColumNameDialog from './../../common/tableColumName'
import { mapGetters } from 'vuex'
import { downloadFile } from '@/filters/index'
import {
  getWorkList,
  adminConfirm,
  initCategory,
  exportCategory
} from '@/api/admin/adminWorkList'
import { formatDateTime } from '@/filters/'
export default {
  data() {
    const checkMobile = (rule, value, callback) => {
      const reg = /^1[3-9]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号不合法'))
      } else {
        callback()
      }
    }
    return {
      store,
      value: '',
      inputList: '',
      currentTime: 'all',
      searchFilter: [], //筛选
      // searchFilterList: [],
      // submitIdList: [],
      loading: false,
      loading2: false,
      // user_id:'',
      // currentPage: 4,
      // status: "",
      OpreationShow: false,
      // order_no:null,
      statusList: [
        {
          value: 'one',
          label: '模块',
          children: []
        },
        {
          value: 'two',
          label: '状态',
          children: [
            {
              value: '0',
              label: '未响应'
            },
            {
              value: '1',
              label: '处理中'
            },
            {
              value: '2',
              label: '待用户确认'
            },
            {
              value: '3',
              label: '已结单'
            },
            {
              value: '4',
              label: '已撤销'
            }
          ]
        }
      ],
      transportData: {
        //传给下个页面的参数
        status: '',
        order_no: null,
        contact_phone: '',
        submit_user: ''
      },
      order: {
        mobile: '',
        describe: '',
        summarize: ''
      },
      rules: {
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }],
        describe: [
          { required: true, message: '概述不能为空！', trigger: 'blur' }
        ],
        summarize: [
          { required: true, message: '描述不能为空！', trigger: 'blur' }
        ]
      },
      paginationInfo: {
        // 分页
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      filterData: [],
      search: {
        status: ['0', '1', '2', '3', '4'],
        start_time: '',
        end_time: '',
        category_id: [],
        submit_id: '',
        category_type: ''
      },
      tableData: [],
      betwenTime: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  mounted() {
    this.gitSearchFilter()
    this.getList()
    this.search.end_time = this.formatDateTime(new Date())
  },
  methods: {
    getWorkList,
    formatDateTime,
    adminConfirm,
    initCategory,
    exportCategory,
    downloadFile,
    //分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.paginationInfo.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.paginationInfo.currentPage = val
      this.getList()
    },
    //list
    getList() {
      this.loading = true
      let data = {
        page_no: this.paginationInfo.currentPage,
        page_size: this.paginationInfo.pageSize,
        search: this.search,
        identity: '1'
      }
      // console.log(this.search.start_time)
      if (this.currentTime == 'all') {
        data.search = {
          category_id: this.search.category_id,
          submit_id: this.search.submit_id,
          status: this.search.status,
          category_type: this.search.category_type
        }
        this.betwenTime = ['', '']
      }
      this.getWorkList(data).then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    //产品与服务list
    gitSearchFilter() {
      this.initCategory().then(res => {
        if (res.data.code == 0) {
          this.statusList[0].children = res.data.data
        }
      })
    },
    selectChange() {
      console.log(this.searchFilter[0])
      this.search.status = ['0', '1', '2', '3', '4']
      this.search.category_id = ''
      if (this.searchFilter[0] == 'one') {
        if (this.searchFilter[1]) {
          this.search.category_type = '0'
          if (this.searchFilter[2]) {
            this.search.category_type = '1'
          }
          this.search.category_id = this.searchFilter[
            this.searchFilter.length - 1
          ]
        } else {
          this.search.category_id = ''
        }
      } else if (this.searchFilter[0] == 'two') {
        if (this.searchFilter[1]) {
          this.search.status = this.searchFilter[1]
        } else {
          this.search.status = ['0', '1', '2', '3', '4']
        }
      }
      this.getList()
    },
    timeChange(val) {
      if (val) {
        this.currentTime = this.search.start_time = this.formatDateTime(val[0])
        this.search.end_time = this.formatDateTime(val[1])
      } else {
        this.currentTime = this.search.start_time = ''
        this.search.end_time = ''
      }
      this.getList()
      // console.log(this.search)
    },
    getCurrentTime() {
      this.search.start_time = this.currentTime
      this.search.end_time = this.formatDateTime(new Date())
      // let today=new Date(new Date().toLocaleDateString()).getTime()

      this.betwenTime = []
      // console.log(this.formatDateTime(new Date(today)))
      // this.betwenTime[0]=this.formatDateTime(new Date(today-24*60*60*1000))

      // switch (this.currentTime) {
      //     case 'today':
      //       this.betwenTime=[this.formatDateTime(new Date(today)),this.search.end_time]
      //       break
      //     case 'yester':
      //       this.betwenTime=[this.formatDateTime(new Date(today-24*60*60*1000)),this.search.end_time]
      //       break
      //     case 'week':
      //       this.betwenTime=[this.formatDateTime(new Date(today-7*24*60*60*1000)),this.search.end_time]
      //       break
      //     case 'month':
      //       this.betwenTime=[this.formatDateTime(new Date(today-30*24*60*60*1000)),this.search.end_time]
      //       break
      //   }
      // console.log(this.betwenTime)
      this.getList()
    },
    exportWork() {
      //下载
      if (this.currentTime == 'all') {
        let data = {
          identity: 1,
          search: {}
        }
        this.exportCategory(data).then(res => {
          this.downloadFile(res.data, 'work_order_admin')
        })
      } else {
        let data = {
          identity: 1,
          search: {
            status: ['0', '1', '2', '3', '4', '5'],
            start_time: this.search.start_time,
            end_time: this.search.end_time,
            submit_id: this.search.submit_id,
            category_id: this.search.category_id
          }
        }
        this.exportCategory(data).then(res => {
          this.downloadFile(res.data, 'work_order_admin')
        })
      }
    },
    adminConfirmWk() {
      this.loading2 = true
      this.adminConfirm({ user_request_id: this.transportData.order_no }).then(
        res => {
          this.OpreationShow = false
          this.loading2 = false
          if (res.data.code == 0) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.getList()
          }
        }
      )
    },
    deleteRow(a) {
      this.transportData.order_no = a.order_no
      this.transportData.status = a.status
      this.transportData.contact_phone = a.contact_phone
      this.transportData.submit_user = a.submit_user
    },
    operationWork(rowClass) {
      var that = this
      console.log(rowClass)
      switch (rowClass) {
        case '2':
          this.OpreationShow = true
          break
      }
    },
    editColum() {
      this.store.state.hostPage.tableColumName = true
    },
    //设置用户自定的列显示
    setColum(columNew) {
      this.checkboxVal = columNew
    }
  },
  watch: {
    OpreationShow(val) {
      if (!val) {
        this.loading2 = false
      }
    }
  }
}
</script>
<style lang="less">
.workOrder {
  & > .title {
    height: 50px;
    line-height: 50px;
    margin: 0;
    & > h3 {
      font-size: 16px;
      font-weight: 700;
    }
  }
  & > .manageMain {
    .remind {
      height: 35px;
      line-height: 35px;
      ul {
        > li {
          float: left;
          margin-right: 30px;
          a {
            color: #169bd5;
          }
        }
        li:nth-child(4) {
          float: right;
        }
      }
    }
    .workOrderMsg {
      height: 40px;
      padding: 10px;
      .logMsgLeft {
        float: left;
        > div {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .logMsgRight {
        float: right;
      }
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
          margin-top: 3px;
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
    .tabsLIst {
      padding: 0 10px;
      .operateBtn {
        cursor: pointer;
        padding: 0 5px;
      }
    }
    .paging {
      float: right;
      margin-right: 40px;
      margin-top: 20px;
    }
  }
}
.image-operation {
  font-size: 18px;
  text-align: center;
  padding: 30px 0;
}
.el-table th > div,
.el-table td > div {
  text-align: center;
}
.el-table .cell {
  text-overflow: ellipsis;
  white-space: nowrap;
}
ul > a {
  list-style: none;
  line-height: 36px;
  padding: 0 20px;
  margin: 0;
  font-size: 14px;
}
.manageMain {
  margin-top: 10px;
}
</style>
