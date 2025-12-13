<template>
  <div class="data-display-layout">
    <header class="header-toolbar">
      <nav class="header-tabs">
        <router-link :to="{ name: RouteNames.SUMMARY }" class="tab" active-class="active">汇总数据展示</router-link>
        <router-link :to="{ name: RouteNames.COMPARISON }" class="tab" active-class="active">数据比对展示</router-link>
        <router-link :to="{ name: RouteNames.HEATMAP }" class="tab" active-class="active">单位热力图</router-link>
        <router-link :to="{ name: RouteNames.BUILDING }" class="tab" active-class="active">建筑物展示</router-link>
        <router-link :to="{ name: RouteNames.CUSTOM_AREA }" class="tab" active-class="active">自定义区域汇总</router-link>
      </nav>
      
      <div class="header-actions">
        <button class="action-btn">筛选条件</button>
        <button class="action-btn">单位</button>
        <button class="action-btn">切换</button>
      </div>
    </header>

    <section class="nested-content-area">
      <router-view></router-view>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouteNames } from '../router'; // 确保路径正确
</script>

<style scoped>
/* 样式与之前 App.vue 中的 header-toolbar 相关样式保持一致 */
.data-display-layout {
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保容器占满父容器 */
}

/* --- 顶部工具栏样式 --- */
.header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-tabs {
  display: flex;
  gap: 20px;
}

.tab {
  cursor: pointer;
  padding: 5px 0;
  color: #666;
  font-size: 14px;
  text-decoration: none; /* 移除 router-link 默认下划线 */
}

.tab.active {
  color: #1890ff; /* 蓝色高亮 */
  border-bottom: 2px solid #1890ff;
  font-weight: bold;
}

.header-actions .action-btn {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 8px 15px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.nested-content-area {
    flex: 1;
    overflow: hidden;
}
</style>