<template>
  <div class="image-list">
    <span class="image-title">镜像列表</span>
    <div class="columSel">
      <span>
        <i class="el-icon-refresh"></i>
      </span>
      <span @click="editColum">
        <i class="el-icon-menu"></i>
      </span>
    </div>
    <div class="imageTable">
      <el-table :data="tableData" :key='key' style="width: 100%" stripe>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="镜像显示名称" min-width="100">
        </el-table-column>
        <el-table-column v-for='columName in formThead' :key='columName.id' :label="columName.name">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <span class="operateBtn" @click="changeImage(scope.row)"><img src="/static/svg/edit.svg" alt=""></span>
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
    <!-- 修改镜像信息弹框 -->
    <el-dialog title="编辑镜像" :visible.sync="imageEdit" width="650px" center>
      <div class="image-box">
        <el-form ref="editForm" :model="editForm" label-width="150px">
          <el-form-item label="镜像显示名称">
            <el-input :disabled="true" v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="镜像md5">
            <el-input v-model="editForm.imageMD5"></el-input>
          </el-form-item>
          <el-form-item label="镜像实际大小(MB)">
            <el-input v-model="editForm.imageSize"></el-input>
          </el-form-item>
          <el-form-item label="镜像大小(G)">
            <el-input v-model="editForm.imageRealSize"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imageEdit = false">取  消</el-button>
        <el-button type="primary" @click="imageEdit = false">确  定</el-button>
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
      { name: '操作系统', id: 'operatingSystem' },
      { name: '版本', id: 'Edition' },
      { name: '创建时间', id: 'creatTime' },
      { name: '描述', id: 'describe' },
    ]
    return {
      store,
      tableData: [             // 表单数据
        {
          id: '13',
          name: 'kvmsit03',
          operatingSystem: 'WIN10',
          Edition: '2.0',
          creatTime: '2018/4/9',
          describe: '描述系统',
          imageMD5: '2ase54gfdaa',
          imageSize: 248,
          imageRealSize: 50
        },
      ],
      key: 1,
      formTheadOptions: [
      { name: '操作系统', id: 'operatingSystem' },
      { name: '版本', id: 'Edition' },
      { name: '创建时间', id: 'creatTime' },
      { name: '描述', id: 'describe' },
      ],
      // checkboxVal: defaultFormThead,
      formThead: defaultFormThead, // 默认表头 Default header
      // 所有列名 供用户自定义
      columArr: [
        { name: '操作系统', id: 'operatingSystem' },
        { name: '版本', id: 'Edition' },
        { name: '创建时间', id: 'creatTime' },
        { name: '描述', id: 'describe' }
      ],
      // 默认选中的值
      checkArr: [
        'operatingSystem',
        'Edition',
        'creatTime',
        'describe'
      ],
      imageEdit: false,            // 编辑镜像弹框
      editForm: {                 // 编辑镜像内容
        id: '',
        name: '',
        imageMD5: '',
        imageSize: '',
        imageRealSize: ''
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
      username : 'getUserName'
    }),
    // count() {
    //   return this.$store.state.dialog.areaManageDialog.areCreate
    // }
  },
  methods: {
    ...mapActions({
      updateUserName : 'updateUserName', // 直接当函数调 this.updateUserName(false)
      // updateDialog: 'updateDialog',
    }),
    // testchange () {
    //   this.updateDialog({
    //     tag: ['areaManageDialog', 'areCreate'],
    //     value: true
    //   })
    // },
    editColum() {                        // 编辑表单展示列
      this.store.state.hostPage.tableColumName = true
    },
    handleSizeChange(val) {              // 分页相关
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
    },
    changeImage (row) {                  // 修改镜像操作
      this.editForm = {
        id: row.id,
        name: row.name,
        imageMD5: row.imageMD5,
        imageSize: row.imageSize,
        imageRealSize: row.imageRealSize
      }
      this.imageEdit = true
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
.image-list {
  .image-title {
    font-size: 16px;
    line-height: 30px;
    font-weight: 700;
    padding-left: 5px;
    padding-top: 10px;
    display: inline-block;
  }
  .columSel {
    text-align: right;
    padding-bottom: 15px;
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
  .imageTable {
    .operateBtn {
      cursor: pointer;
      display: inline-block;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
