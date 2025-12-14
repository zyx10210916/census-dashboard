<template>
  <div class="main-content-layout">
    <aside class="left-stats-panel">
       <!-- 法人单位数量卡片 -->
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
 
      <!-- 从业人员期末人数卡片 -->
      <div class="card-header-container">
        <div class="card-header">从业人员期末人数</div>
        <div class="chart-toggle">
          <button 
            @click="activeChart = 'donut'" 
            :class="{ active: activeChart === 'donut' }"
            title="环形图"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button 
            @click="activeChart = 'bar'" 
            :class="{ active: activeChart === 'bar' }"
            title="柱状图"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <rect x="3" y="12" width="4" height="8" fill="currentColor"/>
              <rect x="10" y="8" width="4" height="12" fill="currentColor"/>
              <rect x="17" y="4" width="4" height="16" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
      <section class="stat-card personnel-card">
        <div class="flex-content">
          <!-- 左侧环形图/柱状图 -->
          <div ref="donutChartRef" class="chart-container" v-show="activeChart === 'donut'"></div>
          <div ref="barChartRef" class="chart-container" v-show="activeChart === 'bar'"></div>
          
          <!-- 右侧图例 -->
          <div class="info-block">
            <ul class="legend-list">
              <li v-for="item in personnelData" :key="item.name"    
                  @click="toggleLabel(item.name)"   
                  :title="`${item.name}`">   
                <span class="dot" :style="{ backgroundColor: item.color    }"></span> 
                {{ item.name    }}
              </li>
            </ul>
          </div>
        </div>
      </section>
 
      <!-- 主要经济指标卡片 -->
      <div class="card-header-container">
        <div class="card-header">主要经济指标</div>
        <div class="chart-toggle">
          <button 
            @click="activeChart2 = 'donut'" 
            :class="{ active: activeChart2 === 'donut' }"
            title="环形图"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button 
            @click="activeChart2 = 'bar'" 
            :class="{ active: activeChart2 === 'bar' }"
            title="柱状图"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <rect x="3" y="12" width="4" height="8" fill="currentColor"/>
              <rect x="10" y="8" width="4" height="12" fill="currentColor"/>
              <rect x="17" y="4" width="4" height="16" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
      <section class="stat-card">
        <div class="flex-content">
          <!-- 左侧环形图/柱状图 -->
          <div ref="donutChart2Ref" class="chart-container" v-show="activeChart2 === 'donut'"></div>
          <div ref="barChart2Ref" class="chart-container" v-show="activeChart2 === 'bar'"></div>
          
          <!-- 右侧图例 -->
          <div class="info-block">
            <ul class="legend-list">
              <li v-for="item in economicData" :key="item.name"    
                  @click="toggleLabel2(item.name)"   
                  :title="`${item.name}`">   
                <span class="dot" :style="{ backgroundColor: item.color    }"></span> 
                {{ item.name    }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </aside>
  </div>
</template>
 
<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, watch, nextTick } from 'vue';
 
// 图表DOM引用 
const miniChartRef = ref<HTMLElement | null>(null);
const donutChartRef = ref<HTMLElement | null>(null);
const barChartRef = ref<HTMLElement | null>(null);
const donutChart2Ref = ref<HTMLElement | null>(null);
const barChart2Ref = ref<HTMLElement | null>(null);
 
// 当前显示的图表类型
const activeChart = ref<'donut' | 'bar'>('donut');
const activeChart2 = ref<'donut' | 'bar'>('donut');
 
// 从业人员数据 
const personnelData = ref([
  { name: '大型', value: 78.5, color: '#5b8ff9' },
  { name: '中型', value: 56.2, color: '#ff8800' },
  { name: '小型', value: 35.7, color: '#5ad8a6' },
  { name: '微型', value: 18.3, color: '#f6bd16' },
  { name: '其他', value: 6.7, color: '#82b3d8' }
]);
 
const totalPersonnel = ref(195.43);
 
// 经济指标数据
const economicData = ref([
  { name: '大型', value: 32000, color: '#5b8ff9' },
  { name: '中型', value: 22000, color: '#ff8800' },
  { name: '小型', value: 12000, color: '#5ad8a6' },
  { name: '微型', value: 4000, color: '#f6bd16' },
  { name: '其他', value: 2000, color: '#82b3d8' }
]);
 
const totalEconomic = ref(72030);
 
// 获取环形图配置
const getDonutOption = (): echarts.EChartsOption => {
  return {
    color: personnelData.value.map(item  => item.color), 
    grid: {
      left: '0%',
      right: '0%',
      top: '0%',
      bottom: '0%'
    },
    series: [{
      type: 'pie',
      radius: ['70%', '100%'],
      center: ['50%', '50%'],
      data: personnelData.value.map(item  => ({
        value: item.value, 
        name: item.name 
      })),
      label: {
        show: false,
        position: 'outside',
        formatter: (params: any) => {
          return `${params.name}\n${params.value} 万人`;
        },
        fontSize: 10,
        lineHeight: 16
      },
      labelLine: {
        show: false,
        length: 10,
        length2: 5 
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2 
      }
    }],
       graphic: {
      type: 'group',
      left: 'center',
      top: 'center',
      children: [
        {
          type: 'text',
          style: {
            text: totalPersonnel.value.toFixed(2), 
            fontSize: 22,
            fontWeight: 'bold',
            fill: '#333'
          }
        },
        {
          type: 'text',
          left: 75,
          top: 5,
          style: {
            text: '万人',
            fontSize: 12,
            fill: '#666'
          }
        },
        {
          type: 'text',
          top: 30,
          left: 25,
          style: {
            text: '从业人员',
            fontSize: 12,
            fill: '#999'
          }
        }
      ]
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}万人'
    }
  };
};
 
// 获取柱状图配置 
const getBarOption = (): echarts.EChartsOption => {
  return {
    color: personnelData.value.map(item  => item.color), 
    grid: {
      left: '15%',
      right: '5%',
      top: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: personnelData.value.map(item  => item.name), 
      axisLabel: {
        interval: 0,
        fontSize: 10,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: '#666',
        formatter: '{value} 万人'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      data: personnelData.value.map(item  => item.value), 
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 10,
        formatter: '{c}万人'
      }
    }],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}万人'
    }
  };
};
 
// 获取经济指标环形图配置
const getDonutOption2 = (): echarts.EChartsOption => {
  return {
    color: economicData.value.map(item  => item.color), 
    grid: {
      left: '0%',
      right: '0%',
      top: '0%',
      bottom: '0%'
    },
    series: [{
      type: 'pie',
      radius: ['70%', '100%'],
      center: ['50%', '50%'],
      data: economicData.value.map(item  => ({
        value: item.value, 
        name: item.name 
      })),
      label: {
        show: false,
        position: 'outside',
        formatter: (params: any) => {
          return `${params.name}\n${params.value}`; 
        },
        fontSize: 10,
        lineHeight: 16
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 5 
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2 
      }
    }],
     graphic: {
      type: 'group',
      left: 'center',
      top: 'center',
      children: [
        {
          type: 'text',
          style: {
            text: totalEconomic.value.toLocaleString(), 
            fontSize: 22,
            fontWeight: 'bold',
            fill: '#333'
          },
          z: 100 
        },
        {
          type: 'text',
          left: 8,
          top: 30,
          style: {
            text: 'Rental car',
            fontSize: 12,
            fill: '#999'
          },
          z: 100 
        }
      ]
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    }
  };
};
 
 
// 获取经济指标柱状图配置
const getBarOption2 = (): echarts.EChartsOption => {
  return {
    color: economicData.value.map(item  => item.color), 
    grid: {
      left: '15%',
      right: '5%',
      top: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: economicData.value.map(item  => item.name), 
      axisLabel: {
        interval: 0,
        fontSize: 10,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisTick: {
        alignWithLabel: true 
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      data: economicData.value.map(item  => item.value), 
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 10 
      }
    }],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    }
  };
};
 
// 初始化图表 
const initChart = (chartRef: HTMLElement, option: echarts.EChartsOption) => {
  const chart = echarts.init(chartRef);  
  chart.setOption(option);  
  window.addEventListener('resize',  () => chart.resize());  
  return chart;
};
 
// 点击图例高亮对应区块 
const toggleLabel = (name: string) => {
  const index = personnelData.value.findIndex(item  => item.name  === name);
  if (index >= 0 && donutChartInstance.value)  {
    donutChartInstance.value.dispatchAction({  
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: index
    });
    donutChartInstance.value.dispatchAction({  
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: index 
    });
  }
};
 
const toggleLabel2 = (name: string) => {
  const index = economicData.value.findIndex(item  => item.name  === name);
  if (index >= 0 && donutChart2Instance.value)  {
    donutChart2Instance.value.dispatchAction({  
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: index
    });
    donutChart2Instance.value.dispatchAction({  
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: index 
    });
  }
};
 
// 图表实例 
const donutChartInstance = ref<echarts.ECharts | null>(null);
const barChartInstance = ref<echarts.ECharts | null>(null);
const donutChart2Instance = ref<echarts.ECharts | null>(null);
const barChart2Instance = ref<echarts.ECharts | null>(null);
 
onMounted(() => {
  // 1. 法人单位数量 - 迷你折线图 
// 修改后的迷你曲线配置
initChart(miniChartRef.value!,  {
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  xAxis: {
    type: 'category',
    show: false,
    boundaryGap: false,
    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] // 匹配数据点数量
  },
  yAxis: {
    type: 'value',
    show: false,
    min: 0,
    max: 50
  },
  series: [{
    type: 'line',
    data: [20, 15, 5, 25, 30, 35, 30, 25, 20, 15,25], // 更合理的数据波动 
    smooth: true, // 关键点1：设为true或0.8以上值 
    symbol: 'none', // 关键点2：隐藏数据点标记 
    lineStyle: {
      color: '#ffffff',
      width: 3,
      shadowColor: 'rgba(255,255,255,0.8)',
      shadowBlur: 12,
      shadowOffsetY: 8 
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0,  0, 0, 1, [
        { offset: 0, color: 'rgba(255,255,255,0.5)' },
        { offset: 1, color: 'rgba(255,255,255,0.01)' }
      ])
    },
    animation: true
  }]
});
 
  // 初始化所有图表实例但不销毁 
  donutChartInstance.value  = echarts.init(donutChartRef.value!); 
  barChartInstance.value  = echarts.init(barChartRef.value!); 
  donutChart2Instance.value  = echarts.init(donutChart2Ref.value!); 
  barChart2Instance.value  = echarts.init(barChart2Ref.value!); 
 
  // 设置初始图表配置
  donutChartInstance.value.setOption(getDonutOption()); 
  barChartInstance.value.setOption(getBarOption()); 
  donutChart2Instance.value.setOption(getDonutOption2()); 
  barChart2Instance.value.setOption(getBarOption2()); 
 
  // 添加图表事件监听
  setupChartEvents();
});
 
// 设置图表事件 
const setupChartEvents = () => {
  // 从业人员图表事件 
  if (donutChartInstance.value)  {
    donutChartInstance.value.on('click',  (params) => {
      donutChartInstance.value?.dispatchAction({ 
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex  
      });
      donutChartInstance.value?.dispatchAction({ 
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: params.dataIndex  
      });
    });
  }
 
  // 经济指标图表事件 
  if (donutChart2Instance.value)  {
    donutChart2Instance.value.on('click',  (params) => {
      donutChart2Instance.value?.dispatchAction({ 
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex 
      });
      donutChart2Instance.value?.dispatchAction({ 
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: params.dataIndex  
      });
    });
  }
};
 
// 监听图表切换 
watch(activeChart, (newVal) => {
  nextTick(() => {
    if (newVal === 'donut') {
      // 完全销毁并重新初始化 
      donutChartInstance.value?.dispose(); 
      donutChartInstance.value  = echarts.init(donutChartRef.value!); 
      donutChartInstance.value.setOption(getDonutOption()); 
      setupChartEvents();
    } else {
      barChartInstance.value?.dispose(); 
      barChartInstance.value  = echarts.init(barChartRef.value!); 
      barChartInstance.value.setOption(getBarOption()); 
    }
  });
});

watch(activeChart2, (newVal) => {
  nextTick(() => {
    if (newVal === 'donut') {
      // 完全销毁并重新初始化环形图 
      donutChart2Instance.value?.dispose(); 
      donutChart2Instance.value  = echarts.init(donutChart2Ref.value!); 
      donutChart2Instance.value.setOption(getDonutOption2()); 
      setupChartEvents(); 
    } else {
      barChart2Instance.value?.dispose();  
      barChart2Instance.value  = echarts.init(barChart2Ref.value!); 
      barChart2Instance.value.setOption(getBarOption2()); 
    }
  });
});
</script> 
 
<style scoped>
/* 主布局样式 */
.main-content-layout {
  display: flex;
  height: 100%;
  padding: 0;
  overflow: hidden; 
}
 
/* 左侧面板样式 */
.left-stats-panel {
  width: 380px;
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
 
.panel-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
 
/* 卡片通用样式 */
.stat-card {
  margin-bottom: 60px;
  padding: 5px;
  border-radius: 8px;
  background-color: #fff;
}
 
/* 卡片头部容器 */
.card-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
 
.card-header {
  color: #1a1919;
  font-size: 16px;
  margin: 10px 0px 10px 10px; /* 增加下边距 */
}
 
/* 添加这个新样式 */
.chart-toggle-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
 
/* 调整标题间距 */
.card-header {
  margin-bottom: 8px;
} 

/* 图表切换按钮 */
.chart-toggle {
  display: flex;
  gap: 5px;
  margin-left: auto; /* 使按钮组靠右 */
}
 
.chart-toggle button {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  color: #999;
  transition: all 0.3s;
}
 
.chart-toggle button:hover {
  border-color: #1890ff;
  color: #1890ff;
}
 
.chart-toggle button.active  {
  border-color: #1890ff;
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
}
 
/* 内容区域flex布局 */
.flex-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
 
/* 图表容器 */
.chart-container {
  width: 55%;
  height: 200px; /* 增加高度 */
  min-height: 200px;
  position: relative;
}
 
/* 信息区块 */
.info-block {
  width: 45%;
  padding-left: 10px;
}
 
.mini-chart-container {
  width: 60px;
  height: 30px;
}
 
/* 法人单位卡片特殊样式 */
.corporate-count-card {
  background-color: #5b8ff9;
  border-radius: 8px;
  padding: 15px;
  color: white;
  height: 80px;
}
 
.corporate-count-content {
  display: flex;
  justify-content: space-between;
}
 
.corporate-count-label {
  font-size: 12px;
  opacity: 0.8;
}
 
.corporate-count-value {
  font-size: 24px;
  font-weight: bold;
}
 
.corporate-count-value span {
  font-size: 14px;
  font-weight: normal;
}
 
.corporate-count-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  justify-content: flex-start; /* 顶部对齐 */
  margin-top: -20px; /* 向上移动8像素 */
}
 
.three-dots {
  color: white;
  font-size: 20px;
  transform: rotate(90deg);
  opacity: 0.7;
  cursor: pointer;
  margin-right: -5px;
}
 
/* 图例列表样式 */
.legend-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
 
.legend-list li {
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  margin: 2px 0;
}
 
.legend-list li:hover {
  background-color: #f5f5f5;
}
 
/* 图例小圆点 */
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  border: 2px solid #f0f0f0;
}
</style>