import React from 'react'
import { Route } from 'react-router-dom'
// 导入组件
import Index from '../Index'
import House from '../House'
import Profile from '../Profile'

// ant选项卡组件
import { TabBar } from 'antd-mobile';
import tabbarList from '../../utils/tabbarList'
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

  // tabbar组件
  renderTabbar = () => {
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
        tabBarPosition="bottom"
      >
        {tabbarList.map(item => {
          return (
            <TabBar.Item
              icon={<i className={`iconfont ${item.icon}`} ></i>}
              selectedIcon={<i className={`iconfont ${item.icon}`} ></i>}
              title={item.title}
              key={item.id}
              selected={this.state.selectedTab === item.path}
              onPress={() => {
                this.props.history.push(item.path)
                this.setState({
                  selectedTab: item.path,
                });
              }}
            />
          )
        })}
      </TabBar >
    )
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
          {this.renderTabbar()}
        </div>
      </div>
    );
  }
}


export default Home