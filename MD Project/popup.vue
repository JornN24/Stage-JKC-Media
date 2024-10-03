<template>
  <div class="popup" @click="handleOutsideClick">
    <div class="popup-inner" @click.stop>
      <div class="popup-header">
        <h3>{{ character.name }}</h3>
        <button class="popup-close" @click="TogglePopup(null)">&#x2715;</button>
      </div>
      <img :src="character.imageSrc" :alt="character.name" class="popup-image" />
      <p class="popup-text">{{ character.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['character', 'TogglePopup'],
  methods: {
    handleOutsideClick(event) {
      if (event.target === event.currentTarget) {
        this.TogglePopup(null);
      }
    }
  }
}
</script>

<style lang="scss">
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.popup-inner {
  border-radius: 10px;
  max-height: 90vh;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.popup-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
}

.popup-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

.popup-image {
  width: 100%;
  height: auto;
  max-height: calc(90vh - 60px);
  object-fit: contain;
}

.popup-text {
  width: 100%;
  font-size: 0.8rem;
  color: white;
  padding: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 1;
}
</style>
