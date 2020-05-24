<template>
  <div style="padding:10px">
    <div class="comment" v-for="(item,index) in items" :key="index">
      <p class="comment-header">
        <strong class="pointer" @click="handleReply(item.commentId,item)">{{item.nickName}}</strong>
        <span>：{{item.createTime}}</span>
      </p>
      <p>{{item.content}}</p>
      <div class="subItem" v-for="(subItem,i) in item.children" :key="i">
        <p class="comment-header">
          <strong
            @click="handleReply(item.commentId,subItem)"
            :class="[{'admin' : subItem.replyAdmin},'pointer']"
          >{{subItem.nickName}}</strong>
          <strong v-if="subItem.replyAdmin" class="admin">(博主)</strong>
          &nbsp;回复&nbsp;
          <strong
            :class="{'admin' : subItem.beRepliedAdmin}"
          >{{subItem.replyNickName}}</strong>
          <strong v-if="subItem.beRepliedAdmin" class="admin">(博主)</strong>
          <span>：{{subItem.createTime}}</span>
        </p>
        <p>{{subItem.content}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentItems",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleReply(id, item) {
      this.$emit("handleReply", id, item);
    }
  }
};
</script>

<style scoped>
.comment {
  border-bottom: thin solid #b2bec3;
  margin-bottom: 20px;
}
.comment-header {
  font-size: 14px;
}
.pointer {
  cursor: pointer;
}
.comment-header strong {
  color: #1abc9c;
}
.comment-header span {
  color: #9e9e9e;
}
.comment .subItem {
  margin-left: 30px;
}
.comment .subItem .admin {
  color: #ff7675;
}
</style>