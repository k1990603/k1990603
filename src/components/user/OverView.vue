<template>
    <div class="content">
        <div class="terrace">
            <p>概览</p>
            <el-row :gutter="20">
                <el-col :span="6" :offset=3>
                    <div class="grid-content bg-purple">
                        <div class="pie">
                            <div ref="piebox" id="piebox" style="height: 230px;width: 230px" v-show="!((!vm_running_count)&&!(vm_poweroff_count)&&(!vm_unknown_count)&&(!vm_other_count))"></div>
                            <span v-show="!((!vm_running_count)&&!(vm_poweroff_count)&&(!vm_unknown_count)&&(!vm_other_count))">你共有{{vm_count}}台VM</span>
                        </div>
                        <div class="pie">
                            <div id="noneVm" v-if="(!vm_running_count)&&!(vm_poweroff_count)&&(!vm_unknown_count)&&(!vm_other_count)">
                                <span>暂无虚拟机</span>
                                <p>
                                    <router-link to="/sf_cloud/workbench/userVmCreate">创建</router-link>
                                </p>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="14" :offset=1>
                    <div class="grid-content bg-purple">
                        <div class="list">
                            <ul>
                                <li>
                                    <i></i>
                                    <p>运行中{{vm_running_count||0}}台</p>
                                </li>
                                <li>
                                    <i style="background-color: #f0be2b;"></i>
                                    <p>关机{{vm_poweroff_count||0}}台</p>
                                </li>
                                <li>
                                    <i style="background-color: #ff0000;"></i>
                                    <p>故障{{vm_unknown_count||0}}台</p>
                                </li>
                                <li>
                                    <i style="background-color: #409eff;"></i>
                                    <p>其他状态{{vm_other_count||0}}台</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <nav class="num">
            <div>
                <div class="leftFont">资源数量与配额</div>
                <div class="rightFont">
                    <router-link :to="{path:'/sf_cloud/workbench/userWorkList/',query:{name:'1'}}">
                        <el-button type="text">申请配额</el-button>
                    </router-link>
                </div>
            </div>
            <div class="searchInput">
                <el-input placeholder="搜索项目" v-model="searchText" @keyup.enter.native="getUserOverviewData"></el-input>
                <el-button class="searchBtn" @click="getUserOverviewData()">搜索</el-button>
            </div>
            <el-collapse accordion @change="activeResourceName = ''">
                <el-collapse-item :title="item.name" :name="item.uuid" v-for="(item,index) in project_info" :key="index">
                    <el-row class="list">
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>VM</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.vm_used/item.vm_count" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.vm_used || 0}}/{{item.vm_count || 0}} 台</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>安全组</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.security_used/item.security_count" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.security_used || 0}}/{{item.security_count || 0}} 个</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>负载均衡</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.lb_used/item.lb_count" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.lb_used || 0}}/{{item.lb_count || 0}} 个</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row class="list">
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>专有网络</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.private_network_used/item.private_network_count" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.private_network_used || 0}}/{{item.private_network_count || 0}} 个</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>公网IP</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.internet_ip_used/item.internet_ip_count" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.internet_ip_used || 0}}/{{item.internet_ip_count || 0}} 个</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>公网宽带</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.internet_bandwidth_used/item.internet_bandwidth" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.internet_bandwidth_used || 0}}/{{item.internet_bandwidth || 0}} Mbps</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row class="list">
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>cpu</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.cpu_used/item.cpu" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.cpu_used || 0}}/{{item.cpu || 0}} 核</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>MEM</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.mem_used/item.mem" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.mem_used || 0}}/{{item.mem || 0}} G</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8" style=" padding: 0 20px;">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>DISK</p>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <el-progress :percentage="item.disk_used/item.disk" status="exception" color="#00ccff" class="progress_bar "></el-progress>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content bg-purple">
                                        <p>{{item.disk_used || 0}}/{{item.disk || 0}} G</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-collapse @change="getUserHomepageAreaData(item.uuid)" v-model="activeResourceName">
                        <el-collapse-item title="区域资源使用情况" :name="`1${item.uuid}`" class="listBtn">
                            <el-row :gutter="40">
                                <el-col :span="numColumn" v-for="(area,index) in resourceArea" :key="index">
                                    <div class="grid-content bg-purple">
                                        <div class="listLeft">
                                            <p>{{area.area_name}}</p>
                                            <el-table :data="area.tableData" border style="text-align: center;" v-loading="loading">
                                                <el-table-column prop="date" label="配额名称">
                                                </el-table-column>
                                                <el-table-column prop="numberData" label="分配数量">
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-collapse-item>
                    </el-collapse>
                </el-collapse-item>
            </el-collapse>
        </nav>
    </div>
</template>
<script>
import echarts from 'echarts'
import { getUserOverview, getUserHomepageArea } from '../../api/index'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      searchText: '',
      loading: true,
      activeResourceName: '',
      resourceArea: [],
      areanumber0: 6,
      numColumn: 0,
      vm_count: 0,
      project_info: [],
      vm_count: 0,
      vm_running_count: 0,
      vm_poweroff_count: 0,
      vm_unknown_count: 0,
      vm_other_count: 0,
      bigzone: '区域资源', //大区
      activeNames: ['1', '2'],
      optionSet: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}台'
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            // avoidLabelOverlap: false,
            color: ['#26c6a0', '#f0be2b', '#ff0000', '#409eff'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                textStyle: {
                  color: '#3c4858',
                  fontSize: '12',
                  fontWeight: 'normal'
                },
                show: false,
                // color:"#000",
                position: 'center'
                // formatter:function(n){
                //     console.log(n);
                //     return '你共有'+''+'台VM'
                // }
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            data: []
          }
        ]
      }
    }
  },
  components: {},
  created() {
    this.getUserOverviewData()
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    drawLine(n) {
      //   let option = {
      //   }
      //   let myChart = echarts.init(document.getElementById('piebox'))
      let myChart = echarts.init(this.$refs.piebox)
      //   console.log(myChart)
      //   console.log(myCharts)
      let arr = [
        { name: '运行中', value: n.vm_running_count },
        { name: '关机', value: n.vm_poweroff_count },
        { name: '故障', value: n.vm_unknown_count },
        { name: '其他状态', value: n.vm_other_count }
      ]
      //   this.optionSet.series[0].label.normal.formatter = () => {
      //     return '你共有' + n.vm_count + '台VM'
      //   }
      //   this.optionSet.axisPointer.triggerTooltip = false
      this.optionSet.series[0].data = arr
      myChart.setOption(this.optionSet)
    },
    getUserOverviewData() {
      let self = this
      let data = {
        // user_id:'01198773',
        // tenant_id:1,
        tenant_uuid: this.userInfo.tenantInfo.tenant_uuid,
        // tenant_uuid:'123456',
        search: { project_name: this.searchText }
      }
      getUserOverview(data)
        .then(function(response) {
          if (response.data.code === 0) {
            let resData = response.data.data
            self.vm_count = resData.overview_info.vm_count
            self.vm_running_count = resData.overview_info.vm_running_count
            self.vm_poweroff_count = resData.overview_info.vm_poweroff_count
            self.vm_unknown_count = resData.overview_info.vm_unknown_count
            self.vm_other_count = resData.overview_info.vm_other_count
            self.project_info = resData.project_info
            //   let runningPercentage = self.vm_running_count/self.vm_count
            //   let poweroffPercentage = self.vm_poweroff_count/self.vm_count
            //   let unknownPercentage = self.vm_unknown_count/self.vm_count
            self.drawLine(resData.overview_info)
            // console.log(typeof resData.overview_info.vm_running_count)
          } else {
            self.vm_count = 0
            self.vm_running_count = 0
            self.vm_poweroff_count = 0
            self.vm_unknown_count = 0
            self.vm_other_count = 0
            self.project_info = []
            echarts.init(this.$refs.piebox).clear()
          }
        })
        .catch(function(error) {})
    },
    // 获取首页区域信息
    getUserHomepageAreaData(uuid, params) {
      let self = this
      let data = {
        project_uuid: uuid
      }
      this.resourceArea = []
      getUserHomepageArea(data)
        .then(response => {
          if (response.data.code === 0) {
            let areaData = response.data.data
            this.resourceArea = this.organizationAreaData(areaData, uuid)
            this.loading = false
          } else {
          }
        })
        .catch(error => {})
    },
    // 拼接地区信息
    organizationAreaData(areaData, id) {
      //   this.numColumn = 24 / areaData.length
      this.numColumn = 6
      let areaResourcesArr = []
      areaData.forEach(value => {
        let tempObj = {}
        tempObj.area_name = value.area_name
        tempObj.tableData = []
        tempObj.tableData.push({ date: 'VM', numberData: value.vm_num + ' 台' })
        tempObj.tableData.push({
          date: '安全组',
          numberData: value.security_info + ' 个'
        })
        tempObj.tableData.push({
          date: '负载均衡',
          numberData: value.lb_num + ' 个'
        })
        tempObj.tableData.push({
          date: '专有网络',
          numberData: value.private_net_info + ' 个'
        })
        tempObj.tableData.push({
          date: '公网IP',
          numberData: value.ip_num + ' 个'
        })
        tempObj.tableData.push({
          date: '公网宽带',
          numberData: value.internet_bandwidth + ' Mbps'
        })
        tempObj.tableData.push({
          date: 'CPU',
          numberData: value.cpu_num + ' 核'
        })
        tempObj.tableData.push({
          date: 'MEM',
          numberData: value.mem_num + ' G'
        })
        tempObj.tableData.push({
          date: 'DISK',
          numberData: value.disk_size + ' G'
        })
        areaResourcesArr.push(tempObj)
      })
      return areaResourcesArr
    },
    handleChange: function(params) {
      console.log(params)
    }
  },
  watch: {
    $route(val) {
      this.getUserOverviewData()
    }
  }
}
</script>
<style lang="less">
.content {
  padding: 0 30px;
  .terrace {
    padding: 20px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    > div > div:last-child {
      margin-top: 75px;
    }
    > p {
      font-size: 18px;
      font-weight: 600;
    }
    .pie {
      position: relative;
      & > span {
        position: absolute;
        top: 47%;
        left: 78px;
        color: #3c4858;
        font-size: 12px;
      }
    }
    .list {
      margin-top: 30px;
      ul {
        li {
          float: left;
          i {
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: rgb(38, 198, 160);
            margin-right: 20px;
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.6);
          }
          p {
            display: inline-block;
            margin-right: 30px;
          }
        }
      }
    }
  }

  .num {
    margin-top: 20px;
    padding: 20px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2);
    .leftFont {
      float: left;
      font-size: 18px;
      font-weight: 600;
    }
    .rightFont {
      float: right;
      font-size: 16px;
      color: #33a7da;
    }
    .searchInput {
      position: relative;
      margin-top: 45px;
      > .searchBtn {
        position: absolute;
        right: 1px;
        top: 1px;
        border: none;
      }
    }
    // .list {
    //   //   .progress_bar {
    //   //     // position: absolute;
    //   //     // margin-left: 80px;
    //   //     // margin-top: 5px;
    //   //     // width: 400px;
    //   //   }
    // }
    .el-collapse-item__header {
      text-indent: 10px;
      font-size: 14px;
      font-weight: 600;
    }
    .listBtn {
      margin-top: 10px;
      //   padding: 10px 15px;
      .el-collapse-item__header {
        background-color: #f2f2f2;
        padding: 0 10px;
        height: 42px;
        margin-bottom: 10px;
        font-size: 14px;
        // font-weight: normal;
        color: #409eff;
      }
      .el-collapse-item__content {
        padding: 0 25px;
      }
      p {
        font-size: 14px;
        margin: 10px 12px;
        font-weight: 600;
        // text-align: left;
      }
      th {
        padding: 6px 0;
        text-align: center;
      }
      td {
        padding: 6px 0;
      }
      > div:first-child {
        background-color: red;
      }
    }
  }
  #noneVm {
    // background-color: #409eff;
    text-align: center;
    margin: 15px auto;
    box-sizing: border-box;
    border: 20px solid #ccc;
    color: #3c4858;
    font-size: 12px;
    font-weight: bold;
    height: 160px;
    width: 160px;
    border-radius: 50%;
    padding-top: 40px;
    span {
      color: #f56c6c;
    }
    p {
      padding-top: 20px;
      a {
        color: #409eff;
      }
    }
  }
}
.listLeft > p {
  text-align: center;
}
</style>
