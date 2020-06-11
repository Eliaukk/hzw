import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, NavBar } from 'antd-mobile'

import { Link } from 'react-router-dom'

import styles from './index.module.css'

import { loginReq } from '../../api/login'

import { withFormik } from 'formik'

import { setAuth } from '../../utils/index'
import * as yup from 'yup'; // for everything
// or
import { string } from 'yup'; // for only what you need

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/



class Login extends Component {


  // 表单change事件
  hChange = (e) => {
    const key = e.target.name
    this.setState({
      [key]: e.target.value
    })
  }

  // 表单提交处理
  hSubmit = async (e) => {
    // 关闭默认行为
    e.preventDefault()
    const { password, username } = this.state
    const { body, status } = await loginReq(username, password)
    if (status === 200) {
      setAuth('token', body.token)
    }
  }



  render() {
    // 获取高阶组件传的数据
    const {
      values,
      // touched,
      errors,
      handleChange,
      handleSubmit } = this.props;

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar mode="light">
          账号登录
        </NavBar>
        <WhiteSpace size="xl" />
        {console.log(errors)
        }
        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                value={values.username}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
                onChange={handleChange}

              />
            </div>
            <div className={styles.formItem} style={{ color: 'red' }}>{errors.username}</div>

            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                value={values.password}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
                onChange={handleChange}
              />
            </div>
            <div className={styles.formItem} style={{ color: 'red' }}> {errors.password}</div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

const MyLogin = withFormik({
  // 高级组件提供state数据
  mapPropsToValues: () => ({
    username: 'test2',
    password: 'test2'
  }),

  // Custom sync validation
  validate: values => {
    const errors = {};

    if (!values.username) {
      errors.nausernameme = 'Required';
    }

    return errors;
  },
  validationSchema: yup.object().shape({
    username: yup.string().required('用户名不能为空').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线 '),
    password: yup.string().required('密码不能为空').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线 '),

  }),
  handleSubmit: async (values, { props, setValues }) => {
    const { password, username } = values
    const { status, data, description } = await loginReq(username, password)

    if (status === 200) {
      console.log('等离成功', status, description);
      // token储存本地
      setAuth('token', data)
      // 清空输入框数据
      setValues({
        password: '', username: ''
      })
      // 路由跳转


      const { backURL } = props.location
      console.log('获取路由', props.location);

      if (backURL) {
        props.history.replace(backURL)
      } else {
        props.history.push('/home')
        console.log('登录成功');

      }

    }

  },

  displayName: 'BasicForm',
})(Login);
export default MyLogin
