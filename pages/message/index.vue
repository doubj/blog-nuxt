<template>
  <div class="message">
    <aside>
      感谢您的留言，如需回复请注明
      <strong>联系邮箱</strong>
      <br />也可直接通过页脚的联系方式直接与我联系
    </aside>
    <el-form ref="messageForm" :rules="rules" :model="message">
      <el-row>
        <el-col :span="10">
          <el-form-item prop="nickName">
            <el-input v-model="message.nickName" placeholder="请输入昵称（必填）" />
          </el-form-item>
        </el-col>
        <el-col :span="11" style="float:right">
          <el-form-item prop="email">
            <el-input v-model="message.email" placeholder="请输入联系邮箱（选填）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="content">
        <el-input
          type="textarea"
          :rows="3"
          :placeholder="placeHolder"
          maxlength="255"
          show-word-limit
          v-model="message.content"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="float:right; margin-top:10px" type="primary" @click="submitMessage">留言</el-button>
      </el-form-item>
    </el-form>
    <el-divider>非常感谢您的留言</el-divider>
    <div class="null-info" v-if="items.length == 0">
      <span>成为第一个留言的人吧~</span>
    </div>
    <div v-loading="loading" v-if="items.length > 0">
      <commentItems :items="items" @handleReply="handleReply(arguments)" />
      <el-pagination
        style="text-align:center;margin-bottom:20px"
        background
        @current-change="fetchMessage"
        :hide-on-single-page="true"
        :current-page.sync="page"
        :page-size="6"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import CommentItems from '@/components/CommentItems'
const defaultMessage = {
  nickName: "",
  email: "",
  content: "",
  type: "message",
  replyNickName: undefined,
  pid: 0
};
export default {
  async asyncData({ $axios }) {
    const res = await $axios.$get(`/comment`, {
      params: {
        page: 1,
        type: "message"
      }
    });
    return {
      items: res.items,
      total: res.count
    };
  },
  components: { CommentItems },
  data() {
    return {
      message: Object.assign({}, defaultMessage),
      page: 1,
      loading: false,
      rules: {
        nickName: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "昵称长度在 1 到 20 个字符",
            trigger: "blur"
          }
        ],
        content: [
          { required: true, message: "请输入留言内容", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  computed: {
    placeHolder: function() {
      return this.message.replyNickName === undefined
        ? "请输入留言内容（必填）"
        : "re：" + this.message.replyNickName;
    }
  },
  methods: {
    init() {
      const index = Math.floor(Math.random() * 4) + 1;
      this.$store.commit("setImage", `/${index}.jpg`);
    },
    fetchMessage() {
      this.loading = true;
      this.$axios
        .$get(`/comment`, {
          params: {
            page: this.page,
            type: "message"
          }
        })
        .then(res => {
          this.items = res.items;
          this.total = res.count;
          this.loading = false;
        });
    },
    submitMessage() {
      this.$refs['messageForm'].validate(valid => {
        if (valid) {
          this.$axios.$post(`/comment`, this.message).then(res => {
            this.fetchMessage();
            this.message = Object.assign({}, defaultMessage);
          });
        } else{
          return false
        }
      });
    },
    handleReply(args) {
      const id = args[0];
      const item = args[1];
      var replyNickName = item.nickName
      if(item.replyAdmin){
        this.message.beRepliedAdmin = true
      }else{
        this.message.beRepliedAdmin = false
      }
      if (
        this.message.replyNickName !== undefined &&
        this.message.replyNickName === replyNickName &&
        this.message.pid === id
      ) {
        this.message.replyNickName = undefined;
        this.message.pid = 0;
      } else {
        this.message.replyNickName = replyNickName;
        this.message.pid = id;
      }
    }
  }
};
</script>

<style scoped>
aside {
  background: #dfe6e9;
  margin: 0 0 40px;
  padding: 20px;
}
.message{
  width: 50%;
  margin:0 auto;
}
</style>