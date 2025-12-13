<template>
  <div class="main-content-layout">
    <aside class="left-stats-panel">
      <h3 class="panel-title">数据展示</h3>
      
      <section class="stat-card">
        <div class="card-header">法人单位数量</div>
        <div class="card-value">29.10 <span>万户</span></div>
        <div class="card-footer">
          <span class="footer-label">比同期增长率</span>
          <span class="growth-rate">+5.10%</span>
        </div>
        <div class="chart-placeholder mini-chart"></div>
      </section>

      <section class="stat-card">
        <div class="card-header">从业人员类型构成</div>
        <div class="indicator-value">195.43 <span>万人</span></div>
        <div class="chart-placeholder circle-chart">
          <p>（图表占位：环形图）</p>
        </div>
        <ul class="legend-list">
          <li><span class="dot large"></span> 大型</li>
          <li><span class="dot middle"></span> 中型</li>
          <li><span class="dot small"></span> 小型</li>
          <li><span class="dot micro"></span> 微型</li>
        </ul>
      </section>

      <section class="stat-card">
        <div class="card-header">主要经济指标</div>
        <div class="indicator-value large-indicator">72,030 <span>亿元</span></div>
        <div class="chart-placeholder bar-chart">
          <p>（图表占位：条形图）</p>
        </div>
      </section>
    </aside>

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

    <aside class="right-charts-panel">
      <section class="chart-section">
        <h4 class="chart-title">资产情况</h4>
        <div class="chart-placeholder right-bar-chart">
          <p>（图表占位：柱状图）</p>
        </div>
      </section>
      
      <section class="chart-section">
        <h4 class="chart-title">负债情况</h4>
        <div class="chart-placeholder right-bar-chart">
          <p>（图表占位：柱状图）</p>
        </div>
      </section>
      
      <section class="chart-section">
        <h4 class="chart-title">营业利润</h4>
        <div class="chart-placeholder line-chart">
          <p>（图表占位：折线图）</p>
        </div>
      </section>
    </aside>
  </div>
</template>

<script setup lang="ts">
// 你的组件逻辑
</script>

<style scoped>
/* --- 主内容布局样式：三栏 Flexbox --- */
.main-content-layout {
  display: flex;
  height: 100%; /* 占据 DataDisplayLayout 的剩余高度 */
  gap: 10px;
  padding: 0;
  overflow: hidden; 
}

/* --- 1. 左侧统计面板样式 --- */
.left-stats-panel {
  width: 280px;
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-y: auto; /* 允许内部滚动 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.panel-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.stat-card {
  margin-bottom: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #e8e8e8;
}

.card-header {
  color: #999;
  font-size: 14px;
  margin-bottom: 5px;
}

.card-value {
  font-size: 30px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 5px;
}

.card-value span {
  font-size: 16px;
  font-weight: normal;
  margin-left: 5px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.growth-rate {
  color: #52c41a; 
}

.indicator-value {
  font-size: 24px;
  font-weight: bold;
  color: #faad14; 
  margin-bottom: 10px;
}
.large-indicator {
    font-size: 30px;
}

/* 图表占位符通用样式 */
.chart-placeholder {
  height: 100px;
  background-color: #f6f6f6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #aaa;
  font-size: 12px;
  margin: 10px 0;
}

.circle-chart {
  height: 150px;
}

.legend-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}
.dot.large { background-color: #5b8ff9; }
.dot.middle { background-color: #5ad8a6; }
.dot.small { background-color: #5d7092; }
.dot.micro { background-color: #f6bd16; }


/* --- 2. 中间地图区域样式 --- */
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

/* --- 3. 右侧图表区域样式 --- */
.right-charts-panel {
  width: 250px; 
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-y: auto; /* 允许内部滚动 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.chart-section {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-title {
  font-size: 16px;
  font-weight: normal;
  color: #333;
  margin-bottom: 10px;
}

.right-bar-chart {
  height: 150px; 
}

.line-chart {
  height: 200px; 
}
</style>