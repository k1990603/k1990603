<template>
  <div class="certificate-list">
    <div class="defaultScope">
      <div class="curPage">证书管理</div>
    </div>
    <div class="columSel">
      <el-button type="primary" @click="creatEdit = true" size="small">新建</el-button>
      <div class="lb-search">
        <el-input placeholder="请输入内容" :disabled="!search.isName" @keyup.enter='changeSearch' @change='changeSearch' size="small" v-model.trim="search.searchText" class="input-with-select">
          <el-cascader clearable :props='props' v-model="search.searchKey" style='width:120px;background-color:#fff;' @change='cascaderChange' :options="search.selectList" size='small' :show-all-levels="false" slot="prepend"></el-cascader>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <span class="lb-but">
        <i class="el-icon-refresh" @click='changeSearch'></i>
      </span>
    </div>
    <div class="imageTable">
      <el-table :data="tableData" :key='key' style="width: 100%" stripe>
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="name" label="ID/名称" min-width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="is_used" label="是否已使用" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.is_used=='0'?"已使用":'未使用'}}
          </template>
        </el-table-column>
        <el-table-column prop="available_tenant" label="证书用途" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.available_tenant=='0'?"公用":'租户专用'}}
          </template>
        </el-table-column>
        <el-table-column v-for='columName in formThead' :show-overflow-tooltip="true" :key='columName.id' :label="columName.name" min-width="120">
          <template slot-scope="scope">
            {{scope.row[columName.id]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope" v-if="scope.row.available_tenant!='0'">
            <span class="operateBtn" @click='updateCer(scope.row)'>更新</span>
            <span class="operateBtn" @click="deleteCer(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>
    <!-- 新建证书弹框 -->
    <el-dialog title="新建证书" class="dialogTemplate" :visible.sync="creatEdit" width="650px" center>
      <div class="creatCertificate">
        <el-form ref="createForm" :model="editForm" :rules='createRules' label-width="120px">
          <el-form-item label="证书名称" prop='name'>
            <el-col :span="12">
              <el-input type='text ' v-model.trim="editForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="证书类型" prop='type'>
            <el-select v-model="editForm.type" filterable placeholder="请选择">
              <el-option label="客户端证书" value="0">
              </el-option>
              <el-option label="服务器证书" value="1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证书内容" prop='content'>
            <el-col :span="16">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入内容" v-model="editForm.content">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="密钥内容" prop='keyContent'>
            <el-col :span="16">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="客户端证书非必填此项" v-model="editForm.keyContent">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancelCreate">取 消</el-button>
            <el-button type="primary" @click="createSubmit">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog title="更新证书" class="dialogTemplate" :visible.sync="updateStatu" width="650px" center>
      <div class="creatCertificate">
        <el-form ref="updateForm" :model="updateForm" :rules='updateRules' label-width="120px">
          <el-form-item label="证书名称">
            <el-col :span="12">
              <el-input type='text' disabled v-model.trim="rowInfo.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="证书类型">
            <el-col :span="12">
              <el-input type='text' disabled v-model.trim="rowInfo.type=='0'?'客户端证书':'服务器端证书'"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="证书内容" prop='content'>
            <el-col :span="16">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入内容" v-model="updateForm.content">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancelupdate">取 消</el-button>
            <el-button type="primary" @click="updateSubmit">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 删除证书   -->
    <el-dialog title="删除证书" class="dialogTemplate" :visible.sync="deleteStatu" width="650px" center>
      <div class="deleteContent ">
        <div class="oldInfo">
          <div class="itemInfo">
            <label>名称</label>
            <span>{{rowInfo.name}}</span>
          </div>
          <div class="itemInfo">
            <label>证书类型</label>
            <span>{{rowInfo.type=='0'?'客户端证书':'服务器端证书'}}</span>
          </div>
          <!-- <div class="itemInfo">
            <label>证书内容</label>
            <span>{{rowInfo.contain}}</span>
          </div>
          <div class="itemInfo">
            <label>密钥内容</label>
            <span>{{rowInfo.private_key}}</span>
          </div> -->
        </div>
        <div class="tipText">
          确定执行
          <span>删除</span>
          操作？
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteSubmit">确 定</el-button>
        <el-button @click="cancelDelete">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getCertificateList,
  createCertificate,
  upDateCertificate,
  deleteCertificate
} from '@/api/admin/lb'
import { checkUserName } from '@/filters/index'

export default {
  components: {},
  data() {
    const checkUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入证书名称'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('证书名格式不正确(大小写字母+数字6-20位)'))
      } else {
        callback()
      }
    }
    const checkKeyContent = (rule, value, callback) => {
      if (this.editForm.type == '1') {
        if (value === '') {
          callback(new Error('请输入证书密钥'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const defaultFormThead = [
      // 默认展示表单列
      { name: '证书类型', id: '_type' },
      { name: '上传时间', id: 'created_at' },
      { name: 'md5', id: 'contain_md5' },
      { name: '所属租户', id: 'tenant_name' }
    ]
    return {
      curTenant_uuid: '',
      rowInfo: {},
      updateStatu: false, // 更新证书状态
      creatEdit: false, // 创建负载均衡弹框
      deleteStatu: false,
      tenant_list: [], // 租户集合
      updateForm: {
        content: ''
      },
      updateRules: {
        content: [
          { required: true, message: '请输入证书内容', trigger: 'blur' }
        ]
      },
      createRules: {
        tenant_uuid: [
          { required: true, message: '请选择租户', trigger: 'change' }
        ],
        name: [{ validator: checkUserName, trigger: 'blur' }],
        type: [
          { required: true, message: '请选择证书类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入证书内容', trigger: 'blur' }
        ],
        keyContent: [{ validator: checkKeyContent, trigger: 'blur' }]
      },
      editForm: {
        // 新建证书表单
        tenant_uuid: '',
        name: '',
        type: '',
        content: '',
        keyContent: ''
      },
      tableData: [],
      paginationInfo: {
        // 分页
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      props: {
        value: 'tenant_uuid',
        label: 'tenant_name',
        children: 'children'
      },
      search: {
        isName: true,
        searchKey: [],
        searchText: '',
        selectList: [
          {
            tenant_name: '证书名称',
            tenant_uuid: 'name'
          },
          {
            tenant_name: '公用证书',
            tenant_uuid: 'all'
          }
        ]
      },
      key: 1,
      formThead: defaultFormThead // 默认表头 Default header
    }
  },
  mounted() {
    this.curTenant_uuid = this.userInfo.tenantInfo.tenant_uuid
    this.getList()
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    checkUserName,
    createCertificate,
    upDateCertificate,
    deleteCertificate,
    getCertificateList,
    cancelupdate() {
      this.updateStatu = false
      this.$refs['updateForm'].resetFields()
      this.changeSearch()
    },
    updateSubmit() {
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          let options = {
            name: this.rowInfo.name,
            uuid: this.rowInfo.uuid,
            // certificate_type: this.rowInfo.type,
            certificate_contain: this.updateForm.content,
            user_role: '1'
            // tenant_uuid: this.curTenant_uuid,
            // user_role: '1'
          }
          this.upDateCertificate(options).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '更新成功'
              })
              this.cancelupdate()
            }
          })
        }
      })
    },
    updateCer(row) {
      this.rowInfo = row
      this.updateStatu = true
    },
    cancelDelete() {
      this.deleteStatu = false
      this.changeSearch()
    },
    deleteSubmit() {
      this.deleteCertificate({
        certificate_uuid: this.rowInfo.uuid,
        is_used: this.rowInfo.is_used,
        certificate_name: this.rowInfo.name,
        user_role: '1'
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.cancelDelete()
        }
      })
    },
    deleteCer(row) {
      this.rowInfo = row
      this.deleteStatu = true
    },
    cancelCreate() {
      this.creatEdit = false
      this.$refs['createForm'].resetFields()
      this.changeSearch()
    },
    createSubmit() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          let options = {
            name: this.editForm.name,
            certificate_type: this.editForm.type,
            certificate_contain: this.editForm.content,
            private_key: this.editForm.keyContent,
            tenant_uuid: this.curTenant_uuid,
            available_tenant: '1',
            user_role: '1'
          }
          this.createCertificate(options).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.cancelCreate()
            }
          })
        }
      })
    },
    cascaderChange(val) {
      if (this.search.searchKey[0] == 'name') {
        this.search.isName = true
      } else if (this.search.searchKey[0] == 'all') {
        this.search.isName = false
        this.getList({ tenant: 'all' })
      } else {
        this.search.isName = false
        this.getList()
      }
    },
    changeSearch() {
      let options = {}
      if (this.search.searchText != '') {
        options.certificate_name = this.search.searchText
        this.getList(options)
      } else {
        this.getList()
      }
    },
    getList(search) {
      this.getCertificateList({
        tenant_uuid: this.curTenant_uuid,
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        user_role: 1,
        search: JSON.stringify(search) || {}
      }).then(res => {
        if (res.data.code == 0) {
          res.data.data.rows.forEach(item => {
            item._type = item.type == '0' ? '客户端' : '服务器端'
          })
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // 分页相关
      this.paginationInfo.pageSize = val
      this.changeSearch()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.changeSearch()
    }
  },
  watch: {}
}
</script>
<style lang="less">
.certificate-list {
  .deleteContent {
    .tipText {
      margin-bottom: 15px;
      padding: 15px 10px;
      vertical-align: middle;
      color: #264663;
      border: 1px solid #7ab1de;
      border-radius: 2px;
      background: #d2e7f7;
      margin-top: 15px;
      font-size: 16px;
      span {
        font-size: 18px;
        color: #f00;
      }
    }
    .oldInfo {
      & > h3 {
        margin-bottom: 15px;
      }
      .itemInfo {
        font-size: 16px;
        padding-left: 15px;
        padding-bottom: 15px;
        & > label {
          width: 120px;
          display: inline-block;
        }
        & > span {
          color: #999;
        }
        & > .nameBox {
          display: inline-block;
        }
        &.textAreaBox {
          & > label {
            vertical-align: top;
          }
          .nameBox {
            width: 400px;
          }
        }
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
  .columSel {
    text-align: right;
    padding: 15px 5px;
    .el-button--small {
      float: left;
    }
    .el-input-group__prepend {
      padding: 0;
      border: 0;
      // .el-cascader {
      //   background: #fff;
      // }
    }
    .lb-search {
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
    padding: 15px;
    .el-input,
    .el-select {
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
