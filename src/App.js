import React from 'react';
// 导入路由组件
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
// 导入组件
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      {/**路由跟组件 */}
      <div className="App">
        {/**<Link to="/home">首页</Link>
        <Link to="/citylist">城市列表</Link>
        <Link to="/map">地图</Link> */}
        {/**一级路由组件 */}


        <Switch>
          {/**路由重定向到首页*/}
          <Route exact path='/' render={() => <Redirect to='/home' />}></Route>
          {/**首页*/}
          <Route path="/home" component={Home}></Route>
          {/**城市列表*/}
          <Route path="/citylist" component={CityList}></Route>
          {/**地图*/}
          <Route path="/map" component={Map}></Route>
          {/**404页面 */}
          <Route component={NotFound}></Route>
        </Switch>

      </div>
    </Router>
  );
}

export default App;
