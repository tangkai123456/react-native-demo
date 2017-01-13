/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  Component
} from 'react'
import ReactNative, {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  TextInput,
  AlertIOS
} from 'react-native'
import Button from 'react-native-button'
import request from '../common/request.js'
import config from '../common/config.js'
import {
  CountDownText
} from "react-native-sk-countdown"

export default class Login extends Component {
  constructor(props) {
    super(props)
    this._submit = this._submit.bind(this)
    this._sendVerifyCode = this._sendVerifyCode.bind(this)
    this._countingDone = this._countingDone.bind(this)
    this._showVerifyCode = this._showVerifyCode.bind(this)
    this.state = {
      phoneNumber: null,
      codeSend: false,
      verifyCode: null,
      countingDone: false
    }
  }
  _submit() {
    var phoneNumber = this.state.phoneNumber
    var verifyCode = this.state.verifyCode
    if (!phoneNumber || !verifyCode) {
      return AlertIOS.alert("手机号不能为空！")
    }
    var body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    }
    var verufyURL = config.api.base + config.api.verify
    request.post(verufyURL, body)
      .then((data) => {
        if (data && data.success) {
          this.props.afterLogin(data.data)
        } else {
          AlertIOS.alert("获取验证码失败,请检查手机号是否正确1")
        }
      })
      .catch((e) => {
        AlertIOS.alert(e.message)
      })
  }
  _sendVerifyCode() {
    var phoneNumber = this.state.phoneNumber
    if (!phoneNumber) {
      return AlertIOS.alert("手机号不能为空！")
    }
    var body = {
      phoneNumber: phoneNumber
    }
    var signupURL = config.api.base + config.api.signup
    request.post(signupURL, body)
      .then((data) => {
        if (data && data.success) {
          this._showVerifyCode()
        } else {
          AlertIOS.alert("获取验证码失败,请检查手机号是否正确")
        }
      })
      .catch((e) => {
        AlertIOS.alert(e.message)
      })
  }
  _showVerifyCode() {
    this.setState({
      codeSend: true,
      loading: false,
      countingDone: false
    })
  }
  _countingDone() {
    this.setState({
      countingDone: true
    })
  }
  render() {
    return (
      <View style={styles.tabContent}>
          <View style={styles.signupBox}>
            <Text style={styles.title}>快速登录</Text>
            <TextInput
              placeholder="输入手机号"
              autoCaptialize="none"//纠正大小写
              autoCorrect={false}//不纠正对错
              keyboardType={"number-pad"}
              style={styles.inputField}
              onChangeText={(text)=>{
                this.setState({
                  phoneNumber:text
                })
              }}
            />
            {this.state.codeSend?
              <View style={styles.verifyCodeBox}>
                <TextInput
                  placeholder="输入验证码"
                  autoCaptialize="none"//纠正大小写
                  autoCorrect={false}//不纠正对错
                  keyboardType={"number-pad"}
                  style={[styles.inputField,styles.verifyInout]}
                  onChangeText={(text)=>{
                    this.setState({
                      verifyCode:text
                    })
                  }}
                />
                  {this.state.countingDone?
                    <Button
                      style={styles.countBtn}
                      onPress={this._sendVerifyCode}
                      >
                    获取验证码
                    </Button>
                    :
                    <CountDownText
                      style={styles.countBtn}
                      countType='seconds' // 计时类型：seconds / date
                      auto={false} // 自动开始
                      afterEnd={this._countingDone} // 结束回调
                      timeLeft={60} // 正向计时 时间起点为0秒
                      step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                      startText='获取验证码' // 开始的文本
                      endText='获取验证码' // 结束的文本
                      intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                    />
                  }
              </View>
              :null
            }
            {this.state.codeSend?
              <Button  style={styles.btn} onPress={this._submit}>登录</Button>
              :
              <Button style={styles.btn} onPress={this._sendVerifyCode}>获取验证码</Button>
            }
          </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9"
  },
  signupBox: {
    marginTop: 30
  },
  title: {
    marginBottom: 20,
    color: "#333",
    fontSize: 20,
    textAlign: "center"
  },
  inputField: {
    height: 40,
    padding: 10,
    color: "#666",
    backgroundColor: "#fff",
    borderRadius: 4
  },
  btn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "#ee735c",
    borderWidth: 1,
    borderRadius: 4,
    color: "#ee735c"
  },
  verifyCodeBox: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  countBtn: {
    width: 120,
    height: 40,
    padding: 10,
    marginLeft: 8,
    backgroundColor: "transparent",
    borderColor: "#ee735c",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 15,
    borderRadius: 2
  },
  verifyInout: {
    flex: 1
  }

});