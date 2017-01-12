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
  Button
} from 'react-native'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneNumber: null,
      codeSend: false
    }
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
              keyboradType={"number-pad"}
              style={styles.inputField}
              onChangeText={(text)=>{
                this.setState({
                  phoneNumber:text
                })
              }}
            />
            {this.state.codeSend?
              <Button title="登录" style={styles.btn} onPress={this._submit}>登录</Button>
              :
              <Button title="获取验证码" style={styles.btn} onPress={this._sendVerifyCode}>获取验证码</Button>
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
  }
});