<template>
  <div class="transfer-list">
    <div class="image-title">迁移
    </div>
    <div class="columSel">
      <el-button type="primary" @click="esxEdit = true" size="small">ESX</el-button>
      <el-button type="success" size="small">ESX批量</el-button>
      <el-button type="primary" @click="$router.push('/sf_cloud/workbench/openstack')" size="small">Openstack</el-button>
      <el-button type="success" size="small">Openstack批量迁移</el-button>
      <div class="lb-search">
        <el-input placeholder="请输入内容" size="small" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <span class="lb-but">
        <i class="el-icon-refresh"></i>
      </span>
      <span class="lb-but" @click="editColum">
        <i class="el-icon-menu"></i>
      </span>
    </div>
    <div class="imageTable">
      <el-table :data="tableData" :key='key' style="width: 100%" stripe>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column v-for='columName in formThead' :key='columName.id' :label="columName.name">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <span class="operateBtn">删除</span>
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
    <!-- ESX弹框 -->
    <el-dialog title="ESX" :visible.sync="esxEdit" width="650px" center>
      <div class="creatCertificate">
        <div class="prompt">请确保虚拟机正常运行,vmtools运行正常！</div>
        <el-form ref="editForm" :model="editForm" label-width="150px">
          <el-form-item label="ESX ROOT密码">
            <el-input v-model="editForm.name" placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="ESX环境">
            <el-input v-model="editForm.name" placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="VM IP">
            <el-input v-model="editForm.name" placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="VM 名称">
            <el-input v-model="editForm.name" placeholder="请填写"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="esxEdit = false">取  消</el-button>
        <el-button type="primary" @click="esxEdit = false">确  定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import store from './../../../state'
import tableColumNameDialog from './../../common/tableColumName'
export default {
  components: {
    tableColumNameDialog
  },
  mounted() {
  },
  data() {
    const defaultFormThead = [ // 默认展示表单列
      { name: 'VMIP', id: 'ip' },
      { name: '任务ID', id: 'id'},
      { name: '开始时间', id: 'startTime'},
      { name: '结束时间', id: 'endTime'},
      { name: '任务进程', id: 'process'},
      { name: '任务状态', id: 'type'},
      { name: '任务来源', id: 'source'},
      { name: '任务详情', id: 'details'},
      { name: '操作者', id: 'operation'}
    ]
    return {
      store,
      tableData: [              // 表单展示数据
        {
          ip: '10.202.10.265',
          id: 'asd-g4e6r4',
          startTime: '2018/4/8',
          endTime: '2018/10/8',
          process: 'start',
          type: '已完成',
          source: '迁移',
          details: '删除虚拟机临时文件',
          operation: '安轲大侠',
        }
      ],
      key: 1,
      formTheadOptions: [
        { name: 'VMIP', id: 'ip' },
        { name: '任务ID', id: 'id'},
        { name: '开始时间', id: 'startTime'},
        { name: '结束时间', id: 'endTime'},
        { name: '任务进程', id: 'process'},
        { name: '任务状态', id: 'type'},
        { name: '任务来源', id: 'source'},
        { name: '任务详情', id: 'details'},
        { name: '操作者', id: 'operation'}
      ],
      // checkboxVal: defaultFormThead,
      formThead: defaultFormThead, // 默认表头 Default header
      // 所有列名 供用户自定义
      columArr: [
        { name: 'VMIP', id: 'ip' },
        { name: '任务ID', id: 'id'},
        { name: '开始时间', id: 'startTime'},
        { name: '结束时间', id: 'endTime'},
        { name: '任务进程', id: 'process'},
        { name: '任务状态', id: 'type'},
        { name: '任务来源', id: 'source'},
        { name: '任务详情', id: 'details'},
        { name: '操作者', id: 'operation'}
      ],
      // 默认选中的值
      checkArr: [
        'ip',
        'id',
        'startTime',
        'endTime',
        'process',
        'type',
        'source',
        'details',
        'operation',
      ],
      esxEdit: false,            // 创建负载均衡弹框
      editForm: {                  // 新建证书表单
        name: '',
      },
      paginationInfo: {            // 分页
        total: 100,
        pageSize: 10,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      }
    }
  },
  computed : {
    ...mapGetters({
    }),
    // count() {
    //   return this.$store.state.dialog.areaManageDialog.areCreate
    // }
  },
  methods: {
    ...mapActions({
    }),
    editColum() {                        // 编辑表单展示列
      this.store.state.hostPage.tableColumName = true
    },
    handleSizeChange(val) {              // 分页相关
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
    },
    setColum(columNew) {                 // 设置用户自定的列显示
      // this.checkboxVal = columNew
      this.checkArr = columNew
      this.formThead = this.formTheadOptions.filter(
        i => columNew.indexOf(i.id) >= 0
      )
      console.log(this.formThead)
      this.key = this.key + 1 // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  watch: {
  }
}
</script>
<style lang="less">
.transfer-list {
  .image-title {
    font-size: 16px;
    line-height: 30px;
    font-weight: 700;
    padding-left: 5px;
    padding-top: 10px;
    display: inline-block;
    .el-select {
      width: 150px;
      margin-left: 15px;
    }
  }
  .columSel {
    text-align: right;
    padding: 15px 5px;
    .el-button--small {
      float: left;
    }
    .lb-search {
      width: 250px;
      display: inline-block;
      vertical-align: top;
    }
    .lb-but {
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
  .creatCertificate {
    .prompt {
      color: red;
      padding: 15px 30px;
    }
    .el-input, .el-select {
      width: 217px;
    }
  }
  .dialog-footer {
    display: inline-block;
    text-align: center;
  }
  .imageTable {
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
