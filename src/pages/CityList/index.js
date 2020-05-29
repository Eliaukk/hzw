import React from 'react'
import { getCurCityListReq } from '../../api/citylist'
import { NavBar, Icon } from 'antd-mobile'
// 城市列表页面
class CityList extends React.Component {

  state = {

  }

  // 获取城市列表数据
  async getCurCityList() {
    const res = await getCurCityListReq(1)
    console.log(res);
    // 声明对象用来保存重构后的数据
    let newData = {}
    // 声明数组用来保存使用数据的顺序
    let arr = []
    // 对数据进行重构
    for (let k of res.data) {
      // 获取到数据的key

      const key = k.short.slice(0, 1)

      // 如果arr中没有该字母就添加进去
      if (arr.indexOf(key) === -1) { arr.push(key) }

      if (!newData[key]) {
        // 如果未定义该属性
        newData[key] = [k]
      } else {
        // 如果一定义该属性
        newData[key].push(k)
      }
    }

    arr.sort()
  }

  componentDidMount() {
    this.getCurCityList()
  }

  render() {
    return (
      <div className="cityListBox">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
        >城市选择</NavBar>
      </div>
    )
  }

}

export default CityList