import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

// 获取当前城市信息
import { getCurCityUtils } from '../../../../utils/index'
// 获取筛选数据
import { getFilterDataReq } from '../../../../api/house'

import styles from './index.module.css'


// 标题初始选择状态
const titleSelectStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

const selectedValue = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}
export default class Filter extends Component {
  // 用来保存筛选数据  传入默认值
  selectedValue = { ...selectedValue }

  // 定义状态数据
  state = {
    titleSelectStatus: { ...titleSelectStatus },
    openType: '',
    area: {}
  }
  // 修改status状态
  hTitleClick = (type) => {


    // 判断是否为前三个菜单
    if (type === 'more') {
      this.setState({
        titleSelectStatus: {
          ...titleSelectStatus
        },
        openType: type
      })
    } else {
      // 更新state标题每项选中状态
      this.setState({
        titleSelectStatus: { ...titleSelectStatus, [type]: true },
        openType: type
      })
    }

  }

  // 当前打开状态
  isShowPicker = () => {
    // 获取当前打开状态
    const { openType } = this.state
    return openType === 'area' || openType === 'mode' || openType === 'price' || null
  }

  // 点击ok按钮
  hOk = (val, openType) => {
    // 保存筛选数据
    this.selectedValue[openType] = val
    console.log(this.selectedValue);

    // 更新选中的数据

    this.setState({
      openType: ''
    })
  }

  // 点击取消按钮
  hCancel = () => {
    this.setState({
      openType: ''
    })
  }

  // 渲染筛选器
  renderPicker = (openType) => {
    // 判断是否为前三个
    if (this.isShowPicker()) {

      let data, col = 1
      const { area, subway, rentType, price } = this.filterData;
      switch (openType) {
        case 'area':
          data = [area, subway]
          col = 3;
          break;
        case 'mode':
          data = rentType
          col = 1;
          break;
        case 'price':
          data = price
          col = 1;
          break;
        default:
      }

      return (
        // selectedValue是赛选条件数据
        <FilterPicker selectedValue={this.selectedValue[openType]} openType={openType} data={data} col={col} hOk={this.hOk} hCancel={this.hCancel} />
      )
    } else {
      return null
    }

  }
  componentDidMount() {
    this.getFilterData()
  }
  // 获取筛选数据
  getFilterData = async () => {
    const { value } = await getCurCityUtils()
    const { data } = await getFilterDataReq(value)
    this.filterData = data
  }
  render() {
    const { titleSelectStatus, openType } = this.state
    return (
      <div className={styles.root}>

        {/* 前三个菜单的遮罩层 */}
        <div className={openType ? styles.mask : ''} onClick={() => { this.hCancel() }} />

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectStatus={titleSelectStatus} hTitleClick={this.hTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {this.renderPicker(openType)}


          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
