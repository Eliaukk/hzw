import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile'

import { Link } from 'react-router-dom'

// import { getUserHouses } from '../../utils/api/user'
import HouseItem from '../House/components/HouseItem'
import NoHouse from '../House/components/NoHouse'
import { getPublishListReq } from '../../api/rent'

import styles from './index.module.css'
import { BASE_URL } from '../../utils/axios'
import { getAuth } from '../../utils'


export default class Rent extends Component {
  state = {
    // 出租房屋列表
    list: []
  }

  // 获取已发布房源的列表数据
  async getHouseList() {

    // 先判断有没有token
    const { token } = getAuth('token')

    if (!token) {
      // 获取失败就 跳转到登录页面
      const { history, location: { pathname } } = this.props
      return history.replace({ pathname: '/login', backURL: pathname })
    }
    // 有token  发送请求获取发布列表
    const res = await getPublishListReq()

    const { status, data } = res
    console.log('已发布房源列表', data, status);

    // 更新数据到state
    this.setState({
      list: data
    })

  }

  componentDidMount() {
    this.getHouseList()
  }

  // 渲染列表项
  renderHouseItem() {
    const { list } = this.state
    const { history } = this.props

    // console.log(list, history)

    return list.map(item => {
      return (
        <HouseItem
          key={item.houseCode}
          onClick={() => {
            history.push(`/detail/${item.houseCode}`)
          }}
          src={BASE_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      )
    })
  }

  renderRentList() {
    console.log(this.state);

    const { list } = this.state
    const hasHouses = list.length > 0

    if (!hasHouses) {
      return (
        <NoHouse>
          您还没有房源，
          <Link to="/rent/add" className={styles.link}>
            去发布房源
          </Link>
          吧~
        </NoHouse>
      )
    }

    return <div className={styles.houses}>{this.renderHouseItem()}</div>
  }

  render() {
    const { history } = this.props

    return (
      <div className={styles.root}>
        <NavBar
          className={styles.navHeader}
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => history.go(-1)}
        >
          房屋管理
        </NavBar>
        {this.renderRentList()}
      </div>
    )
  }
}
