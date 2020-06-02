import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle(props) {

  // 渲染筛选器标题
  const renderTitle = () => {
    return (
      titleList.map((item, index) => {
        return (<Flex.Item key={index} onClick={() => { props.hTitleClick(item.type) }}>
          {/* 选中类名： selected 如果状态为true就添加类*/}
          <span className={[styles.dropdown, props.titleSelectStatus[item.type] ? styles.selected : ''].join(' ')}>
            <span>{item.title}</span>
            <i className="iconfont icon-arrow" />
          </span>
        </Flex.Item>)
      })
    )
  }

  return (
    <Flex align="center" className={styles.root}>
      {/* 渲染标题 */}
      {renderTitle()}
    </Flex>
  )
}
