<template>
      <div class="particulars">
        <!-- 标题start -->
        <div class="title">
            <!-- <span class="el-icon-arrow-left" @click="goBack">返回</span> -->
            <div class="titLeft">
                <div class="titLeft-num">
                    <router-link to="/sf_cloud/workbench/userWorkList">
                        <P class="el-icon-arrow-left">返回</P>
                    </router-link>
                    <p>工单号:</p>
                    <i>{{detailWorder.user_request_id}}</i>
                </div>
                <div class="titLeft-list">
                    <p>当前状态:</p>
                    <i>{{detailWorder.status}}</i>
                </div>
            </div>
            <!-- <div class="titRight">
                <el-button size="mini" type="primary" @click="conrim" class="conrim">确认订单
                </el-button>
            </div> -->
        </div>
        <!-- 标题end -->
        <div class="main">
            <div class="main-left">
                <!-- 问题start -->
                <div class="detail-module">
                    <h3 class="detail-module-title">沟通记录</h3>
                    <ul class="detail-module-cont" id="listenImg">
                        <li class="detail-recode-item" v-for="(item,index) in questionList" :key="index">
                            <div class="detail-head-icon">
                                <img :src="item.img_url">
                            </div>
                            <div :class="[item.name == '顺丰云工程师:' ? 'selected' : '','detail-recode']">
                                <div class="detail-recode-title clearfix">
                                    <div class="pull-left detail-recode-identity">{{item.name}}</div>
                                    <div class="pull-right detail-recode-time">{{item.time}}</div>
                                </div>
                                <p class="detail-recode-cont" v-for="(subItem,index) in item.messageList" :key="index">{{subItem.message}}</p>
                                <!-- <p class="detail-recode-cont"> 机密信息：****** </p>
                                          <p class="detail-recode-cont"> instance-id: 1112 </p> -->
                                <p class="detail-recode-cont">
                                    <div class="work-order-files">
                                        <div class="txt-file"></div>
                                    </div>
                                </p>
                            </div>
                        </li>
                        <!-- <li class="detail-recode-item">
                              <div class="detail-head-icon">
                              <img src="//imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/work-order /css/img/user-avatar.svg"> </div>
                              <div class="detail-recode ">
                              <div class="detail-recode-title clearfix">
                                  <div class="pull-left detail-recode-identity"> 3176592452 : </div>
                                  <div class="pull-right detail-recode-time">2018-04-02 16:11:04 </div>
                              </div>
                              <p class="detail-recode-cont" id="content1523438548439">you&nbsp;ren?</p>
                              <p class="detail-recode-cont" id="attach3046877096877">
                                  <div class="work-order-files">
                                  <div class="txt-file"></div>
                                  </div>
                              </p>
                              </div>
                          </li>
                          <li class="detail-recode-item">
                              <div class="detail-head-icon">
                              <img src="//imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/work-order/css/img/custom-service-avatar.svg"> </div>
                              <div class="detail-recode recode-item-system ">
                              <div class="detail-recode-title clearfix">
                                  <div class="pull-left detail-recode-identity"> 腾讯云工程师 : </div>
                                  <div class="pull-right detail-recode-time">2018-04-02 16:16:35 </div>
                              </div>
                              <p class="detail-recode-cont" id="content1523438548440">您好，请问当前有什么需要协助的，还请描述下您遇到的问题</p>
                              <p class="detail-recode-cont" id="attach3046877096878">
                                  <div class="work-order-files">
                                  <div class="txt-file"></div>
                                  </div>
                              </p>
                              </div>
                          </li>
                          <li class="detail-recode-item">
                              <div class="detail-head-icon">
                              <img src="//imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/work-order/css/img/custom-service-avatar.svg"> </div>
                              <div class="detail-recode recode-item-system ">
                              <div class="detail-recode-title clearfix">
                                  <div class="pull-left detail-recode-identity"> 腾讯云工程师 : </div>
                                  <div class="pull-right detail-recode-time">2018-04-09 09:19:22 </div>
                              </div>
                              <p class="detail-recode-cont" id="content1523438548441">尊敬的客户：您好，由于您长时间未反馈信息，我们暂时将您的问题修改为待您确认状态，如此问题重现您可以继续留言。如您不再回复，7天后工单会自动关闭。</p>
                              <p class="detail-recode-cont" id="attach3046877096879">
                                  <div class="work-order-files">
                                  <div class="txt-file"></div>
                                  </div>
                              </p>
                              </div>
                          </li> -->
                    </ul>
                </div>
                <!-- 问题end -->
                <!-- 留言start -->
                <div class="leaveword">
                    <!-- <div class="richtextBar">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove"
                            :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
                            <i size="small" class="el-icon-upload">上传附件</i>
                        </el-upload>
                    </div> -->
                    <div class="textarea">
                        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 8}" placeholder="请输入内容" v-model="detailWorder.message">
                        </el-input>
                    </div>
                    <!-- <p style="font-size:12px; color: #888;">上传附件支持jpg、png、txt、rar、doc、xls格式，且不超过500kb</p> -->
                </div>
                <el-button size="small" type="primary" style="margin:20px" :disabled="detailWorder.status=='已结单'||detailWorder.status=='已撤销'" @click="submitWorkerOrder">提交留言</el-button>
                <!-- 留言end -->
            </div>
            <div class="main-right">
                <!-- 进度条start -->
                <div class="progress-bar">
                    <p>处理进度</p>
                    <el-steps :space="100" :active="status" finish-status="success" direction="vertical">
                        <el-step title="用户提交工单"></el-step>
                        <el-step title="管理员处理工单"></el-step>
                        <el-step title="管理员确认工单"></el-step>
                        <el-step title="已结单"></el-step>
                    </el-steps>
                </div>
                <!-- 进度条end -->
                <!-- 详情start -->
                <div class="particulars">
                    <p>工单信息</p>
                    <div>
                        <span>提单人(账号ID):
                        </span>
                        <span>
                            {{detailWorder.user_id}}
                        </span>
                    </div>
                    <div>
                        <span>联系电话:
                        </span>
                        <span>{{detailWorder.contact_phone}}
                        </span>
                    </div>
                </div>
                <!-- 详情end -->
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import { wkDetails,addWorkerOrder } from '@/api/user/userWorkList'
export default {
  data() {
    return {
      fileList: [],
      textarea: "", //文本域
      status:0,
      questionList: [
        // {
        //   img_url:
        //     "//imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/work-order/css/img/user-avatar.svg",
        //   name: "问题描述",
        //   time: "2018-04-02 16:10:10",
        //   messageList: [
        //     { message: "机密信息：******" },
        //     { message: " instance-id: 1112" }
        //   ]
        // },
        // {
        //   img_url:
        //     "//imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/work-order/css/img/user-avatar.svg",
        //   name: "3176592452:",
        //   time: "2018-04-02 16:10:10",
        //   messageList: [{ message: "来人啊" }, { message: "给我解决问题啊" }]
        // },
        // {
        //   img_url:
        //     "//imgcache.qq.com/open_proj/proj_qcloud_  2/mc_2014/work-order/css/img/user-avatar.svg",
        //   name: "顺丰云工程师:",
        //   time: "2018-04-02 16:10:10",
        //   messageList: [
        //     {
        //       message: "您好，请问当前有什么需要协助的，还请描述下您遇到的问题"
        //     }
        //   ]
        // },
        // {
        //   img_url:
        //     "//imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/work-order/css/img/user-avatar.svg",
        //   name: "顺丰云工程师:",
        //   time: "2018-04-02 16:10:10",
        //   messageList: [
        //     {
        //       message:
        //         "尊敬的客户：您好，由于您长时间未反馈信息，我们暂时将您的问题修改为待您确认状态，如此问题重现您可以继续留言。如您不再回复，7天后工单会自动关闭。"
        //     }
        //   ]
        // }
      ],
      detailWorder:{
        // user_request:{},
        user_request_id:'',
        user_id:'',
        identity:'0',
        message:'',
        status:'',
        contact_phone:''
      }
    };
  },
  computed: {
      ...mapGetters({
        userInfo: 'getUserInfo'
      })
    },
  mounted() {
    console.log(this.$route.query.id)
    this.detailWorder.status=this.$route.query.id[0]
    this.detailWorder.user_request_id=this.$route.query.id[1]
    this.detailWorder.contact_phone=this.$route.query.id[2]
    this.detailWorder.user_id=this.$route.query.id[3]
    // this.detailWorder.user_request_id=this.$route.query.id.user_request_id
    // this.detailWorder.user_id=this.userInfo.user_id
    this.getWkDetails()
    this.stepPeogress()
  },
  methods: {
    wkDetails,
    addWorkerOrder,
    conrim() {},
    //文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    getWkDetails(){
      this.wkDetails({user_request_id:this.detailWorder.user_request_id}).then(res => {
        if (res.data.code == 0) {
          this.questionList=[]
          for(let i=0,data=res.data.data;i<data.length;i++){
            // if(data[i].identity=="管理员"){
              data[i].messageList=[]
              data[i].img_url="//imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/work-order/css/img/user-avatar.svg"
              data[i].name=data[i].identity
              data[i].messageList.push({message:data[i].message})
              this.questionList.push(data[i])
            // }
          }
        
          
        }
      })
    },
    submitWorkerOrder(){
      // let data={};
      console.log(this.detailWorder)
      this.addWorkerOrder(this.detailWorder).then(res => {
        if (res.data.code == 0) {
          this.detailWorder.message=''
          this.$message({
                        message: '提交成功',
                        type: 'success'
                      });
          this.getWkDetails()
        }
      })
    },
    stepPeogress(){
      switch (this.detailWorder.status) {
        case '未响应':
        this.status=1
        break;
        case '处理中':
        this.status=2
        break;
        case '待用户确认':
        this.status=3
        break;
        case '已结单':
        this.status=4
        break;
      }
    }
  }
  
};
</script>
<style lang="less">
.particulars {
  height: 100%;
  .title {
    padding: 0 20px;
    background-color: #fff;
    min-height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #d4d4d4;
    .titLeft {
      .titLeft-num,
      .titLeft-list {
        float: left;
        margin-right: 20px;
        p {
          margin-right: 20px;
          float: left;
        }
        i {
          font-style: normal;
        }
        .el-icon-arrow-left {
          cursor: pointer;
          font-size: 14px;
          padding: 8px 10px;
          margin-right: 30px;
          background: #dcdfe6;
          border-radius: 4px;
          margin-top: 10px;
          color: #128dff;
        }
      }
    }
    .titRight {
      float: right;
    }
  }
  .main {
    padding-right: 0;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    left: inherit;
    right: inherit;
    padding-left: 0;
    top: inherit;
    bottom: inherit;
    margin-right: auto;
    .main-left {
      margin-top: 20px;
      margin-right: 400px;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      display: inline-block;
      padding-right: 20px;
      width: 74%;
      font-size: 14px;
      vertical-align: top;
      box-sizing: border-box;
      .detail-module-title {
        padding-left: 20px;
        color: #000;
        line-height: 44px;
        font-size: 14px;
        background-color: #fff;
      }
      .detail-module-cont {
        padding: 20px;
        div {
          display: block;
        }
        .detail-recode-item {
          display: table;
          width: 100%;
          padding-top: 20px;
          padding-bottom: 25px;
          border-top: 1px dashed #d3d3d3;
            color: #a2a2a2;
          font-size: 12px;
          table-layout: fixed;
          .detail-head-icon {
            display: table-cell;
            width: 55px;
            vertical-align: top;
          }
          .selected {
            color: #000;
          }
          .detail-recode {
            display: table-cell;
            padding-top: 5px;
            vertical-align: top;
            .detail-recode-title {
              height: 20px;
            }
            .detail-recode-identity {
              font-weight: 700;
              //   color: #a2a2a2;
              font-size: 12px;
            }
            .etail-recode-cont {
              line-height: 24px;
              word-wrap: break-word;
            }
            .detail-recode-cont {
              line-height: 24px;
              word-wrap: break-word;
            }
          }
        }
      }
      .leaveword {
        margin: 0 20px 20px !important;
        border-top: 1px dashed #d3d3d3;
        padding-top: 40px;
        .richtextBar {
          color: #0071ce;
          font-size: 14px;
          padding-left: 10px;
          border: 1px solid #d1d2d3;
          border-bottom: 0;
          border-radius: 2px 2px 0 0;
          height: 100%;
          min-height: 35px;
          line-height: 35px;
        }
        // textarea{
        //   padding-top: 30px;
        // }
      }
    }
    .main-right {
      position: absolute;
      right: 0;
      top: 0;
      margin-top: 20px;
      .progress-bar,
      .particulars {
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        margin-bottom: 20px;
        padding: 20px;
        height: 300px;
        background-color: #fff;
        width: 300px;
        p {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        span {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          //   margin-right: 5px;
          color: #888;
          font-size: 14px;
          padding-right: 20px;
          white-space: nowrap;
          text-align: left;
          width: 100px;
        }
        span:nth-child(2) {
          color: #000;
          font-weight: 600;
        }
      }
      .particulars {
        height: 100px;
      }
    }
  }
}
</style>

