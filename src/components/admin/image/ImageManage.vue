<template>
  <div class="image-manage">
    <div class="image-title">镜像管理</div>
    <div class="columSel">
      <div class="operationBut">
        <el-button type="primary" @click="$router.push('/sf_cloud/workbench/imageCreate')" size="small">创建</el-button>
        <!-- <el-button type="primary" @click="changeImage()" size="small">镜像补录</el-button> -->
      </div>
      <div class="searchBtn">
        <el-input placeholder="请输入内容" v-model="search.name" class="input-with-select" width="60px" prefix-icon="el-icon-search" clearable @change="ImagesList"></el-input>
      </div>
      <span>
        <i class="el-icon-refresh" @click="ImagesList()"></i>
      </span>
      <span @click="editColum">
        <i class="el-icon-menu"></i>
      </span>
    </div>
    <div class="imageTable">
      <el-table :data="tableData" style="width: 100%" ref="multipleTable" v-loading="loading">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="name" label="显示名称" min-width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <!-- <el-table-column prop="os_type" label="操作系统" min-width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="template_instance_ip" label="模板机IP" min-width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="template_instance_status" label="模板机状态" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.template_instance_status=='0'?'运行中':'已关机'}}
          </template>
        </el-table-column>
        <el-table-column prop="image_stauts" label="镜像状态" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{formateImagethStatus(scope.row.image_stauts)}}
          </template>
        </el-table-column>
        <el-table-column prop="os_version" label="版本" min-width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间 " min-width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="message" label="任务描述 " min-width="100" :show-overflow-tooltip="true">
        </el-table-column> -->
        <el-table-column :key='columName.id' :show-overflow-tooltip='true' v-for='columName in formThead' :label="columName.name" min-width="120">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.template_instance_status!='运行中'" @click='toConsole(scope.row)'>console</el-button>
            <el-dropdown class="operateBtn" trigger="click" @command="operationImage" @click.native.prevent="deleteRow(scope.row, tableData)">
              <span class="el-dropdown-link">
                <!-- 更多 -->
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="4" :disabled="scope.row.image_stauts=='发布中'||scope.row.image_stauts=='生成镜像中'">配置镜像</el-dropdown-item>
                <el-dropdown-item command="0" :disabled="!(scope.row.image_stauts=='初始化'||scope.row.image_stauts=='使用中'||scope.row.image_stauts=='待发布')">编辑镜像</el-dropdown-item>
                <el-dropdown-item command="1" :disabled="!(scope.row.image_stauts=='编辑中')">生成镜像</el-dropdown-item>
                <!-- <el-dropdown-item command="2" :disabled='true'>console</el-dropdown-item> -->
                <el-dropdown-item command="3" :disabled="!(scope.row.image_stauts=='待发布')">发布镜像</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>
    <!-- 表格列==自定义 -->
    <tableColumNameDialog :columArr='columArr' :checkArr='checkArr' @sendColum='setColum'></tableColumNameDialog>
    <!-- 镜像操作 -->
    <el-dialog :title="imageOperation.title" :visible.sync="imageOpreationShow" width="650px" center>
      <div class="image-operation" v-loading="loading2" element-loading-text="拼命加载中">
        {{imageOperation.content}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imageOpreationShow = false" v-if="!loading2">取 消</el-button>
        <el-button type="primary" @click="totalSubmit" v-if="!loading2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改镜像信息弹框 -->
    <el-dialog title="编辑镜像" :visible.sync="imageConfig" width="750px" center>
      <el-table :data="configFormList" border style="text-align: center;">
        <el-table-column prop="description" label="磁盘类型" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="name" label="镜像名称" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="size_gb" label="镜像大小" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="镜像md5" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="!scope.row.editFlag">{{ scope.row.md5 }}</span>
            <!-- <span v-if="scope.row.editFlag" class="cell-edit-input"><el-input ref="scope.row.md5" v-model="scope.row.md5" placeholder="请输入内容"></el-input></span> -->
            <span v-if="scope.row.editFlag" class="cell-edit-input">
              <el-form :model="scope.row" ref="rules" class="demo-ruleForm">
                <el-form-item label="" prop="md5" :rules="rules.md5">
                  <el-input ref="scope.row.md5" v-model="scope.row.md5" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="镜像实际大小(MB)" :show-overflow-tooltip="true" min-width="100">
          <template slot-scope="scope">
            <span v-if="!scope.row.editFlag">{{ scope.row.actual_size_mb }}</span>
            <!-- <span v-if="scope.row.editFlag" class="cell-edit-input"><el-input ref="scope.row.actual_size_mb" v-model="scope.row.actual_size_mb" placeholder="请输入内容"></el-input></span> -->
            <span v-if="scope.row.editFlag" class="cell-edit-input">
              <el-form :model="scope.row" ref="rules" class="demo-ruleForm">
                <el-form-item label="" prop="actual_size_mb" :rules="rules.img">
                  <el-input ref="scope.row.actual_size_mb" v-model="scope.row.actual_size_mb" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <el-button v-show="!scope.row.editFlag" type="text" size="small" @click="handleEdit(scope.row,scope.$index)">编辑</el-button>
            <el-button v-show="scope.row.editFlag" trigger="click" type="text" :disabled="scope.row.md5==''||scope.row.actual_size_mb==''" size="small" @click="handleHold(scope.row)">保存</el-button>
            <el-button v-show="scope.row.editFlag" type="text" size="small" @click="backEdit(scope.row,scope.$index)">返回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import store from './../../../state'
import tableColumNameDialog from './../../common/tableColumName'
import {
  getImagesList,
  getImagesDisk,
  updateDisk,
  imageEdit,
  imageCheckout,
  imageRelease,
  getConsoleImage
} from '@/api/admin/image'
import { formateImagethStatus } from '@/filters'
export default {
  components: {
    tableColumNameDialog
  },
  mounted() {},
  data() {
    const checkMd5 = (rule, value, callback) => {
      const reg = /^[A-Za-z0-9]+$/
      if (!reg.test(value)) {
        return callback(new Error('请输入数字或字母'))
      } else {
        callback()
      }
    }
    const checkImg = (rule, value, callback) => {
      const reg = /^[0-9]+(.[0-9])?$/
      if (!reg.test(value)) {
        return callback(new Error('数字最多保留一位小数'))
      } else {
        callback()
      }
    }
    const defaultFormThead = [
      // 默认展示表单列
      { name: '操作系统', id: 'os_type' },
      { name: '模板机IP', id: 'template_instance_ip' },
      { name: '模板机状态', id: 'template_instance_status' },
      { name: '镜像状态', id: 'image_stauts' },
      { name: '版本', id: 'os_version' },
      { name: '更新时间', id: 'update_time' },
      { name: '任务描述', id: 'message' }
    ]
    return {
      store,
      tableData: [],
      image_uuid: '',
      configFormList: [],
      isOperate: false, // 判断是否是操作功能模块 是则停止定时器 不是则启动定时器
      putData: 0,
      loading: true,
      loading2: false,
      rules: {
        img: [{ required: true, validator: checkImg, trigger: 'blur' }],
        md5: [{ required: true, validator: checkMd5, trigger: 'blur' }]
      },
      key: 1,
      formTheadOptions: [
        { name: '操作系统', id: 'os_type' },
        { name: '模板机IP', id: 'template_instance_ip' },
        { name: '模板机状态', id: 'template_instance_status' },
        { name: '镜像状态', id: 'image_stauts' },
        { name: '版本', id: 'os_version' },
        { name: '更新时间', id: 'update_time' },
        { name: '任务描述', id: 'message' }
      ],
      checkboxVal: defaultFormThead,
      formThead: defaultFormThead, // 默认表头 Default header
      // 所有列名 供用户自定义
      columArr: [
        { name: '操作系统', id: 'os_type' },
        { name: '模板机IP', id: 'template_instance_ip' },
        { name: '模板机状态', id: 'template_instance_status' },
        { name: '镜像状态', id: 'image_stauts' },
        { name: '版本', id: 'os_version' },
        { name: '创建时间', id: 'update_time' },
        { name: '任务描述', id: 'message' }
      ],
      // 默认选中的值
      checkArr: [
        'os_type',
        'template_instance_ip',
        'template_instance_status',
        'image_stauts',
        'os_version',
        'update_time',
        'message'
      ],
      imageOpreationShow: false, // 镜像操作弹框
      imageOperation: {
        // 镜像操作内容
        title: '',
        content: ''
      },
      imageConfig: false, // 配置镜像操作弹框
      configForm: {
        // 配置镜像操作内容
        name: '',
        imageMD5: '',
        imageSize: '',
        imageRealSize: ''
      },
      paginationInfo: {
        // 分页
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      search: {
        name: ''
      },
      timeOut: null
    }
  },
  mounted() {
    this.ImagesList()
    setTimeout(this.refreshTable, 20000)
  },
  computed: {
    ...mapGetters({
      username: 'getUserName'
    })
  },
  methods: {
    getImagesList,
    getImagesDisk,
    updateDisk,
    formateImagethStatus,
    imageEdit,
    imageCheckout,
    imageRelease,
    getConsoleImage,
    ...mapActions({
      updateTableCloum: 'updateTableCloum' // 直接当函数调 this.updateUserName(false)
    }),
    editColum() {
      // 编辑表单展示列
      // this.store.state.hostPage.tableColumName = true
      this.isOperate = true
      // this.refreshTable()
      this.updateTableCloum(true)
    },
    handleSizeChange(val) {
      // 分页相关
      this.paginationInfo.pageSize = val
      this.ImagesList()
    },
    handleCurrentChange(val) {
      this.paginationInfo.currentPage = val
      this.ImagesList()
    },
    ImagesList(search) {
      //获取镜像展示接口
      let data = {
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(this.search) || ''
      }
      this.getImagesList(data).then(res => {
        if (res.data.code == 0) {
          for (
            let i = 0, totalData = res.data.data.rows;
            i < totalData.length;
            i++
          ) {
            totalData[i].template_instance_status =
              totalData[i].template_instance_status == '0' ? '运行中' : '已关机'
            totalData[i].image_stauts = this.formateImagethStatus(
              totalData[i].image_stauts
            )
          }
          this.paginationInfo.total = res.data.data.total

          this.tableData = res.data.data.rows
          this.loading = false
        }
      })
    },
    ImagesDisk() {
      //获取指定镜像的磁盘详细信息获取
      let data = { image_uuid: this.image_uuid }
      this.getImagesDisk(data).then(res => {
        if (res.data.code == 0) {
          // this.paginationInfo.total=res.data.data.total;
          // this.tableData=res.data.data.rows;
          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].editFlag = false
          }
          this.configFormList = res.data.data
        }
      })
    },
    deleteRow(n, b) {
      this.image_uuid = n.image_uuid
      this.image_name = n.name
    },
    // handleSelectionChange(val){
    //   console.log(val);

    // },
    operationImage(rowClass) {
      // 表格中的镜像操作
      // let showTitle, showContent
      this.putData = rowClass
      switch (rowClass) {
        case '0':
          this.imageOperation.title = '编辑镜像'
          this.imageOperation.content = '确认编辑镜像？'
          this.imageOpreationShow = true
          break
        case '1':
          this.imageOperation.title = '生成镜像'
          this.imageOperation.content = '确认生成镜像？'
          this.imageOpreationShow = true
          break
        case '2':
          this.imageOperation.title = 'console'
          this.imageOperation.content = '确认console？'
          this.imageOpreationShow = true
          break
        case '3':
          this.imageOperation.title = '发布镜像'
          this.imageOperation.content = '确认发布镜像？'
          this.imageOpreationShow = true
          break
        case '4':
          this.ImagesDisk()
          this.imageConfig = true
          break
        // default:
        //   showTitle = '编辑镜像'
        //   showContent = '确认编辑镜像？'
        //   break;
      }
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
    handleEdit(row, b) {
      this.configFormList[b].editFlag = true
    },
    backEdit(row, b) {
      this.configFormList[b].editFlag = false
    },
    // 待测
    toConsole(row) {
      this.getConsoleImage({ image_name: row.name }).then(res => {
        function setCookie(name, value) {
          var Days = 30
          var exp = new Date()
          exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
          document.cookie =
            name + '=' + escape(value) + ';expires=' + exp.toGMTString()
        }
        setCookie('token', res.data.data.host_ip + '-' + res.data.data.port)
        window.open(
          `/static/html/imagec_lite.html?name=${row.displayname}&ip=${
            row.template_instance_ip
          }`
        )
      })
    },
    handleHold(row) {
      let data = {
        id: row.id,
        md5: row.md5,
        actual_size_mb: row.actual_size_mb,
        size_gb: row.size_gb
      }
      this.updateDisk(data).then(res => {
        if (res.data.code == 0) {
          this.imageConfig = false
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        }
      })
    },
    totalSubmit() {
      this.loading2 = true
      let data = { image_name: this.image_name }
      switch (this.putData) {
        case '0':
          this.imageEdit(data).then(res => {
            this.loading2 = false
            this.imageOpreationShow = false
            if (res.data.code == 0) {
              // this.imageConfig = false
              this.ImagesList()
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            }
          })
          break
        case '1':
          this.imageCheckout(data).then(res => {
            this.loading2 = false
            this.imageOpreationShow = false
            if (res.data.code == 0) {
              // this.imageConfig = false
              this.ImagesList()
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            }
          })
          break
        case '2':
          this.loading2 = false
          this.imageOpreationShow = false
          this.imageOperation.title = 'console'
          this.imageOperation.content = '确认console？'
          // this.imageOpreationShow = true
          break
        case '3':
          // this.imageConfig = false

          this.imageRelease(data).then(res => {
            this.loading2 = false
            this.imageOpreationShow = false
            // this.loading=false
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.ImagesList()
              // this.imageConfig = false
              // this.$message({
              //     message: res.data.msg,
              //     type: 'success'
              //   });
            }
          })
          break
        // default:
        //   showTitle = '编辑镜像'
        //   showContent = '确认编辑镜像？'
        //   break;
      }
    },
    refreshTable() {
      if (this.timeOut) {
        clearInterval(this.timeOut)
      }
      if (!this.isOperate) {
        this.ImagesList()
        this.timeOut = setTimeout(() => {
          this.refreshTable()
        }, 120000)
      }
    }
  },
  watch: {
    imageOpreationShow(val) {
      if (!val) {
        this.loading2 = false
      }
    }
  },
  destroyed() {
    this.isOperate = true
  }
}
</script>
<style lang="less" scoped>
.image-manage {
  .image-title {
    margin-left: 10px;
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    line-height: 50px;
    font-weight: 700;
    margin-right: 20px;
    max-width: 70%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .columSel {
    margin-left: 10px;
    text-align: right;
    padding-bottom: 15px;
    .operationBut {
      float: left;
      // padding-left: 5px;
    }
    span {
      display: inline-block;
      width: 32px;
      height: 30px;
      line-height: 30px;
      font-size: 22px;
      margin-left: 10px;
      vertical-align: middle;
      box-sizing: border-box;
      text-align: center;
      border: 1px solid #ccc;
      color: #2277da;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .imageTable {
    .operateBtn {
      color: #128dff;
      cursor: pointer;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
  }
  .image-operation {
    font-size: 18px;
    text-align: center;
    padding: 30px 0;
  }
}
form {
  text-align: right;
}
// table td>div,table th>div{
//   text-align: center
// }
.el-table th > div,
.el-table td > div {
  text-align: left;
}
.el-table .cell {
  text-overflow: ellipsis;
  white-space: nowrap;
}
.searchBtn {
  display: inline-block;
  // float: right;
}
</style>
