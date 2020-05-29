import React from 'react'
// 导入ant组件
import { Carousel, Flex, Grid, WingBlank, SearchBar } from 'antd-mobile';
// 导入样式
import './index.scss'
import navbarList from '../../utils/navbarList'
// 导入发送请求方法
import { getSwiperaReq, getGroupReq, getNewsList } from '../../api/home'
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
    group: [],
    // 资讯列表
    news: []

  }



  componentDidMount() {
    this.renderAll()
  }


  async  renderAll() {
    // 执行首页三个异步请求
    const [Swiper, Group, News] = await Promise.all([getSwiperaReq(), getGroupReq(), getNewsList()])
    if (Swiper.status === 200) {
      // 更新state数据
      this.setState({
        data: Swiper.data,
        group: Group.data,
        news: News.data
      }, () => {
        // 打开自动播放
        this.setState({
          autoplay: true
        })
      })
    }
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

  //资讯组件
  renderNews() {
    return (
      this.state.news.map(item => {
        return (
          <div className="news-item" key={item.id}>
            <div className="imgWrap">
              <img alt="" className="img" src={BASE_URL + item.imgSrc}></img>
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        )
      })
    )
  }

  // 租房小组
  renderGroup() {
    return (
      <>
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>
        {/* 内容 */}
        <Grid
          data={this.state.group}
          columnNum={2}
          hasLine={false}
          square={false}
          onClick={() => {
            this.props.history.push('/home')
          }}
          renderItem={dataItem => {
            return (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{dataItem.title}</h3>
                  <p>{dataItem.desc}</p>
                </div>
                <img alt="" src={BASE_URL + dataItem.imgSrc} />
              </Flex>
            )
          }}
        />
      </>
    )
  }

  // 顶部导航
  renderTopNav() {
    return (
      <Flex justify="around" className="topNav">
        <div className="searchBox">
          {/* 搜索框左侧按钮 */}
          <div className="city">
            北京<i className="iconfont icon-arrow"></i>
          </div>
          {/* 搜索组件 */}
          <SearchBar placeholder="请输入小区或地址"></SearchBar>
        </div>
        {/* 地图按钮 */}
        <div className="map" onClick={() => { this.props.history.push('/map') }}>
          <i className="iconfont icon-map"></i>
        </div>
      </Flex>
    )
  }

  render() {
    return (
      <div className="indexBox">
        {/* 导航栏 */}
        {this.renderTopNav()}
        {/* 轮播图 */}
        {this.renderSwiper()}

        {/* 导航栏 */}
        {this.renderNavbar()}

        {/* 租房小组 */}
        <div className="group">
          {this.renderGroup()}
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}

export default Index