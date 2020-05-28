import React from 'react'
import { Route } from 'react-router-dom'
// 导入组件
import Index from '../Index'
import House from '../House'
import Profile from '../Profile' 

// ant选项卡组件
import { TabBar } from 'antd-mobile';

// 导入样式
import './index.css'


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**被选中的标签 */
      selectedTab: this.props.location.pathname,
    };
  }

  render() {
    return (
      <div className='home'>
        {/**二级路由配置 */}
        {/**首页组件 */}
        <Route exact path='/home' component={Index}></Route>
        {/**列表找房 */}
        <Route path='/home/house' component={House}></Route>
        {/**用户中心 */}
        <Route path='/home/profile' component={Profile}></Route>

        {/**tabBar组件 */}
        <div className='barBox'>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
        >

          <TabBar.Item
            title="主页"
            key="Life"
            icon={
              <i className="iconfont icon-ind"></i>
            }
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selected={this.state.selectedTab === '/home'}
            onPress={() => {
              this.props.history.push('/home')
              this.setState({
                selectedTab: 'blueTab',
              });
            }}
            data-seed="logId"
          />

          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="列表找房"
            key="Koubei"
            selected={this.state.selectedTab === '/home/house'}
            onPress={() => {
              this.props.history.push('/home/house')
              this.setState({
                selectedTab: 'redTab',
              });
            }}
            data-seed="logId1"
          />

          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="我的"
            key="Friend"
            selected={this.state.selectedTab === '/home/profile'}
            onPress={() => {
              this.props.history.push('/home/profile')
              this.setState({
                selectedTab: 'greenTab',
              });
            }}
          />

        </TabBar>
      </div>
      </div>
    );
  }
}


export default Home