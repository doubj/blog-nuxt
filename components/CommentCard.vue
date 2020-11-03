<template>
  <el-card style="margin-top:20px">
    <span class="iconfont icon-FontAwesomecommentssolid" style="font-size:26px;color:#34495e"></span>&nbsp;
    <span style="font-weight: bold;color:#34495e;font-size=20px">评论</span>
    <el-form ref="commentForm" :rules="rules" :model="comment" style="margin-top:20px">
      <el-row>
        <el-col :span="10">
          <el-form-item prop="nickName">
            <el-input v-model="comment.nickName" placeholder="请输入昵称（必填）" />
          </el-form-item>
        </el-col>
        <el-col :span="11" style="float:right">
          <el-form-item prop="email">
            <el-input v-model="comment.email" placeholder="请输入联系邮箱（选填）" />
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
          v-model="comment.content"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="float:right; margin-top:10px" type="primary" @click="submitComment">评论</el-button>
      </el-form-item>
    </el-form>
    <commentItems :items="items" @handleReply="handleReply(arguments)" />
  </el-card>
</template>

<script>
import CommentItems from "@/components/CommentItems";
const defaultComment = {
  nickName: "",
  email: "",
  content: "",
  type: "article",
  replyNickName: undefined,
  blogId: 0,
  pid: 0
};
export default {
  name: "CommentCard",
  components: { CommentItems },
  props: {
    blogId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      page: 1,
      items: [],
      total: 0,
      comment: Object.assign({}, defaultComment),
      query: {
        page: 1,
        limit: 6,
        blogId: this.blogId
      },
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
          { required: true, message: "请输入评论内容", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    placeHolder: function() {
      return this.comment.replyNickName === undefined
        ? "请输入评论内容（必填）"
        : "re：" + this.comment.replyNickName;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios
        .$post(`/comment/query`, this.query)
        .then(res => {
          this.comment.blogId = this.blogId;
          this.items = res.items;
          this.total = res.count;
        });
    },
    submitComment() {
      this.$refs["commentForm"].validate(valid => {
        if (valid) {
          //   console.log(this.comment);
          this.$axios.$post(`/comment`, this.comment).then(res => {
            this.init();
            this.comment = Object.assign({}, defaultComment);
            this.comment.blogId = this.blogId;
          });
        } else {
          return false;
        }
      });
    },
    handleReply(args) {
      const id = args[0];
      const item = args[1];
      var replyNickName = item.nickName
      if(item.replyAdmin){
        this.comment.beRepliedAdmin = true
      }else{
        this.comment.beRepliedAdmin = false
      }
      if (
        this.comment.replyNickName !== undefined &&
        this.comment.replyNickName === replyNickName &&
        this.comment.pid === id
      ) {
        this.comment.replyNickName = undefined;
        this.comment.pid = 0;
      } else {
        this.comment.replyNickName = replyNickName;
        this.comment.pid = id;
      }
    }
  }
};
</script>

<style scoped>
</style>