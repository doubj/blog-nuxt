<template>
  <div class="archives">
    <el-timeline
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    >
      <el-timeline-item
        v-for="(item , i) in list"
        :key="i"
        :timestamp="item.createTime"
        placement="top"
      >
        <card :blog="item"></card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import Card from "@/components/Card";
export default {
  data() {
    return {
      busy: false,
      query: {
        page: 0,
        limit: 3,
        blogCategoryName: "",
        blogTags: []
      },
      list: []
    };
  },
  components: { Card },
  created() {
    this.init();
    this.loadMore();
  },
  methods: {
    init() {
      const index = Math.floor(Math.random() * 4) + 1;
      this.$store.commit("setImage", `/${index}.jpg`);
    },
    loadMore() {
      this.busy = true;
      this.query.page += 1;
      this.$axios.$post("/blog/query", this.query).then(res => {
        if (res !== undefined && res.length > 0) {
          this.list.push(...res);
          this.busy = false;
        } else {
          this.busy = true;
        }
      });
    }
  }
};
</script>

<style scoped>
.archives {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>