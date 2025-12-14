<template>
  <section class="center-map-area">
    <div class="map-placeholder">
      <h2>地理信息系统 地图占位区域</h2>
      <div class="map-tools-overlay">
         <button>🔍</button>
         <button>📐</button>
         <button>🖼️</button>
         <button>🖨️</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 未来这里是地图 SDK 初始化的地方
</script>

<style scoped>
/* --- 中间地图区域样式 --- */
.center-map-area {
  flex: 1; /* 占据剩余所有空间 */
  position: relative;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e6f7ff; /* 模拟地图的浅蓝色 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #1890ff;
  font-size: 18px;
  text-align: center;
}

.map-tools-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border-radius: 4px;
}

.map-tools-overlay button {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}
</style>