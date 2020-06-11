import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal } from 'antd-mobile'

import { BASE_URL } from '../../utils/axios'
import { getAuth, setAuth, delAuth } from '../../utils/index'
import { getAuthInfoReq } from '../../api/profile'

import styles from './index.module.css'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'


export default class Profile extends Component {
  state = {
    // 登陆状态
    isLogin: false,
    // 用户信息
    userInfo: getAuth('info') || {}
  }
  async componentDidMount() {
    // 获取用户登录状态
    const token = getAuth('token')
    if (token) {
      // 如果用户登录，就获取用户信息
      const userInfo = getAuth('userInfo')
      if (userInfo) {
        // 如果本地有用户信息
        this.setState({
          userInfo,
          isLogin: true
        })
      } else {
        // 没有用户信息
        this.getUserInfo()
      }

    }

  }

  // 获取用户信息
  getUserInfo = async () => {
    const { status, data: { avatar, gender, nickname } } = await getAuthInfoReq()
    if (status === 200) {
      this.setState({
        // 更新数据
        userInfo: { avatar, gender, nickname },
        // 更新登录状态
        isLogin: true
      })
      // 将数据进行本地持久化
      setAuth('info', { avatar, gender, nickname })
    }
  }
  // 退出操作
  logout = () => {
    Modal.alert('温馨提示', '您确定要退出么', [{ text: '取消' }, {
      text: '确定', onPress: () => {
        // 清除token
        delAuth('token')
        delAuth('info')
        this.setState({
          isLogin: false,
          userInfo: {}
        })
      }
    }])

  }
  // 根据登录状态渲染模板
  renderIsLogin = (history) => {
    // 获取登录状态、头像、性别、昵称
    const { isLogin, userInfo: { avatar, gender, nickname } } = this.state
    return (
      <>
        <div className={styles.name}>{isLogin ? nickname : '游客'}</div>
        {/* 登录后展示： */}
        {
          isLogin && <>
            <div className={styles.auth} >
              <span onClick={this.logout} >退出</span>
            </div>
            <div className={styles.edit} onClick={
              () => { }
            }>
              编辑个人资料
                <span className={styles.arrow}>
                <i className="iconfont icon-arrow" />
              </span>
            </div>

          </>
        }
        {/* 未登录展示： */}
        {
          isLogin || <>
            <div className={styles.edit} >
              <Button
                type="primary"
                size="small"
                inline
                onClick={() => history.replace({ pathname: '/login', backURL: this.props.location.pathname })}
              >
                去登录
              </Button>
            </div >
          </>
        }
      </>
    )
  }

  render() {
    const { history } = this.props

    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className={styles.user}>
              {this.renderIsLogin(history)}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
