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
        <div ref="miniChartRef" class="mini-chart-container"></div>
      </section>

      <section class="stat-card">
        <div class="card-header">从业人员类型构成</div>
        <div class="indicator-value">195.43 <span>万人</span></div>
        <div ref="donutChartRef" class="chart-container circle-chart"></div>
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
        <div ref="barChartRef" class="chart-container bar-chart"></div>
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
        <div ref="assetChartRef" class="chart-container right-bar-chart"></div>
      </section>
      
      <section class="chart-section">
        <h4 class="chart-title">负债情况</h4>
        <div ref="liabilityChartRef" class="chart-container right-bar-chart"></div>
      </section>
      
      <section class="chart-section">
        <h4 class="chart-title">营业利润</h4>
        <div ref="profitChartRef" class="chart-container line-chart"></div>
      </section>
    </aside>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import type { EChartsOption } from 'echarts'; // 引入类型定义

// ECharts 容器的引用
const miniChartRef = ref<HTMLElement | null>(null);
const donutChartRef = ref<HTMLElement | null>(null);
const barChartRef = ref<HTMLElement | null>(null);
const assetChartRef = ref<HTMLElement | null>(null);
const liabilityChartRef = ref<HTMLElement | null>(null);
const profitChartRef = ref<HTMLElement | null>(null);

// 辅助函数：初始化 ECharts 实例
const initChart = (ref: HTMLElement | null, option: EChartsOption) => {
  if (ref) {
    const chart = echarts.init(ref);
    chart.setOption(option);
    
    // 自动适应窗口大小
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }
};

onMounted(() => {
  // 1. 法人单位数量 - 迷你折线图
  const miniOption: EChartsOption = {
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: [20, 30, 15, 45, 29.1], // 模拟数据
        smooth: true,
        lineStyle: { color: '#1890ff', width: 2 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(24, 144, 255, 0.5)' }, { offset: 1, color: 'rgba(24, 144, 255, 0.0)' }]) },
      },
    ],
  };
  initChart(miniChartRef.value, miniOption);

  // 2. 从业人员类型构成 - 环形图 (Donut)
  const donutData = [
    { value: 40, name: '大型' }, // 使用之前定义的颜色：#5b8ff9
    { value: 30, name: '中型' }, // #5ad8a6
    { value: 20, name: '小型' }, // #5d7092
    { value: 10, name: '微型' }, // #f6bd16
  ];
  const donutOption: EChartsOption = {
    color: ['#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16'],
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        data: donutData,
        silent: true, // 禁用交互，更像静态展示
        label: { show: false }, // 不显示标签
        labelLine: { show: false },
      },
    ],
  };
  initChart(donutChartRef.value, donutOption);

  // 3. 主要经济指标 - 条形图 (作为进度条展示)
  const barOption: EChartsOption = {
    grid: { left: 0, right: 10, top: 10, bottom: 0, containLabel: true },
    xAxis: { show: false, max: 100000 },
    yAxis: { type: 'category', data: ['总产值'], show: false },
    series: [
      {
        type: 'bar',
        barWidth: 10,
        data: [72030],
        itemStyle: {
          borderRadius: 5,
          color: '#faad14', // 橙色
        },
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(250, 173, 20, 0.2)'
        },
      },
    ],
  };
  initChart(barChartRef.value, barOption);
  
  // 4 & 5. 资产情况 / 负债情况 - 分组柱状图 (右侧面板)
  const rightChartData = {
    labels: ['制造业', '零售业', '服务业', '贸易业'],
    materials: [45, 30, 50, 35],
    exam: [30, 25, 40, 48],
  };

  const createGroupedBarOption = (data: typeof rightChartData): EChartsOption => ({
    color: ['#1890ff', '#f06292'], // 蓝色 (Materials) 和 粉色 (Exam)
    legend: { 
        show: true, 
        data: ['Materials', 'Exam'], 
        bottom: 0, 
        textStyle: { fontSize: 10 },
        itemGap: 5,
        icon: 'rect'
    },
    grid: { left: '3%', right: '4%', bottom: '20%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: data.labels, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }, axisLabel: { fontSize: 10 } },
    series: [
      { name: 'Materials', type: 'bar', data: data.materials, barGap: '5%', barCategoryGap: '30%' },
      { name: 'Exam', type: 'bar', data: data.exam },
    ],
  });

  initChart(assetChartRef.value, createGroupedBarOption(rightChartData));
  initChart(liabilityChartRef.value, createGroupedBarOption({ ...rightChartData, materials: [20, 15, 30, 25], exam: [10, 5, 20, 30] })); // 负债数据示例

  // 6. 营业利润 - 折线图
  const profitOption: EChartsOption = {
    color: ['#1890ff'],
    grid: { left: '3%', right: '4%', bottom: '5%', top: '10%', containLabel: true },
    xAxis: { 
        type: 'category', 
        data: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'], 
        axisLine: { show: true }, 
        axisTick: { show: false },
        axisLabel: { fontSize: 10 } 
    },
    yAxis: { 
        type: 'value', 
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
        axisLabel: { fontSize: 10 } 
    },
    series: [
      {
        name: '营业利润',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: [10, 20, 50, 40, 50, 60, 75, 55],
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(24, 144, 255, 0.4)' }, { offset: 1, color: 'rgba(24, 144, 255, 0.0)' }]) },
      },
    ],
  };
  initChart(profitChartRef.value, profitOption);

});
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

/* ECharts 容器通用样式 */
.chart-container {
  width: 100%;
  display: block;
  margin: 10px 0;
}

.mini-chart-container {
  height: 40px; /* 较小的迷你图高度 */
  margin-top: -15px; /* 向上微调位置 */
}

.circle-chart {
  height: 150px; 
}

.bar-chart {
    height: 100px;
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