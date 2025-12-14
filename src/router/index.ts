// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
// 引入父级容器组件
import DataDisplayLayout from '../views/DataDisplayLayout.vue'; 
// 引入子页面组件
import SummaryDisplay from '../views/SummaryDisplay.vue'; 
import ComparisonDisplay from '../views/ComparisonDisplay.vue';
import HeatmapDisplay from '../views/HeatmapDisplay.vue';
import BuildingDisplay from '../views/BuildingDisplay.vue';
import CustomAreaDisplay from '../views/CustomAreaDisplay.vue';


// 路由路径常量
export const RouteNames = {
  // 父级
  DATA_DISPLAY_LAYOUT: 'data_display_layout',
  // 子级
  SUMMARY: 'summary',
  COMPARISON: 'comparison',
  HEATMAP: 'heatmap',
  BUILDING: 'building',
  CUSTOM_AREA: 'custom_area',
  // 其他主导航项
  DATA_IN: 'data_in',
  DATA_PROCESS: 'data_process',
  TOPIC_DISPLAY: 'topic_display',
  MAINTENANCE: 'maintenance',
};

const routes = [
  {
    path: '/',
    // 默认重定向到数据展示下的汇总数据展示
    redirect: { name: RouteNames.SUMMARY } 
  },
  {
    path: '/data-display',
    name: RouteNames.DATA_DISPLAY_LAYOUT,
    component: DataDisplayLayout, // 容器组件，负责左侧主导航和顶部 Tab 的切换
    meta: { title: '数据展示' },
    
    // ===================================
    // 嵌套子路由
    // ===================================
    children: [
      {
        path: '', // 访问 /data-display 时，默认展示此组件
        name: RouteNames.SUMMARY,
        component: SummaryDisplay, 
        meta: { title: '汇总数据展示' },
      },
      {
        path: 'comparison',
        name: RouteNames.COMPARISON,
        // ============ 修改此处 meta.title =============
        component: ComparisonDisplay,
        meta: { title: '数据比对展示' }, 
        // ============================================
      },
      {
        path: 'heatmap',
        name: RouteNames.HEATMAP,
        component: HeatmapDisplay,
        meta: { title: '单位热力图' },
      },
      {
        path: 'building',
        name: RouteNames.BUILDING,
        component: BuildingDisplay,
        // ============ 修改此处 meta.title =============
        meta: { title: '建筑物展示' },
        // ============================================
      },
      {
        path: 'custom',
        name: RouteNames.CUSTOM_AREA,
        component: CustomAreaDisplay,
        // ============ 修改此处 meta.title =============
        meta: { title: '自定义区域汇总' },
        // ============================================
      },
    ]
  },
  // 占位路由，用于其他主导航项
  { path: '/data-in', name: RouteNames.DATA_IN, component: { template: '<div>数据入库页面</div>' } },
  { path: '/data-process', name: RouteNames.DATA_PROCESS, component: { template: '<div>数据处理页面</div>' } },
  { path: '/topic-display', name: RouteNames.TOPIC_DISPLAY, component: { template: '<div>专题展示页面</div>' } },
  { path: '/maintenance', name: RouteNames.MAINTENANCE, component: { template: '<div>运维管理页面</div>' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;