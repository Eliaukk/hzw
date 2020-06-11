import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'
import { getRequestionReq } from '../../../api/rent'
import { getCurCityUtils } from '../../../utils'

import styles from './index.module.css'

export default class Search extends Component {

  state = {
    // 搜索框的值
    searchTxt: '',
    // 联想建议
    tipsList: []
  }

  async componentDidMount() {
    // 获取城市ID
    const { value } = await getCurCityUtils();
    this.cityId = value;
  }

  hClick = (city) => {
    this.props.history.replace({ pathname: '/rent/add', city })
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => { this.hClick(item) }}
      >
        {item.communityName}
      </li >
    ))
  }
  // 表单change事件
  hChange = (value) => {
    // 双向数据绑定
    this.setState({
      searchTxt: value
    }, async () => {
      // 发送请求获取联想建议列表
      const { searchTxt: name } = this.state
      const { data } = await getRequestionReq({ name, id: this.cityId })
      this.setState({
        tipsList: data
      })
    })


  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onChange={(value) => { this.hChange(value) }}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
