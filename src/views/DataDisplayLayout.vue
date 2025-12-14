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
        <button class="action-btn action-filter" @click="isFilterModalVisible = true">筛选条件</button>
        <button class="action-btn action-unit">单位</button>
        <button class="action-btn action-switch">切换</button>
      </div>
    </header>

    <section class="nested-content-area">
      <router-view></router-view>
    </section>

    <FilterModal 
      :isVisible="isFilterModalVisible"
      @update:isVisible="isFilterModalVisible = $event"
      @apply="handleApplyFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouteNames } from '../router'; 
import FilterModal from './FilterModal.vue'; // 引入新组件

// 控制筛选弹窗的显示状态
const isFilterModalVisible = ref(false);

// 处理筛选条件应用的逻辑
const handleApplyFilters = (filters: any) => {
    console.log('应用筛选条件:', filters);
    // 实际项目中，这里会调用 API 或更新全局状态来加载新的图表数据
    // 例如：store.dispatch('loadDataWithFilters', filters);
};
</script>

<style scoped>
/* 保持原 DataDisplayLayout.vue 中的样式不变 */
/* 确保容器占满父容器的剩余空间 */
.data-display-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  flex-shrink: 0; /* 防止顶部栏被压缩 */
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
  text-decoration: none;
  white-space: nowrap; /* 防止 Tab 文本换行 */
}

.tab.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
  font-weight: bold;
}

.header-actions {
    display: flex;
    gap: 8px;
}

.header-actions .action-btn {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.action-unit, .action-switch {
    background-color: #e6f7ff;
    color: #1890ff;
    border: 1px solid #1890ff;
}

.nested-content-area {
    flex: 1;
    overflow: hidden; /* 确保内容区可以填满 DataDisplayLayout 的剩余高度 */
}
</style>