import React from 'react'
// 引入样式
import './index.scss'
class Map extends React.Component {

  state = {

  }

  componentDidMount() {
    this.initMap()
  }
  // 初始化地图
  initMap = () => {
    const { BMap } = window
    // 创建map实例
    const map = new BMap.Map('container')
    // 生成初始坐标
    const point = new BMap.Point(116.404, 39.915);
    // 地图初始化
    map.centerAndZoom(point, 15);
    // var map = new window.BMapGL.Map("container");
    // var point = new window.BMapGL.Point(116.404, 39.915);
    // map.centerAndZoom(point, 15);
  }
  render() {

    return (
      <div className="mapBox">
        <div id="container"></div>
      </div>
    )
  }
}

export default Map