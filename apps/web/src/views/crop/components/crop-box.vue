<template>
  <div class="crop-box" :style="computedStyle" @mousedown.stop.prevent="startDrag('move', $event)">
    <span
      v-for="dir in DIRECTIONS"
      :key="dir"
      :data-dir="dir"
      class="crop-box__handle"
      @mousedown.stop.prevent="startDrag(dir, $event)"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useCropStore } from '@/views/crop/stores/crop';
import type { DragMode, ElementStyle } from '@/views/crop/types';

const DIRECTIONS: ReadonlyArray<DragMode> = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const DRAG_START = { mouseX: 0, mouseY: 0, rectX: 0, rectY: 0, rectW: 0, rectH: 0 };
const MIN_SIZE = 40 as const;

let dragMode: DragMode | null = null;

const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

const { containerDimensions, cropDimensions } = storeToRefs(useCropStore());

const computedStyle = computed<ElementStyle>(() => ({
  top: `${cropDimensions.value.y}px`,
  left: `${cropDimensions.value.x}px`,
  width: `${cropDimensions.value.width}px`,
  height: `${cropDimensions.value.height}px`,
}));

const onDrag = ({ clientX, clientY }: MouseEvent): void => {
  if (!dragMode) {
    return;
  }

  const dx = clientX - DRAG_START.mouseX;
  const dy = clientY - DRAG_START.mouseY;

  if (dragMode === 'move') {
    cropDimensions.value.x = clamp(
      DRAG_START.rectX + dx,
      0,
      containerDimensions.value.width - cropDimensions.value.width,
    );
    cropDimensions.value.y = clamp(
      DRAG_START.rectY + dy,
      0,
      containerDimensions.value.height - cropDimensions.value.height,
    );
    return;
  }

  let { rectX, rectY, rectW, rectH } = DRAG_START;
  let x = rectX;
  let y = rectY;
  let w = rectW;
  let h = rectH;

  if (dragMode.includes('e')) w = rectW + dx;
  if (dragMode.includes('s')) h = rectH + dy;
  if (dragMode.includes('w')) {
    w = rectW - dx;
    x = rectX + dx;
  }
  if (dragMode.includes('n')) {
    h = rectH - dy;
    y = rectY + dy;
  }

  w = clamp(w, MIN_SIZE, containerDimensions.value.width - x);
  h = clamp(h, MIN_SIZE, containerDimensions.value.height - y);
  x = clamp(x, 0, containerDimensions.value.width - w);
  y = clamp(y, 0, containerDimensions.value.height - h);

  cropDimensions.value = { x, y, width: w, height: h };
};

const stopDrag = (): void => {
  dragMode = null;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

const startDrag = (mode: DragMode, e: MouseEvent): void => {
  dragMode = mode;
  DRAG_START.mouseX = e.clientX;
  DRAG_START.mouseY = e.clientY;
  DRAG_START.rectX = cropDimensions.value.x;
  DRAG_START.rectY = cropDimensions.value.y;
  DRAG_START.rectW = cropDimensions.value.width;
  DRAG_START.rectH = cropDimensions.value.height;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

onBeforeUnmount(stopDrag);
</script>

<style scoped>
.crop-box {
  border: 1px solid var(--color-accent);
  cursor: move;
}
.crop-box__handle {
  --offset: -6px;
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  border: 2px solid #fff;
  border-radius: 50%;
  position: absolute;
  cursor: var(--cursor);
  box-sizing: content-box;
}
.crop-box__handle[data-dir='n'] {
  top: var(--offset);
  left: 0;
  right: 0;
  margin: auto;
  --cursor: n-resize;
}
.crop-box__handle[data-dir='s'] {
  bottom: var(--offset);
  left: 0;
  right: 0;
  margin: auto;
  --cursor: s-resize;
}
.crop-box__handle[data-dir='e'] {
  right: var(--offset);
  top: 0;
  bottom: 0;
  margin: auto;
  --cursor: e-resize;
}
.crop-box__handle[data-dir='w'] {
  left: var(--offset);
  top: 0;
  bottom: 0;
  margin: auto;
  --cursor: w-resize;
}
.crop-box__handle[data-dir='nw'] {
  top: var(--offset);
  left: var(--offset);
  --cursor: nw-resize;
}
.crop-box__handle[data-dir='ne'] {
  top: var(--offset);
  right: var(--offset);
  --cursor: ne-resize;
}
.crop-box__handle[data-dir='sw'] {
  bottom: var(--offset);
  left: var(--offset);
  --cursor: sw-resize;
}
.crop-box__handle[data-dir='se'] {
  bottom: var(--offset);
  right: var(--offset);
  --cursor: se-resize;
}
</style>
