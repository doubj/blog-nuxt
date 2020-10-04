<template>
  <el-drawer
    title
    class="drawer"
    size="50%"
    :visible.sync="search"
    :before-close="beforeClose"
    :with-header="false"
  >
    <div class="drawer-header">
      <div class="drawer-input">
        <el-input
          v-model="keywords"
          placeholder="请输入关键字"
          clearable
          prefix-icon="el-icon-search"
          maxlength="15"
          show-word-limit
          @change="fetchSearch"
        ></el-input>
      </div>
    </div>
    <div class="drawer-body" v-loading="loading">
        <transition name="el-fade-in-linear" v-for="(item,i) in blogs" :key="i">
          <el-card
            class="card"
            @click.native="handleRouter(item.blogId)"
            style="margin:20px;cursor: pointer;"
          >
            <div slot="header">
              <span v-html="item.blogTitle"></span>
              <div style="float: right; padding: 3px 0">
                <i class="el-icon-collection-tag"></i>
                <span style="color:rgb(52, 73, 94)">{{item.blogCategoryName}}</span>
              </div>
            </div>
            <div>
              <p v-html="item.blogContent"></p>
            </div>
          </el-card>
        </transition>
    </div>
    <el-pagination
      style="text-align:center;margin-bottom:20px"
      background
      @current-change="fetchSearch"
      :hide-on-single-page="true"
      :current-page.sync="page"
      :page-size="5"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </el-drawer>
</template>
<script>
export default {
  data() {
    return {
      keywords: "",
      blogs: [],
      page: 1,
      total: 0,
      loading: false
    };
  },
  computed: {
    search() {
      return this.$store.state.search;
    }
  },
  methods: {
    beforeClose() {
      this.$store.commit("toggleSearch");
    },
    fetchSearch() {
      if (this.keywords === undefined || this.keywords === "") {
        this.blogs = [];
        this.total = 0;
        this.loading = false;
        return;
      }
      this.loading = true;
      this.$axios
        .$get("/search", {
          params: {
            keywords: this.keywords,
            page: this.page
          }
        })
        .then(res => {
          const { data, total } = res;
          this.blogs = data;
          this.total = total;
          this.loading = false;
        });
    },
    handleRouter(blogId) {
      this.keywords = "";
      this.page = 1;
      this.blogs = [];
      this.total = 0;
      this.$store.commit("setSearch", false);
      this.$router.push({ path: `/blog/${blogId}` });
    }
  }
};
</script>
<style scoped>
.drawer {
  z-index: 20000 !important;
}

.drawer .drawer-header {
  width: 100%;
}
.drawer .drawer-input {
  width: 50%;
  margin: 20px auto 20px;
}
.drawer .drawer-body {
  padding: 20px 40px;
}
.drawer .drawer-body a {
  text-decoration: none;
}
</style>