import React from 'react'
// 导入ant组件
import { Carousel, Flex, Grid } from 'antd-mobile';
// 导入样式
import './index.css'
import navbarList from '../../utils/navbarList'
// 导入发送请求方法
import { getSwiperaReq, getGroupReq } from '../../api/home'
// 导入基准地址
import { BASE_URL } from '../../utils/axios'


class Index extends React.Component {
  state = {
    // 轮播图数据
    data: [],
    // 控制自动播放
    autoplay: false,
    // 图片高度
    imgHeight: '212',
    // 租房小组数据
    group: []
  }

  // 获取小组数据
  getGroupReq = async () => {
    const res = await getGroupReq()
    console.log(res);
    this.setState({
      group: res.body
    })
  }

  // 获取轮播图数据
  getSwiper = async () => {
    const res = await getSwiperaReq()
    // 更新state数据
    this.setState({
      data: res.data
    }, () => {
      // 更新自动播放状态
      this.setState({
        autoplay: true
      })
    })
  }

  componentDidMount() {
    // 获取轮播图
    this.getSwiper()
    // 获取渲染小组数据
    this.getGroupReq()
  }

  // 轮播图组件
  renderSwiper = () => {
    return (
      <Carousel
        autoplay={this.state.autoplay}
        infinite
      // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
      // afterChange={index => console.log('slide to', index)}
      >
        {this.state.data.map(val => (
          <a
            key={val}
            href="http://www.alipay.com"
            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
          >

            <img
              src={`${BASE_URL}${val.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 导航栏组件
  renderNavbar = () => {
    return (
      <Flex className="nav">
        {navbarList.map(item => {
          return (
            <Flex.Item
              key={item.id}
              onClick={() => { this.props.history.push(item.path) }}
            >
              <img alt="" src={item.img}></img>
              <p>{item.title}</p>
            </Flex.Item>
          )
        })
        }
      </Flex >
    )
  }

  render() {
    return (
      <div className="indexBox">
        {/* 轮播图 */}
        {this.renderSwiper()}

        {/* 导航栏 */}
        {this.renderNavbar()}

        {/* 租房小组 */}
        <div className="group">
          <Flex className="group-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
        </div>
        <Grid data={this.state.group} columnNum={3} itemStyle={{ height: '150px', background: 'rgba(0,0,0,.05)' }} />
      </div>
    );
  }
}

export default Index