<template>
  <div id="mk" style="color:#34495e" v-html="processedMarkdown"></div>
</template>

<script>
import marked from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
var rendererMD = new marked.Renderer();
marked.setOptions({
  renderer: rendererMD,
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  },
  langPrefix: "hljs ",
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});
export default {
  props: ["markdown"],
  mounted() {
    this.handleNavTree();
    // this.getDocsFirstLevels(0);
  },
  computed: {
    processedMarkdown() {
      let index = 0;
      rendererMD.heading = function(text, level) {
        if (level <= 2) {
          return `<a class="target-fix" id="data-${index++}"></a><h${level} class="blog-heading">${text}</h${level}>`;
        } else {
          return `<h${level} class="blog-heading">${text}</h${level}>`;
        }
      };
      // rendererMD.code = function(code) {
      //   code = code.replace(/\r\n/g, "<br>");
      //   code = code.replace(/\n/g, "<br>");
      //   return `<pre><code class="hljs java">${code}</code></pre>`;
      // };
      return marked(this.markdown);
    }
  },
  methods: {
    handleNavTree() {
      let navs = this.getTitle(this.markdown);
      let navLevel = [1, 2];
      let retNavs = [];
      let toAppendNavList;

      navLevel.forEach(level => {
        // 遍历一级二级标题，将同一级的标题组成新数组
        toAppendNavList = this.find(navs, {
          level: level
        });
        if (retNavs.length === 0) {
          // 处理一级标题
          retNavs = retNavs.concat(toAppendNavList);
        } else {
          // 处理二级标题，并将二级标题添加到对应的父级标题的children中
          toAppendNavList.forEach(item => {
            item = Object.assign(item);
            let parentNavIndex = this.getParentIndex(navs, item.index);
            return this.appendToParentNav(retNavs, parentNavIndex, item);
          });
        }
      });
      this.$emit('setNavList',retNavs)
      // console.log(retNavs);
      // return retNavs;
    },
    getTitle(content) {
      let nav = [];

      let tempArr = [];
      //修改(#+)为(#+ )，因为有时文章引用的链接中也会有#，所以需要准确匹配到# 的形式,m1的长度也相应要减1
      content.replace(/(#+ )[^#][^\n]*?(?:\n)/g, function(match, m1) {
        let title = match.replace("\n", "");
        let level = m1.length - 1;
        tempArr.push({
          title: title.replace(/^#+/, "").replace(/\([^)]*?\)/, ""),
          level: level,
          children: []
        });
      });

      // 只处理一级二级标题，以及添加与id对应的index值
      nav = tempArr.filter(item => item.level <= 2);
      let index = 0;
      return (nav = nav.map(item => {
        item.index = index++;
        return item;
      }));
    },
    find(arr, condition) {
      return arr.filter(item => {
        for (let key in condition) {
          if (condition.hasOwnProperty(key) && condition[key] !== item[key]) {
            return false;
          }
        }
        return true;
      });
    },
    getParentIndex(nav, endIndex) {
      for (var i = endIndex - 1; i >= 0; i--) {
        if (nav[endIndex].level > nav[i].level) {
          return nav[i].index;
        }
      }
    },
    appendToParentNav(nav, parentIndex, newNav) {
      let index = this.findIndex(nav, {
        index: parentIndex
      });
      nav[index].children = nav[index].children.concat(newNav);
    },
    findIndex(arr, condition) {
      let ret = -1;
      arr.forEach((item, index) => {
        for (var key in condition) {
          if (condition.hasOwnProperty(key) && condition[key] !== item[key]) {
            return false;
          }
        }
        ret = index;
      });
      return ret;
    },
    // getDocsFirstLevels(times) {
    //   // 解決圖片加載會影響高度問題
    //   const arr = [];
    //   setTimeout(() => {
    //     let firstLevels = [];
    //     Array.from(document.querySelectorAll("h1"), element => {
    //       firstLevels.push(element.offsetTop - 60);
    //     });
    //     // this.docsFirstLevels = firstLevels;
    //     arr = firstLevels;
    //     if (times < 8) {
    //       this.getDocsFirstLevels(times + 1);
    //     }
    //   }, 500);
    //   console.log(arr);
    // }
  }
};
</script>
