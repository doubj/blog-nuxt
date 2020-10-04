<template>
    <el-card
      data-aos="zoom-in-up"
      data-aos-duration="800"
      data-aos-anchor-placement="center-bottom"
      data-aos-easing="ease-in-out"
      class="card"
      :style="{width:width}"
      :body-style="{ padding: '0px' }"
    >
      <nuxt-link :to="'/blog/' + blog.blogId">
        <div class="card-img" :style="{ background: 'url(' + blog.blogCoverImage + ') no-repeat' }">
          <div v-if="isPrevious" class="prev-tag">
            <i class="el-icon-arrow-left"></i>
            上一篇
          </div>
          <div v-if="isNext" class="next-tag">
            下一篇
            <i class="el-icon-arrow-right"></i>
          </div>
          <span class="card-title">{{ blog.blogTitle }}</span>
        </div>
      </nuxt-link>
      <div style="padding: 14px 14px 0px 14px; color:#34495e; font-size:16px">
        <el-row>
          <el-col :span="24">{{ blog.blogSummary.substring(0,60) + '...' }}</el-col>
        </el-row>
        <el-row style="margin-top:8px;" class="blog-info">
          <i class="el-icon-time"></i>
          <time>{{ blog.createTime }}</time>
          <div style="float:right">
            <i class="el-icon-collection-tag"></i>
            <span
              class="categoryLink"
              @click="handleClickCategory(blog.blogCategoryName)"
            >{{ blog.blogCategoryName }}</span>
          </div>
        </el-row>
      </div>
      <el-divider></el-divider>
      <el-row style="margin:0 0 10px 10px">
        <span
          v-for="(item,index) in tags"
          :key="index"
          class="tag base-bgcolor"
          style="cursor: pointer;font-size:12px"
          @click="handleClickTag(item)"
        >{{item}}</span>
      </el-row>
    </el-card>
</template>

<script>
export default {
  name: "Card",
  props: {
    blog: {
      type: Object,
      required: true
    },
    width: {
      type: String,
      default: "350px"
    },
    isPrevious: {
      type: Boolean,
      default: false
    },
    isNext: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tags: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.tags = this.blog.blogTags.split(",");
    },
    handleClickCategory(categoryName) {
      this.$emit("filterCategory", categoryName);
    },
    handleClickTag(tagName) {
      this.$emit("filterTag", tagName);
    }
  }
};
</script>

<style scoped>
.card-img {
  background-size: 100% 100% !important;
  height: 250px;
  width: 100%;
  position: relative;
}
.card-img .card-title {
  color: white;
  font-size: 24px;
  font-family: "宋体";
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 24px;
  letter-spacing: 15;
}
.el-divider--horizontal {
  margin: 12px 0;
}
.categoryLink {
  cursor: pointer;
}
.categoryLink:hover {
  text-decoration-line: underline;
  text-decoration-color: #10ac84;
}
.prev-tag {
  float: left;
  background: white;
  padding: 0 5px 3px;
  border-radius: 8px 0 8px 0;
}
.card {
  min-width: 300px;
}
.card a {
  color: #10ac84;
  text-decoration-line: none;
  font-weight: 600;
}
.next-tag {
  float: right;
  background: white;
  padding: 0 5px 3px;
  border-radius: 0 8px 0 8px;
}
</style>