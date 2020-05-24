<template>
  <div>
    <el-row class="footer base-bgcolor">
      <el-col :span="8" class="display-center">
        <span style="color:#cd84f1;">恰个VX？</span>
        <img style="margin-top:5px" width="120px" height="120px" src="/vx.png" />
      </el-col>
      <el-col class="display-center" :span="8">
        <span>联系我</span>
        <div class="footer-links" style="margin-top:50px">
          <a v-for="(item, i) in follows" :key="i" :href="item.url" target="_blank">
            <i style="font-size:40px;padding:20px" :class="'iconfont icon-' + item.icon"></i>
          </a>
        </div>
      </el-col>
      <el-col class="display-center" :span="8">
        <span>友链</span>
        <div class="footer-links">
          <a
            v-for="(item,index) in links"
            :key="index"
            :href="item.linkUrl"
            target="_blank"
          >{{ item.linkName }}</a>
        </div>
      </el-col>
    </el-row>
    <el-row class="end">
      Copyright © 2020 &nbsp; | &nbsp; Powered by <a href="http://www.doubj1998.com/">doubj</a> &nbsp; |&nbsp;
      <a
        href="http://www.beian.miit.gov.cn/"
      >
        <span>湘ICP备19025936号</span>
      </a>
    </el-row>
  </div>
</template>

<script>
const followArr = [
  {
    icon: "Email",
    url: "mailto:935208113@qq.com"
  },
  {
    icon: "GitHub",
    url: "https://github.com/doubj"
  },
  {
    icon: "bilibili-fill",
    url: "https://space.bilibili.com/334435895"
  }
];
export default {
  data() {
    return {
      links: [],
      follows: Object.assign({}, followArr)
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios.$get("/links").then(res => {
        this.links = res;
      });
    }
  }
};
</script>

<style scoped>
.footer {
  padding: 20px 0;
  color: #cd84f1;
}
.footer .footer-links {
  display: flex;
  margin-top: 10px;
}
.footer .footer-links a {
  color: white;
  text-decoration: none;
}
.footer .footer-links a:hover {
  color: #cd84f1;
  text-decoration: underline;
}
.footer .footer-links a:nth-of-type(n + 2) {
  margin-left: 10px;
}
.end {
  text-align: center;
  color: white;
  background: #636e72;
  font-size: 12px;
}
.end a{
  color:white;
  text-decoration: none;
}
.end a:hover{
  color:white;
  text-decoration: none;
}
</style>