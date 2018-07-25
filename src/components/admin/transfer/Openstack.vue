<template>
  <div class="openstack">
    <div class="image-title">
      <span class="back" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>返回</span>
      Openstack
    </div>
    <div class="creat-content">
      <el-form ref="newImage" :model="newImage" label-width="120px">
        <el-form-item label="Openstack环境">
          <el-select v-model="newImage.operationSystem" placeholder="请选择Openstack环境">
            <el-option label="区域一" value="0"></el-option>
            <el-option label="区域二" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="VM名称">
          <el-input v-model="newImage.imageName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="VM IP">
          <el-input v-model="newImage.imageName" placeholder="请输入IP"></el-input>
        </el-form-item>
        <el-form-item label="VM所在网段">
          <el-input v-model="newImage.showName" placeholder="请输入网段"></el-input>
        </el-form-item>
        <el-form-item label="集群">
          <el-select v-model="newImage.operationSystem" placeholder="请选择集群">
            <el-option label="区域一" value="0"></el-option>
            <el-option label="区域二" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="VM类型">
          <el-select v-model="newImage.operationSystem" placeholder="请选择类型">
            <el-option label="区域一" value="0"></el-option>
            <el-option label="区域二" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网络类型">
          <el-radio-group v-model="newImage.operationSystem" size="small">
            <el-radio-button label="SIT"></el-radio-button>
            <el-radio-button label="DMZ"></el-radio-button>
            <el-radio-button label="专有网络"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专有网络">
          <el-select v-model="newImage.operationSystem" placeholder="请选择专有网络">
            <el-option label="区域一" value="0"></el-option>
            <el-option label="区域二" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子网">
          <el-select v-model="newImage.operationSystem" placeholder="请选择子网">
            <el-option label="区域一" value="0"></el-option>
            <el-option label="区域二" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-select v-model="newImage.operationSystem" placeholder="请选择项目">
            <el-option label="区域一" value="0"></el-option>
            <el-option label="区域二" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="CPU">
          <el-select v-model="newImage.operationSystem" placeholder="请选择CPU数量">
            <el-option label="区域一" value="0"></el-option>
            <el-option label="区域二" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="MEM">
          <el-select v-model="newImage.operationSystem" placeholder="请选择MEM">
            <el-option label="区域一" value="0"></el-option>
            <el-option label="区域二" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">确认创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  mounted() {
  },
  data() {
    return {
      systemList: [{value: 'test1', label: 'test1'}],
      newImage: {        // 新建镜像字段
        operationSystem: '0',
        systemType: null,
        imageName: '',
        showName: ''
      }
    }
  },
  computed : {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.openstack {
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
