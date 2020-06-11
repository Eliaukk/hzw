import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  NavBar,
  Icon,
  Toast
} from 'antd-mobile'

import HousePackage from '../../../components/HousePackage'

import styles from './index.module.css'
import { publishHouseReq } from '../../../api/rent'
import { getImgURLReq } from '../../../api/house'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: {
        name: '',
        id: ''
      },
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  // 获取线上图片
  getImgURL = async () => {
    const { tempSlides } = this.state
    // 如果有原始图片
    if (tempSlides.length) {
      let fd = new FormData()
      tempSlides.forEach((item) => fd.append('file', item.file))
      // 发送请求
      const { status, data } = await getImgURLReq(fd)
      let houseImg
      if (status === 200) {
        // houseImg = data.map(item => {
        //   return BASE_URL + item
        // })
        houseImg = data.join('|')
        console.log('转化后', houseImg);

        return houseImg
      }

    }


  }

  componentDidMount() {
    const { city } = this.props.location
    // 获取城市数据
    if (city) {
      const { communityName: name, community: id } = city
      this.setState({
        community: {
          name, id
        }
      })
    }

  }

  // 表单change事件
  hChange = (value, type) => {
    this.setState({
      [type]: value
    })
  }

  // 选中的条件
  onSelect = (SelectArray) => {
    this.setState({
      supporting: SelectArray.join('|')
    })

  }

  // 提交发布
  addHouse = async () => {

    // 判断是否有数据为空
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      title,
      supporting
    } = this.state
    if (!(community && price && size && roomType && floor && oriented && oriented && description && title)) {
      return Toast.fail('房源数据不完整！', 3)
    }

    // 获取图片地址
    const houseImg = await this.getImgURL()
    console.log(houseImg);
    const { status } = await publishHouseReq({
      community: community.id,
      price,
      size,
      roomType: roomType[0],
      floor: floor[0],
      oriented: oriented[0],
      description,
      houseImg,
      title,
      supporting,
    })
    if (status === 200) {
      Toast.success('发布成功！', 3)
      this.props.history.replace('/rent')
    }

  }

  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title
    } = this.state

    return (
      <div className={styles.root}>
        <NavBar
          className={styles.navHeader}
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={this.onCancel}
        >
          发布房源
        </NavBar>
        <List
          className={styles.header}
          renderHeader={() => '基本信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请选择小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem placeholder="请输入租金/月" extra="￥/月" onChange={(value) => { this.hChange(value, 'price') }} type="number" value={price}>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡" onChange={(value) => { this.hChange(value, 'size') }} type="number" value={size}>
            建筑面积
          </InputItem>
          {/* 户型 */}
          <Picker data={roomTypeData} onChange={(value) => { this.hChange(value, 'roomType') }} value={roomType} cols={1}>
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>
          {/* 楼层 */}
          <Picker data={floorData} onChange={(value) => { this.hChange(value, 'floor') }} value={floor} cols={1}>
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          {/* 朝向 */}
          <Picker data={orientedData} onChange={(value) => { this.hChange(value, 'oriented') }} value={oriented} cols={1}>
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>
        {/* 房屋标题 */}
        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(value) => { this.hChange(value, 'title') }}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
            onChange={(files, type, index) => { this.hChange(files, 'tempSlides') }}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackage onSelect={this.onSelect} select={true} />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >

          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(value) => { this.hChange(value, 'description') }}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
