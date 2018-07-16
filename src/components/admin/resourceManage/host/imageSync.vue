<template>
  <div class='syncPage'>
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      镜像同步 {{host_name}}
    </div>
    <div class="syncContent " v-loading="submitLoading" element-loading-text="提交中,请耐心等待...">
      <el-steps :active="stepActive" :align-center='true'>
        <el-step title="选择需要同步的镜像" icon="el-icon-edit"></el-step>
        <el-step title="设置镜像任务列表" icon="el-icon-upload"></el-step>
        <!-- <el-step title="关联集群" icon="el-icon-picture"></el-step> -->
      </el-steps>
      <div class="imageList" v-show="stepActive == 1">
        <div class="remoteInfo">
          搜索新镜像
          <el-select v-model="newImage" @change='selectImage' filterable placeholder="请选择">
            <el-option v-for="(item,index) in imageList.remote_image_data" :key="index" :label="item.name + (item.type == 0 ? '系统盘' : '数据盘')" :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="oldInfo">
          <el-table v-loading="loading" ref="multipleTable" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange" :data="imageList.local_image_data" style="width: 100%" border stripe>
            <el-table-column type="selection" width="55" :selectable="selectable">
            </el-table-column>
            <el-table-column prop="image_info.name" label="镜像名称" min-width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="image_info.os_type" label="操作系统" min-width="120">
            </el-table-column>
            <el-table-column prop="image_info.description" label="描述">
            </el-table-column>
            <el-table-column prop="msg" label="版本状态">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope='scope'>
                <el-button type="text" v-if='scope.row.msg == "新镜像待同步"' @click='delteNewImage(scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="btnBox">
          <el-button type="primary" plain :disabled="multipleSelection.length<=0" @click="toNext">下一步：设置镜像任务列表</el-button>
        </div>
      </div>
      <div class="taskConet" v-show="stepActive == 2">
        <div class="startTime">
          注意：该台物理机的镜像更新的最后任务时间为{{taskList.minTime}}
        </div>
        <el-tabs type="card" v-model="activeName" @tab-click="handleTab">
          <el-tab-pane v-for="(item,index) in multipleSelection" :key="index" :label="item.image_info.name + (item.image_info.type == 0 ? '系统盘' : '数据盘')" :name=" '_' +item.image_info.id">
          </el-tab-pane>
        </el-tabs>
        <el-form ref="form" :model="taskList" :rules="taskRules" label-width="160px">
          <el-form-item label="限速(mb/s)" prop="speed">
            <el-input type='text' @blur="getNeedTime" v-model="taskList.speed" :disabled="taskList.hasSpeed"></el-input>
          </el-form-item>
          <el-form-item label="同步需要总时长(min)" prop='needTime'>
            <el-input type='text' :disabled="true" v-model="taskList.needTime"></el-input>
          </el-form-item>
          <el-form-item label="任务时间" prop="time_limit">
            <el-date-picker :picker-options="pickerBeginDateBefore" v-model="taskList.time_limit" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="addTask" :disabled="taskList.taskNum<=0">添加</el-button>
            <span>提示:此镜像您还可以添加
              <span style="font-size:25px;color:#f00">{{taskList.taskNum}}</span>个任务时间(如果时间段已有任务将不可选)</span>
          </el-form-item>
        </el-form>
        <el-table v-if="taskTableData.length>0" :data="taskTableData" style="width: 100%" max-height="400">
          <el-table-column fixed prop="imageName" label="镜像名称" :show-overflow-tooltip="true" min-width="100">
          </el-table-column>
          <el-table-column prop="limitSpeed" label="限速(MB/S)" width="100">
          </el-table-column>
          <el-table-column prop="taskList" label="任务列表" min-width="120">
            <template slot-scope='scope'>
              <div class="time_item" v-for="(item,index) in scope.row.taskList" :key='index'>
                {{index+1}}、&nbsp;{{item.sch_starttime}} - {{item.sch_endtime}}&nbsp;
                <i class="el-icon-delete" @click="deleteTask(scope.$index, scope.row,item,index)" style="color:#f00"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btnBox">
          <!-- <el-button type="warning" plain @click="prev">上一步：设置镜像任务列表</el-button> -->
          <el-button type="primary" plain @click="submit">确认提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { syncImage, getImageList } from '@/api/admin/hostManage'
import { formatDateTime, formatHour } from '@/filters/index'
export default {
  data() {
    var checkTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入任务时间'))
      } else if (
        value[0] <
        new Date(this.taskList.minTime).getTime() + 5 * 60 * 1000
      ) {
        callback(
          new Error(
            '任务开始时间不得小于当台物理机的镜像更新的最后任务时间' +
              this.taskList.minTime
          )
        )
      } else {
        callback()
      }
    }
    return {
      submitLoading: false,
      allTimes: [],
      taskTableData: [],
      tableIds: [],
      imageIdList: [],
      taskRules: {
        speed: [{ required: true, message: '请输入限速', trigger: 'blur' }],
        time_limit: [
          { validator: checkTime, trigger: 'blur' },
          { validator: checkTime, trigger: 'change' }
        ]
      },
      taskList: {
        hasSpeed: false,
        name: '',
        id: '',
        speed: '',
        needTime: '',
        time_limit: '',
        taskNum: 7,
        minTime: null
      },
      loading: false,
      loadingText: '正在比对镜像版本,可能需要1-2分钟请耐心等候',
      stepActive: 1,
      newImage: null,
      imageList: '',
      multipleSelection: [],
      host_name: '',
      activeName: '',
      pickerBeginDateBefore: {
        disabledDate: time => {
          return (
            time.getTime() <
            new Date(this.taskList.minTime).setHours(0, 0, 0, 0)
          )
        }
      }
    }
  },
  created() {
    this.getImageData()
  },
  methods: {
    formatHour,
    formatDateTime,
    getImageList,
    syncImage,
    getImageData() {
      this.loading = true
      this.host_name = this.$route.query.name
      this.getImageList({ host_uuid: this.$route.params.uuid }).then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.imageList = res.data.data
          this.imageList.local_image_data.forEach((item, index) => {
            if (!(item.check_data == 'faile' || item.check_data == '0')) {
              this.imageIdList.push(item.image_info.id)
              if (item.task_info.ondo_task == '0') {
                // 获取已有任务的所有时间毫秒数
                item.task_info.task_sch_ondo_list.forEach(item => {
                  this.allTimes.push(new Date(item.start_time).getTime())
                  this.allTimes.push(new Date(item.end_time).getTime())
                })
              }
            }
          })
        }
      })
    },
    addTask() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.taskList.taskNum--
          if (this.tableIds.indexOf(parseInt(this.taskList.id)) < 0) {
            this.tableIds.push(parseInt(this.taskList.id))
            this.taskTableData.push({
              imageName: this.taskList.name,
              id: this.taskList.id,
              limitSpeed: this.taskList.speed,
              needTime: this.taskList.needTime,
              taskNum: this.taskList.taskNum,
              taskList: [
                {
                  sch_starttime: formatDateTime(this.taskList.time_limit[0]),
                  sch_endtime: formatDateTime(this.taskList.time_limit[1])
                }
              ]
            })
          } else {
            this.taskTableData.forEach(item => {
              item.taskNum = this.taskList.taskNum
              if (item.id == this.taskList.id) {
                item.taskList.push({
                  sch_starttime: formatDateTime(this.taskList.time_limit[0]),
                  sch_endtime: formatDateTime(this.taskList.time_limit[1])
                })
              }
            })
          }
          this.taskList.minTime = formatDateTime(this.taskList.time_limit[1])
          this.allTimes.push(new Date(this.taskList.time_limit[0]).getTime())
          this.allTimes.push(new Date(this.taskList.time_limit[1]).getTime())
          this.taskList.hasSpeed = true
          this.taskList.time_limit = ''
        }
      })
    },
    deleteTask(index, row, item, itemIndex) {
      if (row.taskList.length == 1) {
        this.deleteRow(index, row)
      } else {
        // 删除当前镜像任务中目标任务时间 并算出当前镜像可创建任务数量 以及最小时间
        let start_time = new Date(item.sch_starttime).getTime()
        let end_time = new Date(item.sch_endtime).getTime()
        this.allTimes.splice(this.allTimes.indexOf(start_time), 1)
        this.allTimes.splice(this.allTimes.indexOf(end_time), 1)
        this.taskTableData[index].taskNum++
        row.taskList.splice(itemIndex, 1)
        if (this.taskList.id == row.id) {
          this.taskList.taskNum = this.taskList.taskNum + 1
        }
        this.taskList.minTime = formatDateTime(
          new Date(Math.max.apply(null, this.allTimes))
        )
      }
    },
    deleteRow(index, row) {
      // 删除表格数据 并删除 tableIdS中的id 以及allTimes中的时间
      row.taskList.forEach(item => {
        let start_time = new Date(item.sch_starttime).getTime()
        let end_time = new Date(item.sch_endtime).getTime()
        this.allTimes.splice(this.allTimes.indexOf(start_time), 1)
        this.allTimes.splice(this.allTimes.indexOf(end_time), 1)
      })
      if (this.taskList.id == row.id) {
        this.taskList.taskNum = this.taskList.taskNum + row.taskList.length
      }
      this.tableIds.splice(this.tableIds.indexOf(this.taskTableData[index]), 1)
      this.taskTableData.splice(index, 1)
      this.taskList.minTime = formatDateTime(
        new Date(Math.max.apply(null, this.allTimes))
      )
    },
    selectable(row, index) {
      if (row.check_data == 'faile' || row.check_data == '0') {
        return false
      } else {
        return true
      }
    },
    getNeedTime() {
      this.multipleSelection.forEach(item => {
        if (item.image_info.id == this.taskList.id) {
          this.taskList.needTime =
            item.image_info.actual_size_mb / this.taskList.speed
        }
      })
    },
    handleTab(tab, event) {
      this.$refs['form'].resetFields()
      this.taskList.name = tab.label
      this.taskList.id = tab.name.split('_')[1]
      // 如果该镜像已有任务 则获取任务限速 以及可创建任务数量
      if (this.tableIds.indexOf(parseInt(this.taskList.id)) >= 0) {
        this.taskTableData.forEach(item => {
          if (item.id == this.taskList.id) {
            this.taskList.hasSpeed = true
            this.taskList.speed = item.limitSpeed
            this.taskList.taskNum = item.taskNum
            this.taskList.needTime = item.needTime
          }
        })
      } else {
        // 如果是新任务
        this.multipleSelection.forEach(item => {
          if (item.image_info.id == this.taskList.id) {
            if (item.task_info.ondo_task == '0') {
              this.taskList.hasSpeed = true
              this.taskList.speed = item.task_info.speed_limit
              this.taskList.taskNum = 7 - item.task_info.task_sch_ondo_num
              this.taskList.needTime =
                item.image_info.actual_size_mb / item.task_info.speed_limit
            } else {
              this.taskList.hasSpeed = false
              this.taskList.speed = ''
              this.taskList.taskNum = 7
              this.taskList.needTime = ''
            }
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length > 0) {
        this.activeName = '_' + val[0].image_info.id
        this.taskList.name =
          val[0].image_info.name +
          (val[0].image_info.type == 0 ? '系统盘' : '数据盘')
        this.taskList.id = val[0].image_info.id
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 上一步
    prev() {
      if (this.stepActive <= 1) {
        this.stepActive = 1
      } else if (this.stepActive <= 2) {
        this.stepActive--
      }
    },
    // 下一步
    next() {
      if (this.stepActive >= 1) {
        this.stepActive++
      } else if (this.stepActive >= 2) {
        this.stepActive = 2
      }
    },
    toNext() {
      if (this.multipleSelection[0].task_info.ondo_task == '0') {
        this.taskList.hasSpeed = true
        this.taskList.speed = this.multipleSelection[0].task_info.speed_limit
        this.taskList.taskNum =
          7 - this.multipleSelection[0].task_info.task_sch_ondo_num
        this.taskList.needTime =
          this.multipleSelection[0].image_info.actual_size_mb /
          this.multipleSelection[0].task_info.speed_limit
      } else {
        this.taskList.hasSpeed = false
        this.taskList.speed = null
        this.taskList.taskNum = 7
      }
      this.taskList.minTime = this.formatDateTime(
        new Date(
          Math.max.apply(null, this.allTimes.concat([new Date().getTime()]))
        )
      )
      if (this.multipleSelection.length > 20) {
        this.$message({
          type: 'error',
          message: '最多只能同时操作20个镜像更新'
        })
        return false
      } else {
        this.next()
      }
    },
    delteNewImage(row) {
      this.imageList.local_image_data.forEach((item, index) => {
        if (item.image_info.id == row.image_info.id) {
          this.imageList.local_image_data.splice(index, 1)
          return
        }
      })
    },
    selectImage() {
      if (this.imageIdList.indexOf(this.newImage.id) >= 0) {
        this.newImage = null
        this.$message({
          type: 'error',
          message: '请勿重复选择'
        })
        return
      } else {
        this.imageIdList.push(this.newImage.id)
      }
      this.newImage.type == 0
        ? (this.newImage.description = '系统盘')
        : (this.newImage.description = '数据盘')
      this.imageList.local_image_data = [
        {
          msg: '新镜像待同步',
          image_info: this.newImage
        }
      ].concat(this.imageList.local_image_data)
      this.newImage = null
    },
    submit() {
      let allTaskList = []
      this.submitLoading = true
      this.taskTableData.forEach(item => {
        allTaskList.push({
          image_id: item.id,
          task_list: item.taskList,
          start_time: this.formatDateTime(new Date()),
          speed_limit: item.limitSpeed
        })
      })
      this.syncImage(
        JSON.stringify({
          host_uuid: this.$route.params.uuid,
          image_list: allTaskList
        })
      ).then(res => {
        this.submitLoading = false
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.stepActive = 1
          this.$refs.multipleTable.clearSelection()
          this.taskTableData = []
          this.getImageData()
        }
      })
    }
  }
}
</script>
<style lang="less">
.syncPage {
  & > .title {
    padding-left: 15px;
    height: 90px;
    line-height: 90px;
    background: #fff;
    span {
      cursor: pointer;
      display: inline-block;
      padding-right: 30px;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 10px;
      margin-right: 30px;
      background: #dcdfe6;
      border-radius: 4px;
      color: #128dff;
    }
  }
  .syncContent {
    background: #fff;
    .taskConet {
      padding: 20px;
      .el-input,
      .el-date-editor.el-input {
        width: 200px !important;
      }
      .startTime {
        height: 30px;
        line-height: 30px;
        color: #40aaff;
      }
    }
    .imageList {
      padding: 20px;
      .remoteInfo {
        padding-bottom: 15px;
      }
    }
    .btnBox {
      padding-top: 20px;
      text-align: center;
    }
  }
}
</style>
