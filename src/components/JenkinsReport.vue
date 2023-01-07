<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运维报表</el-breadcrumb-item>
      <el-breadcrumb-item>发布报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 分页区域 -->
      <h1>模板发布次数</h1>
      <h1>模块数:{{jenkinsTotal.total}} 个</h1>
      <h1>累计发布次数:{{jenkinsTotal.sunNum}} 次</h1>
      <div class="Echarts">
        <div id="main" style="width: 600px; height: 900px"></div>
      </div>
      <div id="manuChart" class="chart-div"></div>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[25, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Echarts",
  data() {
    return {
      // 获取模块列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 25,
      },
      jenkinsjobs: [],
      jenkinsjobsName: [],
      jenkinsjobsBuildNum: [],
      jenkinsTotal: {},
      total: 0,
    };
  },
  created() {
    this.getjenkinsjobsTotal();
    this.getjenkinsjobs();  
  },
  methods: {
    async getjenkinsjobsTotal() {
      const { data: res } = await this.$http.get("/api/getjenkinstotalFromDB", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取模块列表失败！");
      }
      this.jenkinsTotal = res.data;
      console.log("123123123"+res.data)
      this.total = res.data.total;
      console.log("123123123"+this.total)
    },
    async getjenkinsjobs() {
      //
      
      const { data: res } = await this.$http.get("/api/getjenkinsjobFromDB", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取模块列表失败！");
      }
      this.jenkinsjobs = res.data;
      
      //前端出来
      this.jenkinsjobsName = [];
      this.jenkinsjobsBuildNum = [];
      for (var i = 0; i < this.jenkinsjobs.length; i++) {
        this.jenkinsjobsName.push(this.jenkinsjobs[i].name);
        this.jenkinsjobsBuildNum.push(this.jenkinsjobs[i].buildnum);
      }
      console.log(res);
      this.myEcharts();
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getjenkinsjobs();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getjenkinsjobs();
    },
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = {
        tooltip: {},
        xAxis: {
          type: "value",
          min: 0,
          max: 100,
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        xAxis: {
          type: "value",
          min: 0,
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },

          data: this.jenkinsjobsName,
        },
        yAxis: {
          type: "category",
          inverse: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: this.jenkinsjobsName
        },
        series: [
          {
            name: "次数",
            type: "bar",
            data: this.jenkinsjobsBuildNum,
            label: {
              show: true,
              formatter: "{c}次数", //显示数据带上百分比
              position: "right",
            },
          },
        ],
        grid: {
          x: "10%",
          y: 0,
          x2: "10%",
          y2: 0,
          left: "55",
          containLabel: true
        },
        dataZoom: {
          yAxisIndex: [0],
          type: "inside",
          start: 0,
          end: 30,
          zoomLock: true,
        },
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
  mounted() {
    this.myEcharts();
  },
};
</script>