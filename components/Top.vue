<template>
  <div class="back-img" :style="{ background: backImage }">
    <div :class="['header','fix',{ 'base-bgcolor': showHeaderBGcolor, 'header-higher': showHeaderBGcolor}]">
      <div class="navbar">
        <nuxt-link class="logo" :to="'/'">
          <nv-button class="logo" icon="iconfont icon-L_Bar_Moon" type="success">青衫仗剑</nv-button>
        </nuxt-link>
        <div style="float: right; margin-right:30px;height:100%">
          <nv-button icon="el-icon-search" type="success" @click="clickSearch"></nv-button>
        </div>
      </div>
    </div>
    <div v-if="!hasTitle && recommendItem === null" class="text-center" style="min-height:100px">
      <no-ssr>
        <vue-typer text="欲渡黄河冰塞川，将登太行雪满山" eraseStyle="backspace"></vue-typer>
      </no-ssr>
    </div>
    <div v-if="!hasTitle && recommends.length > 0" class="recommend-container">
      <img v-for="(recommend, idx) of recommends" :key="idx" :src="recommend.value | recommendFilter(2)" @click="routerToDetail(recommend)" @mouseenter="recommendItem=recommend" @mouseleave="recommendItem=null" />
    </div>
    <span v-if="hasTitle || recommendItem !== null" class="title text-center">{{ hasTitle ? this.$store.state.title : recommendItem.value | recommendFilter(1)}}</span>
    <div class="arrow-down">
      <i style="font-size:32px;" class="iconfont icon-chevrondown" @click.stop="scrollToMain"></i>
    </div>
  </div>
</template>

<script>
const cubic = value => Math.pow(value, 3);
const easeInOutCubic = value =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

if (process.browser) {
  var VueTyper = require("vue-typer").VueTyper;
}
import throttle from "throttle-debounce/throttle";
import NvButton from "@/components/Button";
export default {
  name: "Top",
  components: { NvButton, VueTyper },
  data() {
    return {
      recommendItem: null,
    };
  },
  mounted() {
    this.throttledScrollHandler = throttle(100, this.handleScroll);
    window.addEventListener("scroll", this.throttledScrollHandler);
  },
  filters: {
    recommendFilter: (value, idx) => {
      const recommendProperties = value.split('-doubj-');
      return recommendProperties.length > 1 ? recommendProperties[idx] : value;
    }
  },
  computed: {
    showHeaderBGcolor() {
      return this.$store.state.scroll > 30;
    },
    backImage() {
      return this.hasTitle ? this.$store.state.image : (this.recommendItem === null ? this.$store.state.image : `url(${this.recommendItem.value.split("-doubj-")[2]}) no-repeat`);
    },
    recommends() {
      return this.$store.state.recommends.slice(0, 3);
    },
    hasTitle() {
      return (
        this.$store.state.title !== undefined && this.$store.state.title !== ""
      );
    }
  },
  methods: {
    routerToDetail(recommend) {
      this.$router.push({ path: `/blog/${recommend.value.split("-doubj-")[0]}` });
      this.recommendItem = null;
    },
    handleScroll() {
      const scroll =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.$store.commit("setScroll", scroll);
    },
    scrollToMain() {
      const el = document.querySelector("#main");
      const beginTime = Date.now();
      const beginValue = document.documentElement.scrollTop;
      const endValue = el.offsetTop - 80;
      const rAF =
        window.requestAnimationFrame || (func => setTimeout(func, 16));
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500;
        if (progress < 1) {
          document.documentElement.scrollTop =
            beginValue + (endValue - beginValue) * easeInOutCubic(progress);
          rAF(frameFunc);
        } else {
          document.documentElement.scrollTop = endValue;
        }
      };
      rAF(frameFunc);
    },
    clickSearch() {
      this.$store.commit("toggleSearch");
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.throttledScrollHandler);
  }
};
</script>


<style scoped>
.header {
  width: 100%;
  height: 45px;
  transition: all 0.4s ease 0s;
}
.header .nv-button{
  height: 100%;
}
.header-higher{
  height: 60px;
}
.fix {
  position: fixed;
  z-index: 10000;
}
.navbar {
  height: 100%;
  width: 80%;
  margin: 0 auto;
}
.logo {
  font-size: 24px;
  padding: 0 10px;
}
.back-img {
  background-size: 100% 100% !important;
  width: 100%;
  height: 100vh;
  transition: background .4s ease-in-out 0s;
}
.arrow-down {
  color: white;
  position: absolute;
  left: 50%;
  bottom: 80px;
  cursor: pointer;
  animation: MoveDown 2s infinite;
}
@keyframes MoveDown {
  0% {
    bottom: 80px;
  }
  50% {
    bottom: 70px;
  }
  100% {
    bottom: 80px;
  }
}
.title {
  background: rgba(45, 52, 54, 0.4);
  color: white;
  font-size: 42px;
  font-weight: 1000;
  font-family: "宋体";
}
.recommend-container {
  position: absolute;
  bottom: 5vh;
  height: 10vh;
  display: flex;
}
.recommend-container>img {
  width: 8em;
  padding: 5px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease 0s;
}
.recommend-container>img:hover {
  transform: scale(1.5);
}
</style>