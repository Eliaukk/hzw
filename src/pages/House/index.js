import React from 'react'
import { Toast } from 'antd-mobile'
import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'
import { getFilterHouseReq } from '../../api/house'
// 获取当前城市信息
import { getCurCityUtils } from '../../utils/index'
// 导入列表组件的样式
import 'react-virtualized/styles.css';
// 导入list组件
import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';

// 导入列表项组件
import HouseItem from './components/HouseItem/index'
import { BASE_URL } from '../../utils/axios'

import NoHouse from './components/NoHouse'


export default class HouseList extends React.Component {
  // 筛选条件
  // filters = {}
  // 获取筛选参数
  onFilters = (filters) => {
    // 将筛选条件挂载到实力上
    this.filters = filters

    // 获取房屋数据
    this.getHouseList()

  }

  state = {
    list: [],
    count: 0
  }


  async componentDidMount() {
    // 获取当前城市id
    const { value } = await getCurCityUtils()
    // 保存到实例上
    this.cityId = value

    // 调用接口获取房屋列表
    await this.getHouseList()
  }

  // 获取房屋列表
  getHouseList = async () => {
    // 发送请求获取房屋列表
    const { status, data } = await getFilterHouseReq(this.cityId, this.filters)
    console.log(data);
    // 如果请求成功
    if (status === 200) {
      // 成功提示
      if (data.count > 0) {
        Toast.success(`成功获取 ${data.count} 条房源信息`, 2);
      } else {

      }


      // 保存数据到state中
      this.setState({
        list: data.list,
        count: data.count
      })
    }

  }

  // 点击列表项之后
  hClick = (id) => {
    this.props.history.push(`/detail/${id}`)
  }

  // 渲染列表项
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    // 获取房屋列表
    const { list } = this.state
    // 如果暂无数据 使用骨架图图
    if (!list[index]) {
      return (
        <div style={style} key={key}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    const item = list[index]
    return (
      <HouseItem {...item} onClick={() => { this.hClick(item.houseCode) }} src={BASE_URL + item.houseImg} key={key} style={style}></HouseItem>
    );
  }

  // 判断判断当前项数据是否加载完成
  isRowLoaded = ({ index }) => {
    const { list } = this.state
    // 如果没有数据就返回false
    return !!list[index]
  }

  // 加载更多数据
  loadMoreRows = ({ startIndex, stopIndex }) => {

    return getFilterHouseReq(this.cityId, this.filters, startIndex, stopIndex).then((res) => {
      this.setState({
        list: [...this.state.list, ...res.data.list]
      })
    })
  }


  // 渲染房屋列表组件
  renderHouseList = () => {
    const { count } = this.state
    return (
      count > 0 ?
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          // 远程数据总条数
          rowCount={count}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  className={styles.houseList}
                  height={height}
                  rowCount={count}
                  rowHeight={130}
                  rowRenderer={this.rowRenderer}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader> : <NoHouse>暂无数据</NoHouse>
    )
  }
  render() {
    return (
      <div className={styles.root} >
        {/* 条件筛选栏 */}
        < Filter onFilters={this.onFilters} />
        {/* 渲染房屋列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}
