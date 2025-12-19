<template>
  <section class="map-container">
    <div id="mapViewNode" class="map-view"></div>

    <ul class="mapType">
      <li v-for="item in mapList" :key="item.id" @click="handleBasemapChange(item.id)"
        :class="['item', item.className, { actived: activeBasemapId === item.id }]"
        :style="{ backgroundImage: `url(${activeBasemapId === item.id ? item.imgActive : item.imgNormal})` }">
        <span class="map-label">{{ item.name }}</span>
      </li>
    </ul>

    <div class="layer-tree-panel">
      <div class="panel-header">
        <h3>图层控制</h3>
        <button @click="togglePanel" class="toggle-btn">{{ panelVisible ? '隐藏' : '显示' }}</button>
      </div>
      <div v-if="panelVisible" class="tree-content">
        <div v-for="item in dynamicLayers" :key="item.id" class="tree-node">
          <input type="checkbox" :id="item.id" v-model="item.visible" @change="updateLayerVisibility(item)"
            class="tree-checkbox">
          <label :for="item.id" class="tree-label">{{ item.label }}</label>
        </div>
      </div>
    </div>

    <div class="map-toolbar">
      <button @click="zoomIn" title="放大">➕</button>
      <button @click="zoomOut" title="缩小">➖</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue';
import { loadModules } from 'esri-loader';

import dtNormal from "@/assets/images/dt-1.png";
import dtActive from "@/assets/images/dt-2.png";
import yxtNormal from "@/assets/images/yxt-1.png";
import yxtActive from "@/assets/images/yxt-2.png";

const mapView = shallowRef<any>(null);
const panelVisible = ref(true);
const activeBasemapId = ref('street');

const mapList = [
  { id: 'street', name: '地图', className: 'mapType-normal', imgNormal: dtNormal, imgActive: dtActive },
  { id: 'satellite', name: '影像图', className: 'mapType-image', imgNormal: yxtNormal, imgActive: yxtActive }
];

// 【修改点1】业务图层配置改为 WMS 结构
const dynamicLayers = ref([
  {
    id: 'building_py',
    label: '建筑点',
    visible: true,
    url: "http://10.44.58.28:8089/geoserver/workspace/wms",
    layerName: "jianzhuwuxinxipc38"
  },
  {
    id: 'house_py',
    label: '房屋面',
    visible: true,
    url: "http://10.44.58.28:8089/geoserver/workspace/wms",
    layerName: "WJPFWMpc38"
  }
]);

// 行政要素配置（保持 ArcGIS FeatureLayer，除非你也将其改为了 GeoServer）
const adminLayersConfig = [
  { id: 'cjwjx', url: 'http://192.168.3.32:6080/arcgis/rest/services/WUJINGPU/Cjwjx/MapServer/0', type: 'village', labelField: 'cjwmc' },
  { id: 'jzjx', url: 'http://192.168.3.32:6080/arcgis/rest/services/WUJINGPU/Jzjx/MapServer/0', type: 'town', labelField: 'zjdmc' },
  { id: 'qxjjx', url: 'http://192.168.3.32:6080/arcgis/rest/services/WUJINGPU/Qxjjx/MapServer/0', type: 'district', labelField: 'xzqmc' }
];

let basemapInstances: Record<string, any> = {};

onMounted(async () => {
  try {
    // 【修改点2】引入 WMSLayer 模块
    const [Map, MapView, FeatureLayer, WMSLayer, Basemap, TileLayer] = await loadModules([
      'esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/layers/WMSLayer',
      'esri/Basemap', 'esri/layers/TileLayer'
    ], {
      url: 'http://192.168.94.114/4.19/init.js',
      css: 'http://192.168.94.114/4.19/esri/themes/light/main.css'
    });

    const getLabelingInfo = (type: string, field: string) => {
      const styles: any = {
        district: { size: 16, weight: "bold", color: "#2c3e50" },
        town: { size: 13, weight: "normal", color: "#34495e" },
        village: { size: 10, weight: "normal", color: "#7f8c8d" }
      };
      const style = styles[type];
      return [{
        labelPlacement: "always-horizontal",
        labelExpressionInfo: { expression: `$feature.${field}` },
        deconflictionStrategy: "static",
        symbol: {
          type: "text", color: style.color, haloColor: "rgba(255,255,255,0.8)", haloSize: "1.5px",
          font: { size: style.size, weight: style.weight, family: "Microsoft YaHei" }
        }
      }];
    };

    const adminRenderer = {
      type: "simple",
      symbol: { type: "simple-fill", color: [0, 0, 0, 0], outline: { color: [100, 100, 100, 0.5], width: 1 } }
    };

    basemapInstances.street = new Basemap({
      baseLayers: [new TileLayer({ url: "http://192.168.3.140:6080/arcgis/rest/services/fw_dt/MapServer" })],
      id: "street"
    });
    basemapInstances.satellite = new Basemap({
      baseLayers: [new TileLayer({ url: "http://192.168.94.114/arcgis/rest/services/GZ2000_ZW_YXDT_2019/MapServer" })],
      id: "satellite"
    });

    const map = new Map({ basemap: basemapInstances.street });

    // 4. 加载行政注记 (ArcGIS FeatureLayer)
    adminLayersConfig.forEach(item => {
      map.add(new FeatureLayer({
        url: item.url, id: item.id, outFields: [item.labelField],
        labelingInfo: getLabelingInfo(item.type, item.labelField),
        labelsVisible: true, renderer: adminRenderer, opacity: 1
      }));
    });

    // 【修改点3】以 WMSLayer 加载业务数据
    dynamicLayers.value.forEach(item => {
      const wmsLayer = new WMSLayer({
        url: item.url,
        id: item.id,
        visible: item.visible,
        sublayers: [{ name: item.layerName }],
        customLayerParameters: {
          transparent: true,
          format: "image/png",
          version: '1.3.0'
        }
      });
      map.add(wmsLayer);
    });

    mapView.value = new MapView({
      container: "mapViewNode",
      map: map,
      extent: { xmin: 36314, ymin: 201844, xmax: 67097, ymax: 222369, spatialReference: { wkid: 4490 } },
      zoom: 6,
      ui: { components: [] }
    });

  } catch (error) {
    console.error("Map Initialization Failed:", error);
  }
});

const handleBasemapChange = (id: string) => {
  if (activeBasemapId.value === id || !mapView.value) return;
  activeBasemapId.value = id;
  mapView.value.map.basemap = basemapInstances[id];
};

const updateLayerVisibility = (item: any) => {
  const targetLayer = mapView.value?.map.findLayerById(item.id);
  if (targetLayer) targetLayer.visible = item.visible;
};

const togglePanel = () => { panelVisible.value = !panelVisible.value; };
const zoomIn = () => { mapView.value?.goTo({ zoom: mapView.value.zoom + 1 }); };
const zoomOut = () => { mapView.value?.goTo({ zoom: mapView.value.zoom - 1 }); };

onUnmounted(() => mapView.value?.destroy());
</script>

<style lang="scss" scoped>
/* 样式部分保持不变 */
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map-view {
  width: 100%;
  height: 100%;
}

.mapType {
  height: 60px;
  width: 72px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 100;
  padding: 0;
  margin: 0;
  list-style: none;
  transition: width 0.3s;

  .item {
    position: absolute;
    bottom: 0;
    width: 72px;
    height: 100%;
    border: 1px solid rgba(125, 125, 125, 0.8);
    border-radius: 4px;
    transition: all 0.3s;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .map-label {
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(60, 60, 60, 0.9);
      color: white;
      font-size: 12px;
      padding: 1px 6px;
      border-radius: 4px 0 0 0;
      pointer-events: none;
      transition: background 0.3s;
    }

    &.actived {
      border: 2px solid #0091ff;

      .map-label {
        background: #0091ff;
      }
    }
  }

  .mapType-image {
    right: 8px;
    z-index: 1;
  }

  .mapType-normal {
    right: 0;
    z-index: 2;
  }

  &:hover {
    width: 160px;

    .mapType-image {
      right: 78px;
    }
  }
}

.layer-tree-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 50;
  background: white;
  border-radius: 4px;
  width: 200px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
}

.tree-content {
  padding: 10px;
}

.tree-node {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
}

.tree-checkbox {
  margin-right: 8px;
}

.map-toolbar {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.map-toolbar button {
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>