import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'


export default class FilterPicker extends Component {
  state = {
    value: this.props.selectedValue
  }

  render() {
    // 获取 确定/取消按钮点击事件函数
    const { hOk, hCancel, openType } = this.props
    const { value } = this.state
    return (

      <>
        {/* 选择器组件： */}
        <PickerView onChange={(value) => { this.setState({ value }) }} data={this.props.data} value={value} cols={this.props.col} />

        {/* 底部按钮 */}
        <FilterFooter hOk={() => { hOk(value, openType) }} hCancel={hCancel} />
      </>
    )
  }
}
