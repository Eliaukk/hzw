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

// 筛选条件数据
let selectedValue = {
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
    // 筛选器标题的激活状态
    titleSelectStatus: { ...titleSelectStatus },
    // 当前筛选器类型
    openType: ''
  }

  // 点击标题
  hTitleClick = (type) => {
    // 获取当前所有删选器的状态
    const newSeclectedStatus = this.judgeSelectedStatus()

    // 判断是否为前三个菜单
    if (type !== 'more') {
      this.setState({
        openType: type,
        titleSelectStatus: { ...newSeclectedStatus }
      })
    } else {
      // 点击最后一个筛选器  屏蔽前面三个筛选状态
      this.setState({
        titleSelectStatus: { ...titleSelectStatus, [type]: true },
        openType: type
      })
    }

  }


  // 根据筛选器中数据 判断所有筛选器标题的激活状态
  judgeSelectedStatus = () => {
    // 业务功能：
    // 1.获取所有筛选器中的条件数据
    // - 在area筛选器中,第二个条件不为空，或者第一个条件为地铁 则该标题为激活状态
    // - 在mode、price中，数据不为空则为激活状态
    // - 在more中，长度不为0则处于激活状态

    // 新的标题状态变量
    let newTitleSelectStatus = {}

    // 遍历筛选数据
    Object.keys(this.selectedValue).forEach(key => {
      // 获取当前值
      let cur = this.selectedValue[key]

      if ((key === 'area') && (cur[1] !== 'null' || cur[0] === 'subway')) {
        // area为选中状态
        newTitleSelectStatus.area = true
      } else if (key === 'mode' && cur[0] !== 'null') {
        // mode为选中状态
        newTitleSelectStatus.mode = true
      } else if (key === 'price' && cur[0] !== 'null') {
        // price为选中状态
        newTitleSelectStatus.price = true
      } else if (key === 'more' && cur.length !== 0) {
        // more为选中状态
        newTitleSelectStatus.more = true
      } else {
        // 不符合要求就关闭激活状态
        newTitleSelectStatus[key] = false
      }
    })

    // 返回新标题选中状态
    return newTitleSelectStatus
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
    // 获取新标题选中状态
    const newTitleSelectedStatus = this.judgeSelectedStatus()
    // console.log(this.selectedValue);
    // 获取筛选的条件
    const filterDate = this.getFilterParams()
    // 将筛选条件传给父组件
    this.props.onFilters(filterDate)
    // 更新选中的数据
    this.setState({
      openType: '',
      titleSelectStatus: { ...newTitleSelectedStatus }
    })
  }

  // 点击取消按钮
  hCancel = (type) => {

    this.selectedValue.more = []
    console.log('点击取消按钮', type, this.selectedValue.more);

    // 获取新标题选中状态
    const newTitleSelectedStatus = this.judgeSelectedStatus()
    console.log(newTitleSelectedStatus);
    this.setState({
      openType: '',
      titleSelectStatus: { ...newTitleSelectedStatus }
    })
  }


  // 获取筛选器参数
  getFilterParams = () => {
    // 用来保存请求参数
    let paramsData = {}
    const { area, mode, price, more } = this.selectedValue
    console.log(area, mode, price, more);
    let akey = area[0], aval;
    if (area.length === 2) {
      aval = area[1]
    } else {
      if (area[2] === 'null') {
        aval = area[1]
      } else {
        aval = area[2]
      }
    }
    // 设置area中数据
    paramsData[akey] = aval
    // 设置renType数据
    paramsData.rentType = mode[0]
    // 设置租金数据
    paramsData.price = price[0]
    paramsData.more = more.join(',')
    // 返回处理后数据
    console.log(paramsData);

    return paramsData

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
        <FilterPicker key={openType} selectedValue={this.selectedValue[openType]} openType={openType} data={data} col={col} hOk={this.hOk} hCancel={this.hCancel} />
      )
    } else {
      return null
    }

  }

  componentDidMount() {
    // 获取筛选器中的数据
    this.getFilterData()

  }


  //访问接口 获取筛选条件
  getFilterData = async () => {
    // 获取当前城市id
    const { value } = await getCurCityUtils()
    // 获取所有筛选器的数据
    const { data } = await getFilterDataReq(value)
    // 将数据挂载到实例上
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
          {openType === 'more' ? <FilterMore data={this.filterData} selectedValue={this.selectedValue.more} hOk={this.hOk} hCancel={this.hOk} /> : ''}
        </div>
      </div>
    )
  }
}
