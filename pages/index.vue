<template>
  <div style="display: flex;flex-direction: column; width: 100%;">
    <div class="main-content" style="position: relative">
      <div class="query-container" :style="{ top:  queryContainerTopValue + 'px'}">
        <div :style="{ transform: showQueryCard ? 'translateX(-100%)' : 'translateX(0)' }" class="query-button" @click="showQueryCard=!showQueryCard">
          <span>检索选项卡</span>
        </div>
        <el-card :style="{ transform: showQueryCard ? 'translateX(0)' : 'translateX(-100%)' }" class="query-card">
          <div slot="header">
            <span>检索选项卡</span>
            <i style="font-size: 16px;float: right;cursor: pointer;" class="iconfont icon-left1" @click="showQueryCard=!showQueryCard"></i>
          </div>
          <el-select
            style="width:100%"
            v-model="query.blogCategoryName"
            clearable
            placeholder="请选择文章分类"
          >
            <el-option
              v-for="(item, index) in categoryOptions"
              :key="item + index"
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
              v-for="(item, index) in tagOptions"
              :key="item + index"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button class="btn-query" type="success" @click="handleClick"
            >查询</el-button
          >
        </el-card>
      </div>
      <el-row type="flex">
        <el-col
          v-loading="loading"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="30"
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
              :width="'30%'"
            ></card>
            <el-divider
              style="font-family:'黑体'"
              v-if="noMore"
              content-position="center"
              >已经到底啦</el-divider
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <About></About>
  </div>
</template>

<script>
import Card from "@/components/Card";
import About from "@/components/About";

export default {
  name: "Home",
  async asyncData({ $axios }) {
    const categoryRes = await $axios.$get("/categories");
    const tagRes = await $axios.$get("/tags");
    return {
      categoryOptions: categoryRes.map(item => item.categoryName),
      tagOptions: tagRes.map(item => item.tagName)
    };
  },
  components: { Card, About },
  data() {
    return {
      list: [],
      busy: false,
      noMore: false,
      loading: true,
      scroll: 0,
      query: {
        page: 0,
        limit: 6,
        blogCategoryName: "",
        blogTags: []
      },
      showQueryCard: false
    };
  },
  created() {
    const index = Math.floor(Math.random() * 4) + 1;
    this.$store.commit("setImage", `/${index}.jpg`);
    this.$axios
      .$get(`/recommend`)
      .then(res => this.$store.commit("setRecommends", res));
  },
  computed: {
    queryContainerTopValue() {
      let top = 50;
      if (typeof document !== 'undefined') {
        top = this.$store.state.scroll - document.documentElement.clientHeight * 0.85
      }
      return top > 50 ? top : 50;
    }
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
  align-items: flex-end;
  justify-content: space-around;
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
.query-container {
  position: absolute;
  left: -12.5%;
  width: 22%;
  z-index: 2001;
  transition: top .4s ease-in-out 0s;
}
.query-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  padding: 12px 20px;
  font-weight: 500;
  font-size: 16px;
  border-radius: 0 20px 20px 0;
  transition: padding .4s ease 0s, transform .5s ease 0s;
}
.query-button:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
  padding: 12px 40px 12px 28px;
}
.query-card {
  opacity: 0.2;
  transition: opacity .4s ease 0s, transform .5s ease-in 0s;
}
.query-card:hover {
  opacity: 1;
}
</style>
