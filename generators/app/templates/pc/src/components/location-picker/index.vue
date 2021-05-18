<template>
  <div>
    <div ref="map" class="map">
      <iframe id="mapPage" width="100%" height="100%" frameborder="0" src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=GM5BZ-7OA3U-XV6VK-4JK2U-FAVHZ-TFFQP&referer=myapp"> </iframe>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
/**
 * 腾讯地图地址选择器
 */
export default {
  name: 'location-picker',
  data() {
    return {
      // location: null,
      // lat: null,
      // lng: null,
      // dom & objs
      // map: null,
      // label: null,
      mapData: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    getValue() {
      if (!this.mapData.poiaddress) {
        return {
          location: null,
          latitude: null,
          longitude: null,
        }
      }
      return {
        location: this.mapData.poiaddress,
        latitude: this.mapData.latlng.lat,
        longitude: this.mapData.latlng.lng,
      }
    },
    init() {
      this.mapData = {}
      window.addEventListener(
        'message',
        (event) => {
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          const loc = event.data
          if (loc && loc.module == 'locationPicker') {
            //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
            // console.log('location', loc)
            // { cityname, latlng: { lat, lng }, poiaddress, poiname }
            this.mapData = loc
          }
        },
        false
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 600px;
}
</style>
