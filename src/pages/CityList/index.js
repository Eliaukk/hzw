import React from 'react'
import { getCurCityListReq, getHotCityReq } from '../../api/citylist'
import { NavBar, Icon, Toast } from 'antd-mobile'
import { getCurCityUtils } from '../../utils';
import './index.scss'
// 导入列表组件的样式
import 'react-virtualized/styles.css';
// 导入列表组件的样式
import { List, AutoSizer } from 'react-virtualized';
import { setAuth } from '../../utils/index'

// 城市列表页面
class CityList extends React.Component {


  state = {
    cityIndex: [],
    cityList: '',
    // 激活状态索引
    activeIndex: 0
  }

  // 获取城市列表数据
  getCurCityList = async () => {
    const { status: st, data: dt } = await getCurCityListReq(1)
    if (st === 200) {
      const { cityList, cityIndex } = this.formatCities(dt)
      // 获取热门城市
      const { data } = await getHotCityReq()
      cityList.hot = data
      cityIndex.unshift('hot')

      // 获取当前城市
      const curCity = await getCurCityUtils()
      cityList.cur = [curCity]
      cityIndex.unshift('cur')

      // 更新state数据
      this.setState({
        cityIndex,
        cityList
      })
    }
  }

  // 数据进行格式化
  formatCities = (data) => {
    // 声明对象用来保存重构后的数据
    let cityList = {}
    // 声明数组用来保存使用数据的顺序
    let cityIndex = []
    // 对数据进行重构
    data.forEach((item) => {
      // 获取首字母
      const firtLetter = item.short.slice(0, 1)
      if (cityIndex.indexOf(firtLetter) === -1) { cityIndex.push(firtLetter) }

      if (!cityList[firtLetter]) {
        // 如果未定义该属性
        cityList[firtLetter] = [item]
      } else {
        // 如果一定义该属性
        cityList[firtLetter].push(item)
      }
    })
    // 对数组进行排序
    cityIndex = Object.keys(cityList).sort()
    return { cityList, cityIndex }
  }

  // 列表行点击事件
  hClick = (item) => {
    const { label: name } = item
    const arr = ['北京', '上海', '深圳', '广州']
    if (arr.includes(name)) {
      setAuth('curCity', item)
      this.props.history.goBack()
    } else {
      Toast.fail('该城市暂未开放！', 1);
    }
  }

  // 渲染列表行
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    // 获取城市索引  城市数据
    const { cityIndex, cityList } = this.state
    // 获取标题
    const title = cityIndex[index]
    // 获取当前城市数组
    const CurCity = cityList[title]
    return (

      <div key={key} style={style} className="city-item">
        <div className="title">{this.filter(title)}</div>
        {CurCity.map(item => {
          return (
            <div className="name" onClick={() => { this.hClick(item) }} key={item.value}>{item.label}</div>
          )
        })
        }
      </div >
    );
  }

  // 动态计算列表行高
  computedHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state
    const key = cityIndex[index]
    return 36 + cityList[key].length * 50
  }

  componentDidMount() {
    this.getCurCityList()
  }

  // 对城市标题数据进行处理
  filter(title, flag) {
    switch (title) {
      case 'cur': return flag ? '当' : '当前城市';
      case 'hot': return flag ? '热' : '热门城市';
      default: return title.toUpperCase()
    }
  }

  // 渲染城市索引
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    // 如果有数据
    if (cityIndex.length) {
      return (
        cityIndex.map((item, i) => {
          return (
            <li key={item} className="city_item" onClick={() => {
              this.listRef.scrollToRow(i)
              this.setState({
                activeIndex: i
              })
            }}>
              <span className={activeIndex === i ? 'active' : ''}>{this.filter(item, true)}</span>
            </li>)
        })
      )
    }
  }

  render() {
    return (
      <div className="cityListBox">
        <NavBar
          icon={<Icon type="left" />}
          mode="dark"
          onLeftClick={() => this.props.history.goBack()}
        >城市列表</NavBar>
        <AutoSizer >{({ height, width }) => (
          <List
            ref={(ele) => { this.listRef = ele }}
            className="listBox"
            scrollToAlignment='start'
            onRowsRendered={({ startIndex }) => {
              const { activeIndex } = this.state
              if (startIndex !== activeIndex)
                this.setState({
                  activeIndex: startIndex
                })
            }}
            height={height}
            rowCount={this.state.cityIndex.length}
            rowHeight={this.computedHeight}
            rowRenderer={this.rowRenderer}
            width={width}
          />
        )}</AutoSizer>
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }

}

export default CityList