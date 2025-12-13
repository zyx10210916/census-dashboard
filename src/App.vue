<template>
  <div class="full-system-container">
    <header class="app-header">
      <h1 class="system-title">
        广州市第五次全国经济普查地理信息系统
      </h1>
      <div class="user-info">
        <button class="setting-btn">⚙️</button>
        <span>Admin</span>
      </div>
    </header>

    <main class="app-main">
      <nav class="sidebar">
        <router-link :to="{ name: RouteNames.DATA_IN }" class="nav-item">数据入库</router-link>
        <router-link :to="{ name: RouteNames.DATA_PROCESS }" class="nav-item">数据处理</router-link>
        
        <router-link :to="{ name: RouteNames.DATA_DISPLAY_LAYOUT }" class="nav-item active-group">
            📊 数据展示
        </router-link>

        <router-link :to="{ name: RouteNames.TOPIC_DISPLAY }" class="nav-item">专题展示</router-link>
        <router-link :to="{ name: RouteNames.MAINTENANCE }" class="nav-item">运维管理</router-link>

      </nav>

      <section class="content-area">
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouteNames } from './router'; // 确保路径正确
</script>

<style scoped>
/* --- 顶部 Header 样式 --- */
.app-header {
  height: 60px;
  background-color: #001529; /* 深色背景 */
  color: #fff;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.system-title {
  font-size: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.setting-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  margin-right: 15px;
  cursor: pointer;
}

/* --- Main 区域布局样式 --- */
.app-main {
  display: flex;
  flex: 1; /* 占据剩余高度 */
  overflow: hidden;
}

/* --- 左侧 Sidebar 样式 --- */
.sidebar {
  width: 200px; /* 固定宽度 */
  background-color: #fff;
  padding: 10px 0;
  overflow-y: auto;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  flex-shrink: 0; /* 防止被压缩 */
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

/* 导航组标题/当前激活的主模块 */
.active-group {
    font-weight: bold;
    color: #1890ff; /* 蓝色高亮 */
    margin-top: 10px;
    border-left: 3px solid #1890ff;
    background-color: #e6f7ff;
}

/* 路由链接的激活状态 */
.nav-item.router-link-active,
.nav-item:hover {
  background-color: #e6f7ff;
  color: #1890ff;
}

/* --- 内容区样式 --- */
.content-area {
  flex: 1;
  padding: 10px;
  overflow: hidden; /* 内部滚动交给子组件 */
}
</style>