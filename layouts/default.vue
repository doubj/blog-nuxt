<template>
  <div class="container">
      <navbar />
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
import Navbar from "@/components/Navbar";
import Drawer from "@/components/Drawer";
import Footer from "@/components/Footer";
export default {
  components: { Navbar, Footer, Drawer},
};
</script>