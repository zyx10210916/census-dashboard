<template>
  <div class="full-system-container">
    <header class="app-header">
      <h1 class="system-title">
        广州市第五次全国经济普查地理信息系统
      </h1>
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

<style>
/* ... 样式保持不变，只需要确保 .nav-item.active-group 和 .router-link-active 样式能正确作用于链接 ... */
</style>