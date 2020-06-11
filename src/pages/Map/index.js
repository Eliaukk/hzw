import React from 'react'
// 引入样式
import style from './index.module.css'

// 引入组件
import { NavBar, Icon } from 'antd-mobile'
import { getCurCityUtils } from '../../utils/index';
import { getHouseDataReq } from '../../api/citylist';
import { getFilterHouseReq } from '../../api/house'
import HouseItem from '../House/components/HouseItem'
import { BASE_URL } from '../../utils/axios'
class Map extends React.Component {
  state = {
    list: [],
    // 控制弹出框的显示
    isShowList: false
  }

  componentDidMount() {
    this.initMap()
  }

  // 根据当前缩放级别 确定下次覆盖物的形状，缩放比例
  getOverlayType = () => {
    // 获取当前缩放级别
    const scaleLevel = this.$map.getZoom()
    console.log('当前缩放级别', scaleLevel);
    if (scaleLevel >= 10 && scaleLevel < 12) {
      // 如果处于行政区级别  绘制圆形覆盖物
      return { level: 13, type: 1 }
    } else if (scaleLevel >= 12 && scaleLevel < 14) {
      // 如果处于镇范围 绘制圆形覆盖物
      return { level: 15, type: 1 }
    } else {
      // 小区范围 绘制方形覆盖物
      return { type: 2 }
    }
  }

  // 渲染覆盖物
  renderOverlay = async (cityid, point) => {
    // 确定要绘制的覆盖物类型
    const { type } = this.getOverlayType()

    // 掉接口获取数据
    const { status, data } = await getHouseDataReq(cityid)
    if (status === 200) {
      // 遍历数组生成覆盖物
      data.forEach((item) => {
        // 根据类型 和数据渲染覆盖物
        this.createOverlay(type, item)
      });
    }
  }

  // 平移盒子当屏幕中心
  moveCenter = (e) => {
    const { clientX, clientY } = e.changedTouches[0]
    // 将当前点击的盒子平移到屏幕中心
    const X = window.innerWidth / 2 - clientX
    const Y = (window.innerHeight - 330) / 2 - clientY
    this.$map.panBy(X, Y)

  }

  // 生成覆盖物
  createOverlay = (type, item) => {
    const { BMap } = window
    // 获取坐标
    const { coord: { latitude, longitude }, label: cname, count, value } = item
    // 生成新坐标
    const ipoint = new BMap.Point(longitude, latitude);
    // 覆盖物配置对象
    const opts = {
      position: ipoint,
      offset: new BMap.Size(0, 0)
    }
    // 覆盖物初始化
    const label = new BMap.Label(null, opts)
    //  根据类型创建覆盖物 和事件处理函数
    let tpl, callback

    if (type === 1) {
      // 创建圆形覆盖物
      tpl = `
     <div class=${style.bubble}>
     <p class=${style.bubbleName}>${cname}</p>
     <p>${count}</p>
     </div>`
      //  圆形的回调
      callback = () => {
        this.hClick(ipoint, value)
      }
    } else {
      // 创建方形覆盖物
      tpl = `
       <div class=${style.square}>
        <span >${cname}</span>
        <span class=${style.squareItem}>${count}套</span>
        <i></i>
       </div>`
      console.log('方形', cname, value);
      //  方形回调
      callback = (e) => {
        // 平移盒子
        this.moveCenter(e)

        console.log(e, value);
        getFilterHouseReq(value).then(res => {
          const { data: { list } } = res
          this.setState({
            list,
            isShowList: true
          })

        })


      }
    }
    // 设置覆盖物内容
    label.setContent(tpl)
    // 清除覆盖物边框
    label.setStyle({ border: 0 })
    // 添加点击事件
    label.addEventListener('click', callback)
    // 添加覆盖物
    this.$map.addOverlay(label)
  }

  // 渲染小区下房屋列表
  renderHouseList = () => {
    return (
      <div
        className={[
          style.houseList,
          this.state.isShowList ? style.show : ''
        ].join(' ')}
      >
        <div className={style.titleWrap}>
          <h1 className={style.listTitle}>房屋列表</h1>
          <a className={style.titleMore} href="/home/house">
            更多房源
          </a>
        </div>

        <div className={style.houseItems}>
          {/* 房屋结构 */}
          {
            this.state.list.map(item => (
              <HouseItem
                onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
                key={item.houseCode}
                src={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
              ></HouseItem>
            ))
          }
        </div>
      </div>
    )
  }

  // 点击事件触发
  hClick = async (point, id, type) => {

    // 确定绘制图形的比例
    const { level } = this.getOverlayType()
    // 控制地图缩放级别
    console.log('新缩放级别', level);
    if (level) { this.$map.centerAndZoom(point, level); }
    let time = setTimeout(() => {
      clearTimeout(time)
      // 清除所有覆盖物
      this.$map.clearOverlays();
    });
    // 生成新覆盖物
    this.renderOverlay(id)
  }

  // 初始化地图
  initMap = async () => {
    const { BMap } = window
    // 创建map实例
    this.$map = new BMap.Map('container')
    // 生成初始坐标
    const point = new BMap.Point(116.404, 39.915);
    // 地图初始化
    this.$map.centerAndZoom(point, 15);
    // 添加移动事件，地图移动时隐藏房屋列表
    this.$map.addEventListener('movestart', () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
    // 获取当前城市
    const { label, value } = await getCurCityUtils()
    // 将城市ID挂载到this上
    this.$value = value
    // 创建地址解析器实例     
    const myGeo = new BMap.Geocoder();

    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(null, async (point) => {
      if (point) {
        // 控制地图缩放级别
        this.$map.centerAndZoom(point, 11);
        // 添加所需控件
        this.$map.addControl(new BMap.ScaleControl());
        this.$map.addControl(new BMap.NavigationControl());
        // 渲染覆盖物
        this.renderOverlay(value, point)
      }
    },
      label);

    return this.$map
  }

  render() {

    return (
      <div className={style.mapBox}>
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log(this.props.history.goBack())}
        >地图</NavBar>
        <div id="container"></div>
        {this.renderHouseList()}
      </div>
    )
  }
}

export default Map