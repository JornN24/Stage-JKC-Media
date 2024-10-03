<template>
  <button class="character-button" @click="handleClick">
    <img :src="imageSrc" :alt="name" />
  </button>
</template>

<script>
export default {
  props: {
    name: String,
    imageSrc: String
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>

<style>
.character-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.character-button img {
  width: 100%;
  height: 100%;
}

.character-button:hover {
  transform: scale(1.1);
}
</style>
