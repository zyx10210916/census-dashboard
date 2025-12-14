<template>
  <aside class="right-charts-panel">
    <section class="chart-section">
      <h4 class="chart-title">资产情况</h4>
      <div class="chart-subtitle">XX: 12345</div>
      <div ref="assetChartRef" class="chart-container right-bar-chart"></div>
    </section>
    
    <section class="chart-section">
      <h4 class="chart-title">负债情况</h4>
      <div class="chart-subtitle">XX: 12345</div>
      <div ref="liabilityChartRef" class="chart-container right-bar-chart"></div>
    </section>
    
    <section class="chart-section">
      <h4 class="chart-title">营业利润</h4>
      <div class="chart-subtitle">XX: 12345</div>
      <div ref="profitChartRef" class="chart-container line-chart"></div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import type { EChartsOption } from 'echarts'; 

const assetChartRef = ref<HTMLElement | null>(null);
const liabilityChartRef = ref<HTMLElement | null>(null);
const profitChartRef = ref<HTMLElement | null>(null);

const initChart = (ref: HTMLElement | null, option: EChartsOption) => {
  if (ref) {
    const chart = echarts.init(ref); 
    chart.setOption(option); 
    window.addEventListener('resize',  () => {
      chart.resize(); 
    });
  }
};

onMounted(() => {
  // 4 & 5. 资产情况 / 负债情况 - 分组柱状图
  const rightChartData = {
    labels: ['制造业', '商业', '服务业', '贸易业'], 
    materials: [45, 30, 50, 35],
    exam: [30, 25, 40, 48],
  };
 
  const createGroupedBarOption = (data: typeof rightChartData): EChartsOption => ({
    color: ['#1890ff', '#ff0099'], 
    legend: { 
        show: true, 
        data: ['Materials', 'Exam'], 
        bottom: 0, 
        right: 'center',
        textStyle: { fontSize: 10, color: '#666' },
        itemGap: 10, 
        icon: 'rect', 
        itemWidth: 10,
        itemHeight: 10,
    },
    grid: { left: '3%', right: '3%', bottom: '20%', top: '10%', containLabel: true }, 
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
        max: 60,
        interval: 20
    },
    series: [
      { name: 'Materials', type: 'bar', data: data.materials, barGap: '20%', barCategoryGap: '35%', itemStyle: { borderRadius: [5, 5, 0, 0] } },
      { name: 'Exam', type: 'bar', data: data.exam, itemStyle: { borderRadius: [5, 5, 0, 0] } },
    ],
  });
 
  initChart(assetChartRef.value,  createGroupedBarOption(rightChartData));
  initChart(liabilityChartRef.value,  createGroupedBarOption({ ...rightChartData, materials: [20, 15, 30, 25], exam: [10, 5, 20, 30] })); 
 
  // 6. 营业利润 - 折线图 
  const profitOption: EChartsOption = {
    color: ['#409EFF', '#ff0099'],
    legend: { 
        show: true, 
        data: ['Materials', 'Exam'], 
        bottom: 0, 
        right: 'center', 
        textStyle: { fontSize: 10, color: '#666' },
        itemGap: 10, 
        icon: 'rect', 
        itemWidth: 10,
        itemHeight: 10,
    },
    grid: { left: '3%', right: '3%', bottom: '20%', top: '10%', containLabel: true }, 
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
/* --- 右侧图表区域样式 --- */
.right-charts-panel {
  width: 380px; 
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
  margin-bottom: 5px;
}

/* 右侧图表副标题 */
.chart-subtitle {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
}

/* ECharts 容器 */
.chart-container {
  width: 100%;
  display: block;
  margin: 10px 0;
}

.right-bar-chart {
  height: 150px; 
}

.line-chart {
  height: 200px; 
}
</style>