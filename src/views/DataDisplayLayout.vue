<template>
  <div class="data-display-container">
    <!-- Tab导航栏 -->
    <a-tabs v-model:activeKey="activeTabKey" class="custom-tabs" @change="handleTabChange">
      <a-tab-pane key="summary" tab="汇总数据展示" />
      <a-tab-pane key="comparison" tab="数据比对展示" />
      <a-tab-pane key="heatmap" tab="单位热力图" />
      <a-tab-pane key="building" tab="建筑物展示" />
      <a-tab-pane key="custom" tab="自定义区域汇总" />
    </a-tabs>
 
    <!-- 操作按钮区 -->
    <div class="action-bar">
      <a-button type="primary" @click="showFilterModal">
        <template #icon><FilterOutlined /></template>
        筛选条件 
      </a-button>
      <a-button>
        <template #icon><ApartmentOutlined /></template>
        单位 
      </a-button>
      <a-button>
        <template #icon><SwapOutlined /></template>
        切换 
      </a-button>
    </div>
 
    <!-- 动态内容区 -->
    <div class="content-area">
      <component 
        :is="activeComponent" 
        :filter-params="filterParams"
        class="tab-content"
      />
    </div>
 
    <!-- 筛选模态框 --> 
    <FilterModal 
      :is-visible="filterVisible"
      @update:is-visible="handleFilterVisibleChange"
      @apply="handleFilterApply"
    />
  </div>
</template>
 
<script setup lang="ts">
import { ref, computed } from 'vue';
import { FilterOutlined, ApartmentOutlined, SwapOutlined } from '@ant-design/icons-vue';
import FilterModal from './FilterModal.vue';  
import SummaryDisplay from './SummaryDisplay.vue';  
 
// Tab相关状态 
const activeTabKey = ref('summary');
const filterParams = ref({});
const filterVisible = ref(false);
 
// 组件映射 (暂时只保留summary组件，其他组件可以后续添加)
const componentMap = {
  summary: SummaryDisplay
};
 
// 计算当前活动组件
const activeComponent = computed(() => componentMap[activeTabKey.value as keyof typeof componentMap]);
 
// Tab切换处理 
const handleTabChange = (key: string) => {
  activeTabKey.value  = key;
};
 
// 筛选相关方法 
const showFilterModal = () => {
  filterVisible.value  = true;
};
 
const handleFilterVisibleChange = (visible: boolean) => {
  filterVisible.value  = visible;
};
 
const handleFilterApply = (filters: any) => {
  filterParams.value  = filters;
  console.log(' 应用筛选条件:', filters);
  // 这里可以根据筛选条件重新加载数据
};
</script>
 
<style scoped lang="less">
.data-display-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  padding: 16px;
}
 
.custom-tabs {
  :deep(.ant-tabs-nav) {
    margin: 0;
    
    .ant-tabs-tab {
      padding: 12px 0;
      font-size: 14px;
      
      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #1890ff;
          font-weight: 500;
        }
      }
    }
    
    .ant-tabs-ink-bar {
      background: #1890ff;
    }
  }
}
 
.action-bar {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
  
  .ant-btn {
    display: flex;
    align-items: center;
  }
}
 
.content-area {
  flex: 1;
  overflow: hidden;
  
  .tab-content {
    height: 100%;
  }
}
</style>