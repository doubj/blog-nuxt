<template>
  <div class="container">
      <Top />
      <div class="main" id="main">
        <nuxt />
      </div>
      <Footer />
      <Drawer/>
      <el-backtop>
        <i class="el-icon-top" style="font-size:30px; font-weight:1000;color:#10ac84"></i>
      </el-backtop>
  </div>
</template>

<script>
import Top from "@/components/Top";
import Drawer from "@/components/Drawer";
import Footer from "@/components/Footer";
export default {
  components: { Top, Footer, Drawer},
};
</script>