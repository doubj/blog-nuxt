<template>
  <div class="back-img" :style="{ background: backImage }">
    <div :class="['header','fix',{ 'base-bgcolor' : showHeaderBGcolor}]">
      <div class="navbar">
        <nuxt-link class="logo" :to="'/'">
          <nv-button class="logo" icon="iconfont icon-L_Bar_Moon" type="success">青衫仗剑</nv-button>
            <!-- <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-L_Bar_Moon" />
            </svg>青衫仗剑 -->
        </nuxt-link>
        <div style="float: right; margin-right:30px">
          <nuxt-link v-for="(item, index) in items" :key="index" :to="item.to">
            <nv-button :icon="item.icon" type="success">{{item.name}}</nv-button>
          </nuxt-link>
          <nv-button icon="el-icon-search" type="success" @click="handleSearch"></nv-button>
        </div>
      </div>
    </div>
    <div class="text-center" style="min-height:100px">
      <no-ssr>
        <vue-typer v-if="!hasTitle" text="欲渡黄河冰塞川，将登太行雪满山" eraseStyle="backspace"></vue-typer>
      </no-ssr>
    </div>
    <span class="title text-center" v-if="hasTitle">{{ this.$store.state.title }}</span>
    <div class="arrow-down">
      <i style="font-size:32px;" class="iconfont icon-chevrondown" @click.stop="scrollToMain"></i>
    </div>
  </div>
</template>

<script>
const navbarItems = [
  {
    to: "/",
    name: "首页",
    icon: "el-icon-s-home"
  },
  {
    to: "/archives",
    name: "归档",
    icon: "el-icon-s-cooperation"
  },
  {
    to: "/message",
    name: "留言",
    icon: "el-icon-message"
  }
];
const cubic = value => Math.pow(value, 3);
const easeInOutCubic = value =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

if (process.browser) {
  var VueTyper = require("vue-typer").VueTyper;
}
import throttle from "throttle-debounce/throttle";
import NvButton from "@/components/Button";
export default {
  name: "Navbar",
  components: { NvButton, VueTyper },
  data() {
    return {
      items: Object.assign({}, navbarItems)
    };
  },
  mounted() {
    this.throttledScrollHandler = throttle(100, this.handleScroll);
    window.addEventListener("scroll", this.throttledScrollHandler);
  },
  computed: {
    showHeaderBGcolor() {
      return this.$store.state.scroll > 30;
    },
    backImage() {
      return this.$store.state.image;
    },
    hasTitle() {
      return (
        this.$store.state.title != undefined && this.$store.state.title != ""
      );
    }
  },
  methods: {
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
    handleSearch() {
      this.$store.commit("setSearch", true);
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
  height: 60px;
  transition: all 0.4s ease 0s;
}
.fix {
  position: fixed;
  z-index: 10000;
}
.navbar {
  height: 60px;
  width: 80%;
  margin: 0 auto;
}
.logo {
  font-size: 24px;
}
.back-img {
  background-size: 100% 100% !important;
  width: 100%;
  height: 100vh;
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
</style>