<template>
  <div class="image-create">
    <div class="image-title">
      <span class="back" @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>返回</span>
      创建镜像
    </div>
    <div class="creat-content" v-loading="loading" element-loading-text="提交中，耐心等待...">
      <el-tabs v-model="createClass" type="card" @tab-click="switchTabs">
        <el-tab-pane label="新建镜像" name="1">
          <el-form ref="newImage" :model="selectImage" :rules='editRules' label-width="120px">
            <el-form-item label="镜像用途" prop="available_user">
              <el-select v-model="selectImage.available_user" @change="switchAvailable" placeholder="请选择镜像用途">
                <el-option v-for="item in newImageObj.available_user" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="showCase==1||showCase==2" label="所属租户" prop="tenant_uuid">
              <el-select v-model="selectImage.tenant_uuid" @change='switchTenant' placeholder="请选择所属租户">
                <el-option v-for="item in newImageObj.tenantList" :key="item.tenant_uuid" :label="item.tenant_name" :value="item.tenant_uuid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="(showCase==2)&&(selectImage.tenant_uuid!='')" label="所属项目" prop="project_uuid">
              <el-select v-model="selectImage.project_uuid" placeholder="请选择所属项目">
                <el-option v-for="item in newImageObj.projectList" :key="item.project_uuid" :label="item.project_name" :value="item.project_uuid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作系统" prop="systemType">
              <el-select v-model="selectImage.systemType" @change='switchSystem' placeholder="请选择操作系统">
                <el-option v-for="item in newImageObj.systemList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="selectImage.systemType!=''" label="系统版本" prop="systemVer">
              <el-select v-model="selectImage.systemVer" filterable placeholder="请选择镜像名称">
                <el-option v-for="item in newImageObj.systemVer" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="镜像名称" prop="imageName">
              <el-input v-model="selectImage.imageName" placeholder="请输入镜像名称（必须是英文字母或_组成）"></el-input>
            </el-form-item>
            <el-form-item label="镜像显示名称" prop="displayName">
              <el-input v-model="selectImage.displayName" placeholder="请输入镜像显示名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('newImage')">确认创建</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="从已有镜像生成新镜像" name="2">
          <el-form ref="newImageTwo" :model="selectImageTwo" :rules='editRules' label-width="120px">
            <el-form-item label="镜像用途" prop="available_user">
              <el-select v-model="selectImageTwo.available_user" @change="switchAvailable" placeholder="请选择镜像用途">
                <el-option v-for="item in newImageObjTwo.available_user" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="showCaseTwo==1||showCaseTwo==2" label="所属租户" prop="tenant_uuid">
              <el-select v-model="selectImageTwo.tenant_uuid" @change='switchTenant' placeholder="请选择所属租户">
                <el-option v-for="item in newImageObjTwo.tenantList" :key="item.tenant_uuid" :label="item.tenant_name" :value="item.tenant_uuid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="(showCaseTwo==2)&&(selectImageTwo.tenant_uuid!='')" label="所属项目" prop="project_uuid">
              <el-select v-model="selectImageTwo.project_uuid" placeholder="请选择所属项目">
                <el-option v-for="item in newImageObjTwo.projectList" :key="item.project_uuid" :label="item.project_name" :value="item.project_uuid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作系统" prop="systemType">
              <el-select v-model="selectImageTwo.systemType" @change='switchSystem' placeholder="请选择操作系统">
                <el-option v-for="item in newImageObjTwo.systemList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="selectImageTwo.systemType!=''" label="系统版本" prop="systemVer">
              <el-select v-model="selectImageTwo.systemVer" filterable @change="switchVer" placeholder="请选择镜像名称">
                <el-option v-for="item in newImageObjTwo.systemVer" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="selectImageTwo.systemVer!=''" label="原镜像名称" prop="source_image_name">
              <el-select v-model="selectImageTwo.source_image_name" filterable placeholder="请选择原镜像名称">
                <el-option v-for="item in newImageObjTwo.sourceImageList" :key="item.image_name" :label="item.image_name" :value="item.image_name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="镜像名称" prop="imageName">
              <el-input v-model="selectImageTwo.imageName" placeholder="请输入镜像名称（必须是英文字母或_组成）"></el-input>
            </el-form-item>
            <el-form-item label="镜像显示名称" prop="displayName">
              <el-input v-model="selectImageTwo.displayName" placeholder="请输入镜像显示名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('newImageTwo')">确认创建</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getUseTenant } from '@/api/admin/vm'
import {
  createInitImages,
  createNewImages,
  imageExistInit,
  CreateImageExist
} from '@/api/admin/image'
export default {
  components: {},
  mounted() {
    this.getCreateInitImages()
  },
  data() {
    return {
      createClass: '1', // 创建镜像种类
      loading: false,
      showCaseTwo: 0,
      selectImageTwo: {
        systemType: '',
        systemVer: '',
        imageName: '',
        displayName: '',
        available_user: null,
        tenant_uuid: '',
        project_uuid: null,
        source_image_name: null
      },
      newImageObjTwo: {
        systemList: [],
        systemVerList: [],
        systemVer: [],
        available_user: [
          { value: '0', label: '公共镜像' },
          { value: '1', label: '租户专属镜像' },
          { value: '2', label: '项目专属镜像' },
          { value: '3', label: 'saas服务镜像' }
        ],
        tenantList: [],
        projectList: [],
        sourceImageList: [],
        sourceImageLocalList: [] //缓存数据
        // imageName:'',
        // displayName:''
      },
      showCase: 0,
      selectImage: {
        systemType: '',
        systemVer: '',
        imageName: '',
        displayName: '',
        available_user: null,
        tenant_uuid: '',
        project_uuid: null
      },
      newImageObj: {
        systemList: [],
        systemVerList: [],
        systemVer: [],
        available_user: [
          { value: '0', label: '公共镜像' },
          { value: '1', label: '租户专属镜像' },
          { value: '2', label: '项目专属镜像' },
          { value: '3', label: 'saas服务镜像' }
        ],
        tenantList: [],
        projectList: []
      },
      editRules: {
        available_user: [
          { required: true, message: '请选择输入镜像用途', trigger: 'change' }
        ],
        tenant_uuid: [
          { required: true, message: '请选择所属租户', trigger: 'change' }
        ],
        project_uuid: [
          { required: true, message: '请选择所属项目', trigger: 'change' }
        ],
        systemType: [
          { required: true, message: '请选择输入系统版本', trigger: 'change' }
        ],
        systemVer: [
          { required: true, message: '请选择输入系统版本', trigger: 'change' }
        ],
        imageName: [
          { required: true, message: '请选择输入镜像名称', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请选择输入镜像显示名称', trigger: 'blur' }
        ],
        source_image_name: [
          { required: true, message: '请选择输入原镜像名称', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    createInitImages,
    createNewImages,
    getUseTenant,
    imageExistInit,
    CreateImageExist,
    getCreateInitImages() {
      this.createInitImages({}).then(res => {
        if (res.data.code == 0) {
          this.newImageObjTwo.systemList = this.newImageObj.systemList =
            res.data.data.os_type
          this.newImageObjTwo.systemVerList = this.newImageObj.systemVerList =
            res.data.data.os_ver_list
          this.switchSystem()
        }
      })
      this.getUseTenant({}).then(res => {
        if (res.data.code == 0) {
          this.newImageObjTwo.tenantList = this.newImageObj.tenantList =
            res.data.data
        }
      })
      this.imageExistInit({}).then(res => {
        if (res.data.code == 0) {
          this.newImageObjTwo.sourceImageLocalList = res.data.data
        }
      })
    },
    switchSystem() {
      //操作系统对应的系统版本
      if (this.createClass == 1) {
        for (
          let i = 0, res = this.newImageObj.systemVerList;
          i < res.length;
          i++
        ) {
          if (res[i].OS_TYPE == this.selectImage.systemType) {
            this.newImageObj.systemVer = res[i].OS_VER
          }
        }
      } else {
        this.selectImageTwo.systemVer = ''
        this.selectImageTwo.source_image_name = ''
        for (
          let i = 0, res = this.newImageObjTwo.systemVerList;
          i < res.length;
          i++
        ) {
          if (res[i].OS_TYPE == this.selectImageTwo.systemType) {
            this.newImageObjTwo.systemVer = res[i].OS_VER
          }
        }
        if (this.selectImageTwo.systemVer != '') {
          this.switchVer()
        }
      }
    },
    switchAvailable() {
      //镜像用途
      if (this.createClass == 1) {
        this.showCase = this.selectImage.available_user
        if (!(this.showCase == 1 || this.showCase == 2)) {
          this.selectImage.tenant_uuid = ''
          this.selectImage.project_uuid = null
        }
        if (!(this.showCase == 2)) {
          // this.selectImage.tenant_uuid=''
          this.selectImage.project_uuid = null
        }
      } else {
        this.showCaseTwo = this.selectImageTwo.available_user
        // console.log(this.showCaseTwo)
        if (!(this.showCaseTwo == 1 || this.showCaseTwo == 2)) {
          this.selectImageTwo.tenant_uuid = ''
          this.selectImageTwo.project_uuid = null
        }
        if (!(this.showCaseTwo == 2)) {
          // this.selectImage.tenant_uuid=''
          this.selectImageTwo.project_uuid = null
        }
      }
    },
    switchTenant() {
      //租户对应项目
      if (this.createClass == 1) {
        if (!(this.showCase == 2 && this.selectImage.tenant_uuid != '')) {
          this.selectImage.project_uuid = null
        }
        for (
          let i = 0, res = this.newImageObj.tenantList;
          i < res.length;
          i++
        ) {
          if (res[i].tenant_uuid == this.selectImage.tenant_uuid) {
            this.newImageObj.projectList = res[i].project_info
          }
        }
      } else {
        if (!(this.showCaseTwo == 2 && this.selectImageTwo.tenant_uuid != '')) {
          this.selectImageTwo.project_uuid = null
        }
        for (
          let i = 0, res = this.newImageObjTwo.tenantList;
          i < res.length;
          i++
        ) {
          if (res[i].tenant_uuid == this.selectImageTwo.tenant_uuid) {
            this.newImageObjTwo.projectList = res[i].project_info
            // console.log(res[i].project_info);
          }
        }
      }
    },
    switchVer() {
      //系统版本对应原镜像名称
      this.selectImageTwo.source_image_name = ''
      this.newImageObjTwo.sourceImageList = []
      for (
        let i = 0, res = this.newImageObjTwo.sourceImageLocalList;
        i < res.length;
        i++
      ) {
        if (
          res[i].os_type == this.selectImageTwo.systemType &&
          res[i].os_version == this.selectImageTwo.systemVer
        ) {
          this.newImageObjTwo.sourceImageList.push(res[i])
        }
      }
      // console.log(arr)
      // this.newImageObjTwo.sourceImageList=arr
    },
    switchTabs() {},
    submitForm(formName) {
      if (this.createClass == 1) {
        let data = {
          image_name: this.selectImage.imageName,
          displayname: this.selectImage.displayName,
          os_type: this.selectImage.systemType,
          os_version: this.selectImage.systemVer,
          available_user: this.selectImage.available_user,
          tenant_uuid: this.selectImage.tenant_uuid,
          project_uuid: this.selectImage.project_uuid
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true
            this.createNewImages(data).then(res => {
              this.loading = false
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                this.$router.push('/sf_cloud/workbench/imageManage')
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        let data = {
          image_name: this.selectImageTwo.imageName,
          displayname: this.selectImageTwo.displayName,
          os_type: this.selectImageTwo.systemType,
          os_version: this.selectImageTwo.systemVer,
          available_user: this.selectImageTwo.available_user,
          tenant_uuid: this.selectImageTwo.tenant_uuid,
          project_uuid: this.selectImageTwo.project_uuid,
          source_image_name: this.selectImageTwo.source_image_name
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true
            this.CreateImageExist(data).then(res => {
              this.loading = false
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                this.$router.push('/sf_cloud/workbench/imageManage')
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.image-create {
  .image-title {
    font-size: 14px;
    display: inline-block;
    padding-top: 15px;
    .back {
      color: #128dff;
      cursor: pointer;
      margin: 0 15px;
    }
  }
  .creat-content {
    margin-top: 20px;
    .el-form {
      padding-left: 50px;
    }
    .el-select {
      width: 300px;
    }
    .el-input {
      width: 300px;
    }
  }
}
</style>
