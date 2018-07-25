<template>
  <div class="log">
    <!-- 标题start -->
    <div class="title">

      <div class="titLeft">
        <h3>日志管理</h3>
      </div>
    </div>
    <!-- 标题end -->
    <!-- 面板start -->
    <div class="manageMain">
      <!-- 操作start -->
      <div class="hidden-sm-and-down logMsg">
        <div class="logMsgLeft">
          <div>
            <el-radio-group v-model="examplePlace" @change="timeChange">
              <el-radio-button label="1">今天</el-radio-button>
              <el-radio-button label="2">昨天</el-radio-button>
              <el-radio-button label="3">近七天</el-radio-button>
              <el-radio-button label="4">全部</el-radio-button>
            </el-radio-group>
          </div>
          <!-- 日期 -->
          <div class="block hidden-md-and-down">
            <el-date-picker value-format="yyyy-MM-dd hh-ss-mm" @change="dataChange" v-model="value" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
            </el-date-picker>
          </div>
          <!-- 日期end -->
        </div>
        <!-- 筛选框start -->
        <div class="logMsgRight">
          <div>
            <div class="columSel">
              <span>
                <i class="el-icon-refresh" @click="getLogData"></i>
              </span>
            </div>
            <div class="searchBtn">
              <!-- <el-input placeholder="请输入搜索IP" size="small" prefix-icon="el-icon-search" v-model="inputContent" @blur="searchEvents">
                            </el-input> -->
              <el-cascader :options="options" change-on-select v-model="operaChange" @change="searchChange" prefix-icon="el-icon-search" clearable style="width:150px"></el-cascader>
            </div>
          </div>
        </div>
        <!-- 筛选框end -->
      </div>
      <!-- 表单列表开始 -->
      <div class="tabsLIst">
        <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" v-loading="loading">
          <el-table-column prop="operator" label="操作用户" min-width="100" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="object" label="操作对象" min-width="110" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="action" label="操作动作" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="date" label="提交时间" sortable min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="result" label="操作结果" min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="description" label="操作详情" min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
        <!-- 表单列表结束 -->
      </div>
      <!-- 分页start -->
      <div class="paging">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPageIndex" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <!-- 分页end -->
      <!-- 面板end -->
    </div>
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css'
import { getData } from '@/api/user/userLogManagement'
import { logJsonData } from '@/data/logJson'
import { formatDateTime } from '@/filters/'
export default {
  data() {
    return {
      examplePlace: '3',
      value: [],
      currentPageIndex: 1,
      pageSize: 5,
      tableData: [],
      total: 1,
      // inputContent: "",
      searchContent: '',
      time: {}, //时间
      object: '', //搜索父
      action: '', //搜索子
      operaChange: [],
      searchData: {
        object: '',
        // operator: '',
        action: '',
        start_time: '',
        end_time: ''
      },
      options: [],
      loading: false
    }
  },
  created() {
    let today = new Date(new Date().toLocaleDateString()).getTime()
    this.time.start_time = this.formatDateTime(
      new Date(today - 7 * 24 * 60 * 60 * 1000)
    )
    this.time.end_time = this.formatDateTime(new Date())
    this.getLogData()
    this.options = this.logJsonData()
  },
  methods: {
    getData,
    logJsonData,
    formatDateTime,
    getLogData() {
      //获取数据
      this.loading = true
      this.searchData.start_time = this.time.start_time
      this.searchData.end_time = this.time.end_time
      let options = {
        page_no: this.currentPageIndex,
        page_size: this.pageSize,
        search: this.searchData,
        user_role: '1'
      }
      this.getData(options).then(res => {
        let data = res.data
        this.loading = false
        if (data.code === 0) {
          this.tableData = data.data.rows
          this.total = data.data.total
        }
      })
    },
    searchChange() {
      this.searchData.object = this.operaChange[0]
      this.searchData.action = this.operaChange[1]
      this.getLogData()
    },
    dataChange() {
      // debugger;
      // 时间选择器
      this.examplePlace = '0'
      if (this.value) {
        this.searchContent = JSON.stringify(
          (this.time = {
            start_time: this.value[0],
            end_time: this.value[1]
          })
        )
        this.getLogData()
      } else {
        this.searchContent = JSON.stringify(
          (this.time = {
            start_time: ''
          })
        )
        this.getLogData()
      }
    },
    formatter(row, column) {
      return row.operationModule
    },
    question(row, column) {
      return row.question
    },
    filterTag(value, row) {
      return row.tag === value
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    present() {},
    handleSizeChange(val) {
      this.currentPageIndex = 1
      this.pageSize = val
      this.getLogData()
    },
    handleCurrentChange(val) {
      this.currentPageIndex = val
      this.getLogData()
    },
    timeChange() {
      this.value = ''
      Date.prototype.format = function(fmt) {
        var o = {
          'M+': this.getMonth() + 1, //月份
          'd+': this.getDate(), //日
          'h+': this.getHours(), //小时
          'm+': this.getMinutes(), //分
          's+': this.getSeconds(), //秒
          'q+': Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
          )
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ('00' + o[k]).substr(('' + o[k]).length)
            )
          }
        }
        return fmt
      }
      let today = new Date(new Date().toLocaleDateString())
      var time1 = today.format('yyyy-MM-dd hh:mm:ss')
      var time2 = today
      var time3 = today
      switch (this.examplePlace) {
        case '1':
          // 时间选择器
          this.searchContent = JSON.stringify(
            (this.time = {
              start_time: time1
            })
          )
          this.getLogData()
          break
        case '2':
          time2 = time2 - 3600 * 1000 * 24
          time2 = new Date(time2).format('yyyy-MM-dd hh:mm:ss')
          this.searchContent = JSON.stringify(
            (this.time = {
              start_time: time2
            })
          )
          this.getLogData()
          break
        case '3':
          time3 = time3 - 3600 * 1000 * 24 * 7
          time3 = new Date(time3).format('yyyy-MM-dd hh:mm:ss')
          this.searchContent = JSON.stringify(
            (this.time = {
              start_time: time3
            })
          )
          this.getLogData()
          break
        case '4':
          this.searchContent = JSON.stringify(
            (this.time = {
              start_time: ''
            })
          )
          this.getLogData()
          break
      }
    }
  }
}
</script>
<style lang="less">
.log {
  & > .title {
    padding: 0 20px;
    height: 46px;
    line-height: 46px;
    margin: 0;
    & > h3 {
      font-size: 16px;
      font-weight: 700;
    }
  }
  & > .manageMain {
    .logMsg {
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
    }
    .paging {
      float: right;
      margin-right: 60px;
      margin-top: 20px;
    }
  }
}
</style>
