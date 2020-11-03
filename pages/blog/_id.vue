<template>
  <el-row class="main-content" type="flex">
    <el-col :span="18">
      <el-card>
        <el-row>
          <span v-for="(item,index) in tags" :key="index" class="tag base-bgcolor">{{item}}</span>
          <div style="float:right">
            <i class="el-icon-collection-tag"></i>
            <span>{{ blog.blogCategoryName }}</span>
          </div>
        </el-row>
        <el-row class="blog-info" style="margin-top:10px">
          <i class="el-icon-time"></i>
          <span class="right-10">创建时间：{{ blog.createTime }}</span>
          <i class="el-icon-suitcase"></i>
          <span class="right-10">更新时间：{{ blog.updateTime }}</span>
          <i class="el-icon-view"></i>
          <span class="right-10">访问量：{{ blog.blogVisits }}</span>
        </el-row>
        <el-divider></el-divider>
        <div class="blog-content">
          <MarkDownDisplay :markdown="blog.blogContent" @setNavList="setNavList($event)"></MarkDownDisplay>
        </div>
      </el-card>
      <CommentCard
        data-aos="zoom-in-up"
        data-aos-duration="800"
        data-aos-anchor-placement="center-bottom"
        data-aos-easing="ease-in-out"
        :blogId="blog.blogId"
        :type="'article'"
      ></CommentCard>
      <div style="display:flex;margin:30px 0;align-items: flex-start;">
        <card
          data-aos="zoom-in-up"
          data-aos-duration="800"
          data-aos-anchor-placement="center-bottom"
          data-aos-easing="ease-in-out"
          :blog="blog.previousBlog"
          :width="'50%'"
          :isPrevious="true"
        ></card>
        <card
          data-aos="zoom-in-up"
          data-aos-duration="800"
          data-aos-anchor-placement="center-bottom"
          data-aos-easing="ease-in-out"
          :blog="blog.nextBlog"
          :width="'50%'"
          :isNext="true"
        ></card>
      </div>
    </el-col>
    <el-col :span="6">
      <!-- <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="code"></el-input>
      <MarkDownDisplay :markdown="code"></MarkDownDisplay>-->
      <div id="toc">
        <div class="toc-title">
          <i class="el-icon-reading"></i>目录
        </div>
        <ul>
          <li
            v-for="(nav,index) in navList"
            :key="index"
            :class="{active: activeIndex === nav.index && childrenActiveIndex === 0 }"
          >
            <a href="javascript:;" @click="handleJump(nav.index)">{{ nav.title }}</a>
            <el-collapse-transition>
              <div class="sub-heading" v-if="nav.children.length > 0 && activeIndex === nav.index">
                <li
                  v-for="(item,i) in nav.children"
                  :key="i"
                  :class="{active: childrenActiveIndex == item.index}"
                >
                  <a href="javascript:;" @click.stop="handleJump(item.index)">{{ item.title }}</a>
                </li>
              </div>
            </el-collapse-transition>
          </li>
        </ul>
      </div>
    </el-col>
  </el-row>
</template>

<script>
const cubic = value => Math.pow(value, 3);
const easeInOutCubic = value =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;
import Card from "@/components/Card";
import CommentCard from "@/components/CommentCard";
import MarkDownDisplay from "@/components/MarkDownDisplay";
export default {
  components: { MarkDownDisplay, Card, CommentCard },
  asyncData({ $axios, params }) {
    return $axios.$get(`/blog/${params.id}`).then(res => {
      return { blog: res };
    });
  },
  data() {
    return {
      tags: [],
      code: "",
      navList: [],
      activeIndex: 0,
      childrenActiveIndex: 0
    };
  },
  watch: {
    "$store.state.scroll": function(newValue) {
      const navContents = document.querySelectorAll(".target-fix");
      // offsetTop是元素距父容器(el-card)的高度，再加20的margin再加可见区域的高度就是锚点距离顶端的高度
      const offsetTopArr = [];
      navContents.forEach(item => {
        offsetTopArr.push(
          item.offsetTop + 20 + document.documentElement.clientHeight
        );
      });
      let navIndex = 0;
      for (let n = 0; n < offsetTopArr.length; n++) {
        if (newValue >= offsetTopArr[n]) {
          navIndex = n;
        }
      }
      this.setTocIndex(navIndex);
    }
  },
  created() {
    this.init();
  },
  destroyed() {
    this.$store.commit("setTitle", "");
  },
  methods: {
    init() {
      this.$store.commit("setImage", this.blog.blogCoverImage);
      this.$store.commit("setTitle", this.blog.blogTitle);
      this.tags = this.blog.blogTags.split(",");
    },
    setNavList(navList) {
      this.navList = navList;
    },
    setTocIndex(index) {
      for (var nav of this.navList) {
        if (nav.index === index) {
          this.activeIndex = index;
          this.childrenActiveIndex = 0;
          break;
        }
        if (nav.children.length > 0) {
          for (var child of nav.children) {
            if (child.index === index) {
              this.activeIndex = nav.index;
              this.childrenActiveIndex = index;
              break;
            }
          }
        }
      }
      // console.log(
      //   index + "," + this.activeIndex + "," + this.childrenActiveIndex
      // );
    },
    handleJump(index) {
      const el = document.getElementById(`data-${index}`);
      const height = el.offsetTop + 20 + document.documentElement.clientHeight;
      const beginTime = Date.now();
      const beginValue = document.documentElement.scrollTop;
      const endValue = height;
      const rAF =
        window.requestAnimationFrame || (func => setTimeout(func, 16));
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500;
        if (progress < 1) {
          if (this.$store.scroll >= height) {
            document.documentElement.scrollTop =
              beginValue - (endValue - beginValue) * easeInOutCubic(progress);
          } else {
            document.documentElement.scrollTop =
              beginValue + (endValue - beginValue) * easeInOutCubic(progress);
          }
          rAF(frameFunc);
        } else {
          document.documentElement.scrollTop = endValue;
        }
      };
      rAF(frameFunc);
    }
  }
};
</script>

<style scoped>
.blog-content {
  padding: 0 20px 20px 20px;
}
#toc {
  position: sticky;
  top: 100px;
}
#toc ul {
  list-style: none;
  font-size: 1rem;
  padding-left: 30px;
}
#toc ul a {
  color: #34495e;
  text-decoration-line: none;
}
#toc ul li a:hover {
  text-decoration-line: underline;
  font-weight: 700;
  color: #10ac84;
}
.sub-heading {
  margin-left: 15px;
}
#toc .active > a {
  color: #10ac84;
  font-weight: 700;
}
#toc .toc-title {
  padding-left: 30px;
  font-size: 28px;
  font-weight: 800;
}
</style>