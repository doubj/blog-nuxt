<template>
  <div>
    <el-row type="flex" class="main-content">
      <el-col style="padding: 0 0 50px 0;" :span="6">
        <el-card
          data-aos="zoom-in-up"
          data-aos-duration="800"
          data-aos-anchor-placement="center-bottom"
          data-aos-easing="ease-in-out"
          style="width:100%;margin-top:10px;"
        >
          <div slot="header">
            <span>推荐阅读</span>
            <el-tooltip class="item" effect="dark" content="根据每月文章点击量进行排序" placement="top">
              <i style="float: right; padding: 3px 0" class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div v-for="(item, index) in recommendList" :key="index" class="recommend-item">
            <nuxt-link :to="item.value | linkFilter">
              <span>{{item.value | titleFilter}}</span>
            </nuxt-link>
          </div>
        </el-card>
        <el-card
          data-aos="zoom-in-up"
          data-aos-duration="800"
          data-aos-anchor-placement="center-bottom"
          data-aos-easing="ease-in-out"
          style="margin-top:20px;width:100%;;position:sticky;top:100px"
        >
          <div slot="header">
            <span>检索选项卡</span>
            <el-tooltip class="item" effect="dark" content="可在此处根据分类和标签检索文章" placement="top">
              <i style="float: right; padding: 3px 0" class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <el-select
            style="width:100%"
            v-model="query.blogCategoryName"
            clearable
            placeholder="请选择文章分类"
          >
            <el-option
              v-for="(item,index) in categoryOptions"
              :key="item+index"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            style="width:100%; margin-top:20px"
            v-model="query.blogTags"
            multiple
            placeholder="请选择文章标签"
          >
            <el-option
              v-for="(item,index) in tagOptions"
              :key="item+index"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button class="btn-query" type="success" @click="handleClick">查询</el-button>
        </el-card>
      </el-col>
      <el-col
        v-loading="loading"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="30"
        style="margin-left: 40px;"
      >
        <div class="null-info" v-if="list.length == 0">
          <span>没有找到符合要求的文章哦~</span>
        </div>
        <div class="card-box" v-if="list.length > 0">
          <card
            v-for="(item, index) in list"
            @filterCategory="filterCategory($event)"
            @filterTag="filterTag($event)"
            :key="index"
            :blog="item"
          ></card>
          <el-divider style="font-family:'黑体'" v-if="noMore" content-position="center">已经到底啦</el-divider>
        </div>
      </el-col>
    </el-row>
    <About></About>
  </div>
</template>

<script>
import Card from "@/components/Card";
import About from "@/components/About";

export default {
  name: "Home",
  async asyncData({ $axios }) {
    const recommendRes = await $axios.$get(`recommend`);
    const categoryRes = await $axios.$get("/categories");
    const tagRes = await $axios.$get("/tags");
    return {
      recommendList: recommendRes,
      categoryOptions: categoryRes.map(item => item.categoryName),
      tagOptions: tagRes.map(item => item.tagName)
    };
  },
  filters: {
    titleFilter: value => {
      return value.substring(0, value.indexOf("-"));
    },
    linkFilter: value => {
      return `/blog/${value.substring(value.indexOf("j") + 1)}`;
    }
  },
  components: { Card, About },
  data() {
    return {
      list: [],
      busy: false,
      noMore: false,
      loading: true,
      query: {
        page: 0,
        limit: 6,
        blogCategoryName: "",
        blogTags: []
      }
    };
  },
  // "https://obs-myblog.obs.cn-south-1.myhuaweicloud.com/base/wallhaven-6k135l.jpg"
  created() {
    const index = Math.floor(Math.random() * 4) + 1;
    this.$store.commit("setImage", `/${index}.jpg`);
  },
  methods: {
    handleClick() {
      this.reset();
    },
    loadMore() {
      if (this.query.page === 0) {
        this.loading = true;
      }
      this.busy = true;
      this.query.page += 1;
      this.$axios.$post("/blog/query", this.query).then(res => {
        if (res !== undefined && res.length > 0) {
          this.list.push(...res);
          this.busy = false;
        } else {
          this.busy = true;
          this.noMore = true;
        }
        if (this.loading) {
          this.loading = false;
        }
      });
    },
    filterCategory(categoryName) {
      if (this.query.blogCategoryName === categoryName) {
        this.query.blogCategoryName = "";
      } else {
        this.query.blogCategoryName = categoryName;
      }
      this.reset();
    },
    filterTag(tagName) {
      const index = this.query.blogTags.findIndex(item => item === tagName);
      if (index < 0) {
        this.query.blogTags.push(tagName);
      } else {
        this.query.blogTags.splice(index, 1);
      }
      this.reset();
    },
    reset() {
      this.list = [];
      this.query.page = 0;
      this.busy = false;
      this.noMore = false;
    }
  }
};
</script>

<style scoped>
.card-box {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
.btn-query {
  margin: 20px auto;
  float: right;
}
.recommend-item {
  padding: 5px;
}
.recommend-item a {
  color: #cd6133;
  text-decoration: none;
}
.recommend-item a:hover {
  text-decoration: underline;
}
</style>
