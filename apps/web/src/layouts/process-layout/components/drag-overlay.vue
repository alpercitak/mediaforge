<template>
  <div class="drag-overlay">Drop</div>
</template>

<style scoped>
.drag-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
}
</style>
