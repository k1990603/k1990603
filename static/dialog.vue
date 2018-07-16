<template>
  <div class="areaCreate dialogTemplate">
    <el-dialog width="30%" title="区域创建" :visible.sync="areCreateVisible" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="区域" prop="parentArea">
          <el-cascader placeholder="请选择父区域(可不选)" @change="getSelVal" :options="ruleForm.soureceOptions" filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="子区域" prop="childArea" required>
          <el-input type="text" v-model="ruleForm.childArea"></el-input>
        </el-form-item>
        <el-form-item label="管理员" prop="admin" required>
          <el-input type="text" v-model="ruleForm.admin"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="areCreateVisible = false">取 消</el-button>
        <el-button type="primary" @click="areCreateVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from './../../../../state'
export default {
  data() {
    return {
      store,
      ruleForm: {
        soureceOptions: [
          {
            value: '广东',
            label: '广东区',
            children: [
              {
                value: 'shejiyuanze',
                label: '广东一区',
                children: [
                  {
                    value: 'yizhi',
                    label: '机房一',
                    children: [
                      {
                        value: 'yizhi',
                        label: '集群一'
                      }
                    ]
                  },
                  {
                    value: 'fankui',
                    label: '机房二'
                  },
                  {
                    value: 'xiaolv',
                    label: '机房三'
                  },
                  {
                    value: 'kekong',
                    label: '机房四'
                  }
                ]
              },
              {
                value: 'daohang',
                label: '广东二区',
                children: [
                  {
                    value: 'cexiangdaohang',
                    label: '机房一',
                    children: [
                      {
                        value: 'yizhi',
                        label: '集群一'
                      }
                    ]
                  },
                  {
                    value: 'dingbudaohang',
                    label: '机房二'
                  }
                ]
              }
            ]
          },
          {
            value: '北京',
            label: '北京区',
            children: [
              {
                value: 'shejiyuanze',
                label: '广东一区',
                children: [
                  {
                    value: 'yizhi',
                    label: '机房一',
                    children: [
                      {
                        value: 'yizhi',
                        label: '集群一'
                      }
                    ]
                  },
                  {
                    value: 'fankui',
                    label: '机房二'
                  },
                  {
                    value: 'xiaolv',
                    label: '机房三'
                  },
                  {
                    value: 'kekong',
                    label: '机房四'
                  }
                ]
              },
              {
                value: 'daohang',
                label: '广东二区',
                children: [
                  {
                    value: 'cexiangdaohang',
                    label: '机房一',
                    children: [
                      {
                        value: 'yizhi',
                        label: '集群一'
                      }
                    ]
                  },
                  {
                    value: 'dingbudaohang',
                    label: '机房二'
                  }
                ]
              }
            ]
          }
        ],
        parentArea: '',
        childArea: '',
        admin: ''
      },
      rules: {
        childArea: [
          { required: true, message: '请填写子区域', trigger: 'blur' }
        ],
        admin: [{ required: true, message: '请填写管理员', trigger: 'blur' }]
      }
    }
  },
  computed: {
    areCreateVisible: {
      get() {
        return this.store.state.areaManageDialog.areCreate
      },
      set(newValue) {
        this.store.state.areaManageDialog.areCreate = newValue
      }
    }
  },
  methods: {
    getSelVal(val) {
      console.log(val)
    }
  }
}
</script>
<style lang=less>

</style>

