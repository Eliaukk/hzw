import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  // 获取选择数据记录
  state = {
    data: [...this.props.selectedValue]
  }

  isShow = (value) => {

    const index = this.state.data.indexOf(value)
    if (index === -1) {
      return ''
    }
    return styles.tagActive
  }

  hMoreSelectedValue = (value) => {

    let newSelectedValue = [...this.state.data]
    // 判断筛选条件中  有没有该条件
    const index = newSelectedValue.indexOf(value)

    if (index === -1) {
      // 如果没有就添加到筛选条件中
      newSelectedValue.push(value)
    } else {
      // 如果筛选条件中存在,就删除
      newSelectedValue.splice(index, 1)
    }

    // 更新more筛选器的条件
    this.setState({
      data: newSelectedValue
    })
  }


  // 渲染标签
  renderFilters(key, data) {
    // 高亮类名： styles.tagActive

    return (
      data.map(item => {
        let cut = item.label
        return (
          <span key={item.value} onClick={() => { this.hMoreSelectedValue(cut) }} className={[styles.tag, this.isShow(cut)].join(' ')}>{cut}</span>
        )
      })
    )
  }

  render() {
    const { characteristic, floor, oriented, roomType } = this.props.data
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={this.props.hCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters('roomType', roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters('oriented', oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters('floor', floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters('characteristic', characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter hOk={this.props.hOk} data={this.state.data} hCancel={this.props.hOk} className={styles.footer} />
      </div>
    )
  }
}
