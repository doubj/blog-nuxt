<template>
  <button class="nv-button" @click.stop="handleClick">
    <i :class="icon" v-if="icon"></i>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: "NvButton",
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  methods: {
    handleClick(e) {
      this.$emit("click", e);
    }
  }
};
</script>

<style >
.nv-button {
  cursor: pointer;
  color: white;
  height: 60px;
  font-family: "黑体";
  font-size: 16px;
  border: none;
  background: none;
  margin-left: 5px;
  padding: 15px;
  outline: none;
}
.nv-button:hover {
  background-color: rgba(223, 230, 233, 0.4);
}
</style>