<template>
  <div class="main-content-layout">
    <aside class="left-stats-panel">
      <h3 class="panel-title">数据展示</h3>
      
      <div class="card-header">法人单位数量</div>
      <section class="stat-card corporate-count-card">
        <div class="corporate-count-content">
          <div class="corporate-count-left">
            <div class="corporate-count-label">科学研究和技术服务业</div>
            <div class="corporate-count-value">29.10 <span>万个</span></div>
          </div>
          <div class="corporate-count-right">
            <div class="three-dots">⋮</div>
            <div ref="miniChartRef" class="mini-chart-container"></div>
          </div>
        </div>
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
import type { EChartsOption } from 'echarts'; 
 
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
    window.addEventListener('resize',  () => {
      chart.resize(); 
    });
  }
};
 
onMounted(() => {
  // 1. 法人单位数量 - 迷你折线图 
  const miniOption: EChartsOption = {
    grid: { left: -10, right: 0, top: 0, bottom: 0, containLabel: true },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: [20, 30, 15, 45, 29.1], 
        smooth: true,
        lineStyle: { color: '#ffffff', width: 2 }, // 白色线条更清晰 
        areaStyle: { 
          color: new echarts.graphic.LinearGradient(0,  0, 0, 1, [
            { offset: 0, color: 'rgba(255, 255, 255, 0.4)' },
            { offset: 1, color: 'rgba(255, 255, 255, 0.0)' }
          ])
        },
      },
    ],
  };
  initChart(miniChartRef.value,  miniOption);
 
  // 2. 从业人员类型构成 - 环形图 (Donut)
  const donutData = [
    { value: 40, name: '大型' },
    { value: 30, name: '中型' },
    { value: 20, name: '小型' },
    { value: 10, name: '微型' },
  ];
  const donutOption: EChartsOption = {
    color: ['#ff8800', '#5b8ff9', '#82b3d8', '#f6bd16'],
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['40%', '50%'],
        data: donutData,
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
            borderColor: '#fff',
            borderWidth: 0 
        },
      },
    ],
  };
  initChart(donutChartRef.value,  donutOption);
 
  // 3. 主要经济指标 - 条形图 (进度条样式)
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
          color: '#faad14',
        },
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(250, 173, 20, 0.2)'
        },
      },
    ],
  };
  initChart(barChartRef.value,  barOption);
  
  // 4 & 5. 资产情况 / 负债情况 - 分组柱状图 (右侧面板)
  const rightChartData = {
    labels: ['制造业', '商业', '服务业', '其他'],
    materials: [45, 30, 50, 35],
    exam: [30, 25, 40, 48],
  };
 
  const createGroupedBarOption = (data: typeof rightChartData): EChartsOption => ({
    color: ['#1890ff', '#ff0099'], 
    legend: { 
        show: true, 
        data: ['Materials', 'Exam'], 
        bottom: 0, 
        right: 10,
        textStyle: { fontSize: 10, color: '#333' },
        itemGap: 15,
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
    },
    grid: { left: '10%', right: '5%', bottom: '25%', top: '10%', containLabel: false },
    xAxis: { 
        type: 'category', 
        data: data.labels,  
        axisLine: { show: false }, 
        axisTick: { show: false }, 
        axisLabel: { fontSize: 10, color: '#666' } 
    },
    yAxis: { 
        type: 'value', 
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }, 
        axisLabel: { fontSize: 10, color: '#666' },
        max: 60 
    },
    series: [
      { name: 'Materials', type: 'bar', data: data.materials,  barGap: '20%', barCategoryGap: '35%', itemStyle: { borderRadius: [5, 5, 0, 0] } },
      { name: 'Exam', type: 'bar', data: data.exam,  itemStyle: { borderRadius: [5, 5, 0, 0] } },
    ],
  });
 
  initChart(assetChartRef.value,  createGroupedBarOption(rightChartData));
  initChart(liabilityChartRef.value,  createGroupedBarOption({ ...rightChartData, materials: [20, 15, 30, 25], exam: [10, 5, 20, 30] }));
 
  // 6. 营业利润 - 折线图 
  const profitOption: EChartsOption = {
    color: ['#409EFF'],
    legend: { 
        show: true, 
        data: ['Materials', 'Exam'],
        bottom: 0, 
        right: 10,
        textStyle: { fontSize: 10, color: '#333' },
        itemGap: 15, 
        icon: 'line',
        itemWidth: 15 
    },
    grid: { left: '10%', right: '5%', bottom: '25%', top: '10%', containLabel: false },
    xAxis: { 
        type: 'category', 
        data: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'], 
        axisLine: { show: true, lineStyle: { color: '#ccc' } },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, color: '#666' } 
    },
    yAxis: { 
        type: 'value', 
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
        axisLabel: { fontSize: 10, color: '#666' },
        max: 100 
    },
    series: [
      {
        name: 'Materials',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: [70, 60, 45, 50, 65, 75, 80, 70],
        lineStyle: { color: '#409EFF', width: 2 },
      },
      {
        name: 'Exam',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: [50, 40, 35, 40, 50, 60, 55, 45],
        lineStyle: { color: '#ff0099', width: 2 },
      },
    ],
  };
  initChart(profitChartRef.value,  profitOption);
});
</script>
 
<style scoped>
/* --- 主内容布局样式：三栏 Flexbox --- */
.main-content-layout {
  display: flex;
  height: 100%;
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
  overflow-y: auto;
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
 
/* 卡片标题样式 */
.card-header {
  color: #999;
  font-size: 14px;
  margin-bottom: 5px;
  margin-left: 5px;
}
 
.stat-card {
  margin-bottom: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #e8e8e8;
}
 
/* 法人单位数量卡片样式 */
.corporate-count-card {
  background-color: #1890ff;
  border-radius: 8px;
  padding: 15px;
  color: white;
  margin-bottom: 20px;
  border-bottom: none;
  margin-top: -5px; /* 上移卡片使其更接近标题 */
} 
 
.corporate-count-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
 
.corporate-count-left {
  flex: 1;
}
 
.corporate-count-label {
  font-size: 12px;
  margin-bottom: 5px;
  opacity: 0.8;
}
 
.corporate-count-value {
  font-size: 24px;
  font-weight: bold;
}
 
.corporate-count-value span {
  font-size: 14px;
  font-weight: normal;
  margin-left: 2px;
}
 
.corporate-count-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 80px;
}
 
.three-dots {
  font-size: 20px;
  margin-bottom: 5px;
  line-height: 1;
  transform: rotate(90deg);
  opacity: 0.7;
}
 
/* 调整迷你图样式 */
.mini-chart-container {
  height: 40px;
  width: 80px;
  margin-top: 0;
}
 
/* 其他卡片内容样式 */
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
  height: 40px;
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
.dot.large  { background-color: #5b8ff9; }
.dot.middle  { background-color: #5ad8a6; }
.dot.small  { background-color: #5d7092; }
.dot.micro  { background-color: #f6bd16; }
 
/* --- 2. 中间地图区域样式 --- */
.center-map-area {
  flex: 1;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
 
.map-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e6f7ff;
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
  overflow-y: auto;
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