import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'


// 标题初始选择状态
const titleSelectStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

export default class Filter extends Component {

  // 定义状态数据
  state = {
    titleSelectStatus: { ...titleSelectStatus },
    openType: ''
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
  hOk = () => {
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
          {this.isShowPicker() ? <FilterPicker opentype={openType} hOk={this.hOk} hCancel={this.hCancel} /> : null}


          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
