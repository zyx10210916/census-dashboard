<template>
  <div class="right">
    <div class="item-box" cid="ItemBox">
      <div class="head">
        资产总计，总计：{{ totalAsset.toFixed(2)  }}万元
        <div class="right"></div>
      </div>
      <div class="content">
        <div ref="assetChartRef" class="chart-container"></div>
      </div>
    </div>
    
    <div class="item-box" cid="ItemBox">
      <div class="head">
        营业利润，总计：{{ totalProfit.toFixed(2)  }}万元 
        <div class="right"></div>
      </div>
      <div class="content">
        <div ref="profitChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>
 
<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import type { EChartsOption } from 'echarts'; 
 
const assetChartRef = ref<HTMLElement | null>(null);
const profitChartRef = ref<HTMLElement | null>(null);
 
// 模拟数据用于标题展示 
const totalAsset = ref(450.50); 
const totalProfit = ref(78.25); 
 
const initChart = (ref: HTMLElement | null, option: EChartsOption) => {
  if (ref) {
    const chart = echarts.init(ref);  
    chart.setOption(option);  
    window.addEventListener('resize',   () => {
      chart.resize();  
    });
  }
};
 
onMounted(() => {
  // 1. 资产总计 - 分组柱状图
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
      itemHeight: 10 
    },
    grid: { 
      left: '3%', 
      right: '3%', 
      bottom: '20%', 
      top: '10%', 
      containLabel: true 
    }, 
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
      { 
        name: 'Materials', 
        type: 'bar', 
        data: data.materials, 
        barGap: '20%', 
        barCategoryGap: '35%', 
        itemStyle: { borderRadius: [5, 5, 0, 0] } 
      },
      { 
        name: 'Exam', 
        type: 'bar', 
        data: data.exam,  
        itemStyle: { borderRadius: [5, 5, 0, 0] } 
      },
    ],
  });
 
  initChart(assetChartRef.value,  createGroupedBarOption(rightChartData));
 
  // 2. 营业利润 - 折线图 
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
      itemHeight: 10 
    },
    grid: { 
      left: '3%', 
      right: '3%', 
      bottom: '20%', 
      top: '10%', 
      containLabel: true 
    }, 
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
        lineStyle: { color: '#409EFF', width: 2 } 
      },
      { 
        name: 'Exam', 
        type: 'line', 
        smooth: true, 
        showSymbol: false, 
        data: [50, 40, 35, 40, 50, 60, 55, 45], 
        lineStyle: { color: '#ff0099', width: 2 } 
      },
    ],
  };
  initChart(profitChartRef.value,  profitOption);
});
</script>
 
<style scoped>
.right {
  width: 380px;
  background-color: #fff;
  padding: 0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
 
.item-box {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}
 
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}
 
.content {
  flex: 1;
  padding: 0;
  position: relative;
  height: 200px;
}
 
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 150px;
}
</style>