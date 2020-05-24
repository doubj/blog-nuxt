<template>
  <div style="width:100%;margin-top:50px;background:#4b4b4b;color:white">
    <el-row
      data-aos="zoom-in-up"
      data-aos-duration="800"
      data-aos-anchor-placement="center-bottom"
      data-aos-easing="ease-in-out"
      class="my-info"
    >
      <el-col class="display-center" :span="8">
        <div :style="{background: `url(${user.avatar})`}" class="pan-thumb"></div>
        <span>{{ user.nickName }}</span>
        <p>{{ user.introduce }}</p>
      </el-col>
      <el-col :span="6">
        <div style="margin-top: 50px;">
          <div v-for="(item,i) in skills" :key="i" class="progress-item">
            <span>{{ item.name }}</span>
            <el-progress :text-inside="true" :stroke-width="16" :percentage="item.percent" />
          </div>
        </div>
      </el-col>
      <el-col :span="10" style="padding:30px">
        <el-carousel height="200px" direction="vertical" :autoplay="false">
          <el-carousel-item v-for="(item, i) in projects" :key="i">
            <div style="display: flex;flex-direction: column;">
              <span style="text-align: center;" class="project-name">
                <a :href="item.url" target="_blank">{{item.name}}</a>
              </span>
              <p>技术栈：{{ item.techStack }}</p>
              <p>描述：{{item.description}}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const skillArr = [
  {
    name: "Java",
    percent: 60
  },
  {
    name: "Vue",
    percent: 50
  },
  {
    name: "MarkDown",
    percent: 60
  }
];
const projectArr = [
  {
    name: "doubj's blog-Nuxt",
    url: "https://www.baidu.com/",
    techStack: "Nuxt、Element",
    description: "所见即功能"
  },
  {
    name: "doubj's blog-SpringBoot",
    url: "https://www.baidu.com/",
    techStack: "SpringBoot、MySQL、ES、Redis",
    description:
      "博客后端API接口，ES做搜索，Redis做缓存，同时有一些自己的想法如：将分类和标签管理揉进博客管理中……更多请看名为Vue+SpringBoot实现个人博客文章"
  }
];
export default {
  data() {
    return {
      user: {},
      skills: skillArr,
      projects: projectArr
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios.$get("/user").then(res => {
        this.user = res;
      });
    }
  }
};
</script>

<style scoped>
.my-info {
  width: 80%;
  margin: 0 auto;
}
.info-comon {
  margin: 30px auto;
  padding: 20px;
}
.pan-thumb {
  margin: 20px auto 10px;
  width: 100px;
  height: 100px;
  background-size: cover !important;
  border-radius: 50%;
  overflow: hidden;
  transform-origin: 95% 40%;
  transition: all 0.3s ease-in-out;
}
.pan-thumb:hover {
  transform: rotate(-110deg);
}
.progress-item {
  margin-bottom: 15px;
  font-size: 14px;
}
.el-carousel p:nth-of-type(1) {
  margin-top: 20px;
}
.el-carousel p {
  margin: 4px 0;
}
.el-carousel .project-name {
  font-size: 24px;
}
.el-carousel .project-name a {
  text-decoration: none;
  color: #fed330;
  font-weight: 600;
}
.el-carousel .project-name a:hover {
  text-decoration: underline;
  color: #fed330;
  font-weight: 600;
}
</style>