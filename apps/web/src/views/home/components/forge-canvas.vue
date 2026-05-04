<template>
  <canvas ref="canvasRef" class="forge-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useFFmpegStore } from '@/stores/ffmpeg';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  glow: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const progress = ref(0);

let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;

const NUM_SPARKS = 200 as const;
const LINE_DISTANCE = 120 as const;

const sparks: Array<Spark> = [];

const ffmpegStore = useFFmpegStore();

const initSparks = (width: number, height: number): void => {
  sparks.length = 0;
  for (let i = 0; i < NUM_SPARKS; i++) {
    sparks.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      glow: Math.random(),
    });
  }
};

const draw = (width: number, height: number): void => {
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, width, height);

  // Draw lines connecting sparks
  for (let i = 0; i < sparks.length; i++) {
    const s1 = sparks[i];
    for (let j = i + 1; j < sparks.length; j++) {
      const s2 = sparks[j];
      if (!s1 || !s2) {
        continue;
      }
      const dx = s1.x - s2.x;
      const dy = s1.y - s2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < LINE_DISTANCE) {
        const alpha = (1 - dist / LINE_DISTANCE) * 0.3 + progress.value / 300; // pulse with progress
        ctx.strokeStyle = `rgba(255,200,50,${alpha})`;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      }
    }
  }

  // Draw sparks
  for (const spark of sparks) {
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 500 + spark.glow * 5);
    const glowFactor = 0.5 + progress.value / 200; // brighter when progress
    const radius = spark.radius * (pulse * glowFactor + 0.5);
    ctx.fillStyle = `rgba(255,180,50,${0.6 * glowFactor})`;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
};

const update = (width: number, height: number): void => {
  for (const spark of sparks) {
    spark.x += spark.vx;
    spark.y += spark.vy;
    if (spark.x < 0 || spark.x > width) spark.vx *= -1;
    if (spark.y < 0 || spark.y > height) spark.vy *= -1;
  }
};

const animate = (): void => {
  if (!canvasRef.value) {
    return;
  }

  const width = (canvasRef.value.width = window.innerWidth);
  const height = (canvasRef.value.height = window.innerHeight);

  update(width, height);
  draw(width, height);

  animationId = requestAnimationFrame(animate);
};

onMounted(() => {
  if (!canvasRef.value) {
    return;
  }
  ctx = canvasRef.value.getContext('2d');
  if (!ctx) {
    return;
  }

  initSparks(window.innerWidth, window.innerHeight);
  animate();

  // window.addEventListener('resize', () => initSparks(window.innerWidth, window.innerHeight));
});

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

watch(
  () => ffmpegStore.progressValue,
  (val) => {
    progress.value = Math.min(val, 100);
  },
);
</script>

<style scoped>
.forge-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0b0c1c;
}
</style>
