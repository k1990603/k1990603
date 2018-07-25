<template>
  <div class="workOrder">
    <!-- 标题start -->
    <div class="title">
      <h3>工单列表</h3>
    </div>
    <!-- 标题end -->
    <!-- 面板start -->
    <div class="manageMain">
      <!-- <div class="remind  hidden-sm-and-down"> -->
      <!-- <ul> -->
      <!-- <li>
                        <p>我的工单提醒:</p>
                    </li>
                    <li>
                        <el-button type="text" size="small">待您补充(0)</el-button>
                    </li>
                    <li>
                        <el-button type="text" size="small">待确认工单</el-button>
                    </li> -->
      <!-- <li>
                      <el-button type="primary" size="small" @click="userPresent">提交工单</el-button>
                    </li> -->
      <!-- </ul> -->
      <!-- </div> -->
      <!-- 操作start -->
      <!-- 面板start -->
      <div class="manageMain">
        <!-- 操作start -->
        <div class="pleft">
          <el-button type="primary" size="small" @click="userPresent">提交工单</el-button>
        </div>
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
                <el-select v-model="status" placeholder="请选择状态" clearable @change="statusSwitch">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>

            </div>
          </div>
        </div>
        <!-- 面板end -->
      </div>
      <!-- 表单列表开始 -->
      <div class="tabsLIst">
        <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" v-loading="loading">
          <el-table-column prop="submit_user" label="提交账户" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="order_no" label="工单编号" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="status" label="状态" :show-overflow-tooltip="true" width="110">
            <!-- <template slot-scope="scope">
              <el-tag :type="scope.row.status === '已结单'? 'primary' : 'success'" close-transition>{{scope.row.status}}</el-tag>
            </template> -->
          </el-table-column>
          <el-table-column prop="relate_category" label="相关产品与服务" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="description" label="问题描述">
          </el-table-column>
          <el-table-column prop="submit_time" label="提交时间" sortable width="220" :show-overflow-tooltip="true">
          </el-table-column>
          <!-- <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <router-link to="/sf_cloud/workbench/adminParticulars">
                                <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">查看工单</el-button>
                            </router-link>
                            <el-button size="mini" type="text" @click="deleteList" v-if="scope.row.status=='已撤销'||scope.row.status=='已结单'">删除工单</el-button>
                            <el-button size="mini" type="text" @click="revocation" v-if="scope.row.status=='未响应'">撤销工单</el-button>
                            <el-button size="mini" type="text" @click="successList" v-if="scope.row.status=='待确认'">确认工单</el-button>
                        </template>
                    </el-table-column> -->
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-dropdown class="operateBtn" trigger="click" @command="operationWork " @click.native.prevent="deleteRow(scope.row)">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <router-link to="/sf_cloud/workbench/adminParticulars"> -->
                  <router-link :to="{path:'/sf_cloud/workbench/userParticulars/',query:{id:[transportData.status,transportData.order_no,transportData.contact_phone,transportData.submit_user]}}">
                    <el-button type="text">查看工单</el-button>

                    <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button> -->
                  </router-link>
                  <el-dropdown-item command="0" :disabled="!(scope.row.status=='已撤销'||scope.row.status=='已结单')">删除工单</el-dropdown-item>
                  <!-- <el-dropdown-item command="0">删除工单</el-dropdown-item> -->
                  <el-dropdown-item command="1" :disabled="!(scope.row.status=='未响应')">撤销工单</el-dropdown-item>
                  <el-dropdown-item command="2" :disabled="!(scope.row.status=='待用户确认')">确认处理</el-dropdown-item>
                  <el-dropdown-item command="3" :disabled="!(scope.row.status=='待用户确认')">回绝处理</el-dropdown-item>
                  <!-- <el-dropdown-item command="3" :disabled="!(scope.row.image_stauts==2)">发布镜像</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表单列表结束 -->
      </div>
      <div class="paging">
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]"
                    :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
                </el-pagination> -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
      <!-- 面板end -->
    </div>
    <!-- 工单操作 -->
    <el-dialog :title="imageOperation.title" :visible.sync="OpreationShow" width="650px" center>
      <div v-loading="loading2" element-loading-text="拼命加载中">
        <div class="image-operation">
          {{imageOperation.content}}
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="OpreationShow = false" v-if="!loading2">取 消</el-button>
          <el-button type="primary" @click="totalSubmit" v-if="!loading2">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 工单提交信息弹框 -->
    <el-dialog title="提交工单" :visible.sync="workConfig" center width="650px">
      <div v-loading="loading2" element-loading-text="拼命加载中">
        <el-form ref="submitData" :model="submitData" label-width="100px" :rules='rules'>
          <el-form-item label="系统模块" prop="initTotal" :label-width="formLabelWidth">
            <el-select v-model="submitData.initTotal" placeholder="请选择所属项目" @change="switchCategory">
              <el-option v-for="item in submitData.initCategoryTotal" :key="item.label" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
            <!-- <el-cascader placeholder="选择产品服务" :options="submitData.initCategoryTotal" v-model="submitData.initTotal" change-on-select clearable @change="switchCategory"></el-cascader> -->
          </el-form-item>
          <el-form-item label="具体操作" v-if="submitData.initTotal!=''" prop="user_request_category_id" :label-width="formLabelWidth">
            <el-select v-model="submitData.user_request_category_id" placeholder="请选择所属项目">
              <!-- <el-option label="区域一" value="0"></el-option>
                <el-option label="区域二" value="1"></el-option> -->
              <el-option v-for="item in submitData.initCategoryData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述" prop="description" :label-width="formLabelWidth">
            <!-- <el-col :span="11"> -->
            <el-input type="textarea" :rows="4" v-model="submitData.description" auto-complete="off"></el-input>
            <!-- </el-col> -->
          </el-form-item>
          <el-form-item label="联系方式" prop="telephone" :label-width="formLabelWidth">
            <!-- <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select> -->
            <!-- <el-col :span="11"> -->
            <el-input v-model="submitData.telephone"></el-input>
            <!-- </el-col> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="workConfig = false" v-if="!loading2">取 消</el-button>
          <el-button type="primary" @click="submitConfirm('submitData')" v-if="!loading2">确 定</el-button>
        </div>
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
  initCategory,
  submitWorker,
  userConfirm,
  userUnconfirm,
  delectWk,
  undoWk,
  exportUserCategory
} from '@/api/user/userWorkList'
import { formatDateTime } from '@/filters/'
export default {
  data() {
    const checkMobile = (rule, value, callback) => {
      const reg = /^1[3-9]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号不合法'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '120px',
      submitData: {
        //工单提交
        initTotal: '',
        user_request_category_id: '',
        user_id: '',
        description: '',
        telephone: '',
        initCategoryData: [],
        initCategoryTotal: []
      },
      options: [
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
      ],
      store,
      loading: false,
      loading2: false,
      CategoryTotal: [], //init总数据
      switchNumber: 0,
      imageOperation: {
        title: '编辑工单',
        content: '确认删除工单'
      },
      OpreationShow: false,
      inputList: '',
      transportData: {
        status: '',
        order_no: null,
        contact_phone: '',
        submit_user: ''
      },
      workConfig: false,
      currentTime: 'all',
      // currentPage: 4,
      status: '',
      // order: {
      //   mobile: "",
      //   describe: "",
      //   summarize: ""
      // },
      rules: {
        telephone: [
          { required: true, validator: checkMobile, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空！', trigger: 'blur' }
        ],
        user_request_category_id: [
          { required: true, message: '请选择工单类别', trigger: 'change' }
        ],
        initTotal: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ]
      },
      paginationInfo: {
        // 分页
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      search: {
        status: ['0', '1', '2', '3', '4'],
        start_time: '',
        end_time: '',
        submit_id: ''
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
    this.getList()
    this.getInitCategory()
    // let today=new Date(new Date().toLocaleDateString()).getTime()
    this.search.submit_id = this.userInfo.user_id
    this.search.end_time = this.formatDateTime(new Date())
    // this.search.start_time="today"
    // this.betwenTime=[new Date(today),this.search.end_time]
  },
  methods: {
    getWorkList,
    formatDateTime,
    initCategory,
    submitWorker,
    userConfirm,
    userUnconfirm,
    delectWk,
    undoWk,
    exportUserCategory,
    downloadFile,
    filterTag(value, row) {
      console.log('--------')
      return row.status === value
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleEdit(index, row) {
      // console.log(index, row);
    },
    userPresent() {
      this.submitData.initTotal = ''
      this.submitData.user_request_category_id = ''
      this.submitData.description = ''
      this.submitData.telephone = ''
      this.workConfig = true
    },
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
        identity: '0'
      }
      if (this.currentTime == 'all') {
        data.search = {
          status: this.search.status
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
    getInitCategory() {
      //工单类别信息初始化
      this.submitData.initCategoryTotal = []
      this.submitData.initCategoryData = []
      this.initCategory().then(res => {
        if (res.data.code == 0) {
          let data = res.data.data
          this.CategoryTotal = res.data.data
          // for (let n in data) {
          //   this.submitData.initCategoryTotal.push({
          //     value: data[n].value,
          //     label: data[n].label
          //   })
          // }
          this.submitData.initCategoryTotal = data
          if (this.$route.query.name) {
            this.workConfig = true
            this.submitData.initTotal = '项目管理' //29
            this.switchCategory()
          }
        }
      })
    },
    switchCategory() {
      this.submitData.initCategoryData = []
      this.submitData.user_request_category_id = ''
      let data = this.CategoryTotal
      for (let n in data) {
        if (this.submitData.initTotal == data[n].label) {
          this.submitData.initCategoryData = data[n].children
        }
      }
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
    },
    getCurrentTime() {
      this.search.start_time = this.currentTime
      this.search.end_time = this.formatDateTime(new Date())
      this.betwenTime = []
      this.getList()
    },
    exportWork() {
      //下载
      let data = { search: this.search, identity: '0' }
      if (this.currentTime == 'all') {
        let data = {
          identity: 1,
          search: {
            status: this.search.status
          }
        }
        this.exportUserCategory(data).then(res => {
          this.downloadFile(res.data, 'work_order')
        })
      } else {
        let data = {
          identity: 0,
          search: {
            status: this.search.status,
            start_time: this.search.start_time,
            end_time: this.search.end_time,
            submit_id: this.search.submit_id,
            category_id: this.search.category_id
          }
        }
        this.exportUserCategory(data).then(res => {
          this.downloadFile(res.data, 'work_order')
        })
      }
    },
    submitConfirm(formName) {
      this.submitData.user_id = this.userInfo.user_id
      let data = {
        user_id: this.submitData.user_id,
        user_request_category_id: this.submitData.user_request_category_id,
        description: this.submitData.description,
        telephone: this.submitData.telephone
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading2 = true
          this.workConfig = false
          this.submitWorker(data).then(res => {
            if (res.data.code == 0) {
              this.getList()
              this.$message({
                message: '提交成功',
                type: 'success'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteRow(a) {
      this.transportData.order_no = a.order_no
      this.transportData.status = a.status
      this.transportData.contact_phone = a.contact_phone
      this.transportData.submit_user = a.submit_user
    },
    operationWork(rowClass) {
      switch (rowClass) {
        case '0':
          // that.$router.go('/sf_cloud/workbench/adminParticulars')
          ;(this.imageOperation.title = '删除工单'),
            (this.imageOperation.content = '确认删除工单？')
          this.switchNumber = 0
          this.OpreationShow = true
          break
        case '1':
          // this.adminConfirmWk()
          ;(this.imageOperation.title = '撤销工单'),
            (this.imageOperation.content = '确认撤销工单？')
          this.switchNumber = 1
          this.OpreationShow = true
          break
        case '2':
          // this.adminConfirmWk()
          ;(this.imageOperation.title = '确认处理'),
            (this.imageOperation.content = '处理已完成？')
          this.switchNumber = 2
          this.OpreationShow = true
          break
        case '3':
          // this.adminConfirmWk()
          ;(this.imageOperation.title = '回绝处理'),
            (this.imageOperation.content = '处理未完成？')
          this.switchNumber = 3
          this.OpreationShow = true
          break
      }
    },
    totalSubmit() {
      console.log(typeof this.switchNumber)
      // this.OpreationShow=false
      this.loading2 = true
      let data = { user_request_id: this.transportData.order_no }
      switch (this.switchNumber) {
        case 0:
          this.delectWk(data).then(res => {
            this.loading2 = false
            this.OpreationShow = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
          break
        case 1:
          this.undoWk(data).then(res => {
            this.loading2 = false
            this.OpreationShow = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '撤销成功!'
              })
            }
          })
          break
        case 2:
          this.userConfirm(data).then(res => {
            this.loading2 = false
            this.OpreationShow = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '确认处理成功!'
              })
            }
          })
          break
        case 3:
          // this.adminConfirmWk()
          this.userUnconfirm(data).then(res => {
            this.loading2 = false
            this.OpreationShow = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '回绝处理成功!'
              })
            }
          })
          break
      }
      this.getList()
    },
    statusSwitch() {
      if (!this.status) {
        this.search.status = ['0', '1', '2', '3', '4']
      } else {
        this.search.status = this.status
      }
      this.getList()
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
    },
    workConfig(val) {
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
    padding-left: 10px;
    height: 50px;
    line-height: 50px;
    margin: 0;
    & > h3 {
      font-size: 16px;
      font-weight: 700;
    }
  }
  & > .manageMain {
    .pleft {
      padding-left: 10px;
    }
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
          margin-top: 4px;
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
