<template>
  <div id="viewDiv" style="width: 100%; height: 100vh; position: relative;">
    <!-- 底图切换控件 -->
    <ul class="mapType">
      <li v-for="item in mapList" :key="item.id" @click="handleBasemapChange(item.id)"
        :class="['item', item.className, { actived: activeBasemapId === item.id }]"
        :style="{ backgroundImage: `url(${activeBasemapId === item.id ? item.imgActive : item.imgNormal})` }">
        <span class="map-label">{{ item.name }}</span>
      </li>
    </ul>
 
    <!-- 图层控制面板 -->
    <div class="layer-tree-panel">
      <div class="panel-header">
        <h3>目录树</h3>
        <button @click="togglePanel" class="toggle-btn">{{ panelVisible ? '隐藏' : '显示' }}</button>
      </div>
      <div v-if="panelVisible" class="tree-content">
        <!-- 底图选择 -->
        <div class="tree-node tree-group">
          <label>基础地理数据</label>
        </div>
        <div v-for="item in mapList" :key="'basemap-'+item.id" class="tree-node">
          <input type="radio" :id="'basemap-'+item.id" :value="item.id" v-model="activeBasemapId" 
                 @change="handleBasemapChange(item.id)" class="tree-checkbox">
          <label :for="'basemap-'+item.id" class="tree-label">{{ item.name }}</label>
        </div>
        
        <!-- WMS图层 -->
        <div class="tree-node tree-group">
          <label>经济普查数据</label>
        </div>
        <div v-for="layer in wmsLayers" :key="layer.id" class="tree-node">
          <input type="checkbox" :id="layer.id" v-model="layer.visible" @change="updateLayerVisibility(layer)"
            class="tree-checkbox">
          <label :for="layer.id" class="tree-label">{{ layer.title }}</label>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { ref, shallowRef, onMounted, onUnmounted } from 'vue';
import { loadModules } from 'esri-loader';
 
import dtNormal from "@/assets/images/dt-1.png";
import dtActive from "@/assets/images/dt-2.png";
import yxtNormal from "@/assets/images/yxt-1.png";
import yxtActive from "@/assets/images/yxt-2.png";
 
export default {
  name: 'ArcGISWMSVersionMix',
  setup() {
    const view = shallowRef(null);
    const panelVisible = ref(true);
    const activeBasemapId = ref('street');
    const basemapInstances = {};
    const wmsLayers = ref([]);
 
    const mapList = [
      { id: 'street', name: '地图', className: 'mapType-normal', imgNormal: dtNormal, imgActive: dtActive },
      { id: 'satellite', name: '影像图', className: 'mapType-image', imgNormal: yxtNormal, imgActive: yxtActive }
    ];
 
    // WMS图层配置
    const layerConfigs = [
      // --- 1.1.1 版本图层 --- 
      {
        id: "building",
        title: "企业建筑点",
        url: "http://192.168.10.123:8089/geoserver/postgis/wms",
        name: "postgis:jianzhuwuxinxipc38",
        version: "1.1.1",
        visible: true 
      },
      {
        id: "house",
        title: "企业房屋面",
        url: "http://192.168.10.123:8089/geoserver/postgis/wms",
        name: "postgis:WJPFWMpc38",
        version: "1.1.1",
        visible: true 
      },
      // --- 1.1.0 版本图层 --- 
      // {
      //   id: "village",
      //   title: "村居界限",
      //   url: "http://192.168.10.123:8089/geoserver/dataCenterWorkspace/wms",
      //   name: "dataCenterWorkspace:WJPCSQpc38",
      //   version: "1.1.0",
      //   visible: true 
      // },
      // {
      //   id: "district",
      //   title: "区县界限",
      //   url: "http://192.168.10.123:8089/geoserver/dataCenterWorkspace/wms",
      //   name: "dataCenterWorkspace:WJPQXpc38",
      //   version: "1.1.0",
      //   visible: true 
      // },
      // {
      //   id: "town",
      //   title: "镇街界限",
      //   url: "http://192.168.10.123:8089/geoserver/dataCenterWorkspace/wms",
      //   name: "dataCenterWorkspace:WJPZJpc38",
      //   version: "1.1.0",
      //   visible: true
      // },
      // {
      //   id: "city",
      //   title: "市区边界",
      //   url: "http://192.168.10.123:8089/geoserver/dataCenterWorkspace/wms",
      //   name: "dataCenterWorkspace:WJPSJpc38",
      //   version: "1.1.0",
      //   visible: true 
      // }
    ];
 
    onMounted(async () => {
      try {
        const [Map, MapView, WMSLayer, SpatialReference, Basemap, TileLayer] = await loadModules([
          'esri/Map', 'esri/views/MapView', 'esri/layers/WMSLayer', 
          'esri/geometry/SpatialReference', 'esri/Basemap', 'esri/layers/TileLayer'
        ], {
          url: 'http://192.168.94.114/4.19/init.js',
          css: 'http://192.168.94.114/4.19/esri/themes/light/main.css'
        });
 
        // 创建底图 
        basemapInstances.street = new Basemap({
          baseLayers: [new TileLayer({ url: "http://192.168.3.140:6080/arcgis/rest/services/fw_dt/MapServer" })],
          id: "street"
        });
        
        basemapInstances.satellite = new Basemap({
          baseLayers: [new TileLayer({ url: "http://192.168.94.114/arcgis/rest/services/GZ2000_ZW_YXDT_2019/MapServer" })],
          id: "satellite"
        });
 
        // 创建WMS图层 
        const wmsLayerInstances = layerConfigs.map(config => {
          const layer = new WMSLayer({
            url: config.url,
            id: config.id,
            title: config.title,
            sublayers: [{ name: config.name }],
            visible: config.visible,
            customParameters: {
              "VERSION": config.version,
              "SRS": "EPSG:4526",
              "TRANSPARENT": "true",
              "EXCEPTIONS": "application/vnd.ogc.se_inimage"
            }
          });
          
          // 添加到响应式数组 
          wmsLayers.value.push({
            id: config.id,
            title: config.title,
            visible: config.visible,
            instance: layer
          });
          
          return layer;
        });
 
        // 创建地图 
        const map = new Map({
          basemap: basemapInstances.street,
          layers: wmsLayerInstances 
        });
 
        // 创建视图 
        view.value = new MapView({
          container: "viewDiv",
          map: map,
          spatialReference: new SpatialReference({ wkid: 4526 }),
          extent: {
            xmin: 38392997.07,
            ymin: 2495903.35,
            xmax: 38505644.28,
            ymax: 2648163.20,
            spatialReference: { wkid: 4526 }
          }
        });
 
      } catch (error) {
        console.error("Map Initialization Failed:", error);
      }
    });
 
    const handleBasemapChange = (id) => {
      if (activeBasemapId.value === id || !view.value) return;
      activeBasemapId.value = id;
      view.value.map.basemap = basemapInstances[id];
    };
 
    const updateLayerVisibility = (layer) => {
      const targetLayer = view.value?.map.findLayerById(layer.id);
      if (targetLayer) targetLayer.visible = layer.visible;
    };
 
    const togglePanel = () => { panelVisible.value = !panelVisible.value; };
    const zoomIn = () => { view.value?.goTo({ zoom: view.value.zoom + 1 }); };
    const zoomOut = () => { view.value?.goTo({ zoom: view.value.zoom - 1 }); };
 
    onUnmounted(() => view.value?.destroy());
 
    return {
      view,
      panelVisible,
      activeBasemapId,
      mapList,
      wmsLayers,
      handleBasemapChange,
      updateLayerVisibility,
      togglePanel,
      zoomIn,
      zoomOut 
    };
  }
};
</script>
 
<style lang="scss" scoped>
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100%;
  position: relative;
}
 
.mapType {
  height: 60px;
  width: 72px;
  position: absolute;
  bottom: 15%;
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
 
.tree-group {
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 5px !important;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
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
 
.toggle-btn {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
}
</style>