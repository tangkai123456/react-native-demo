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
  Navigator,
  AsyncStorage
} from 'react-native'
import Icon, {
  TabBarItem
} from 'react-native-vector-icons/Ionicons'

import List from './app/creation/index.js'
import Edit from './app/edit/index.js'
import Account from './app/account/index.js'
import Login from './app/account/login.js'



class TestApp extends Component {
  constructor(props) {
    super(props);
    // 进入页面默认首页
    this.state = {
      selectedTab: "list",
      logined: false,
      user: null
    }
    this._asyncLoginStatus = this._asyncLoginStatus.bind(this)
    this.afterLogin = this.afterLogin.bind(this)
  }
  _asyncLoginStatus() {
    AsyncStorage.getItem("user")
      .then((data) => {
        var user,
          newState = {}
        if (data) {
          user = JSON.parse(data)
        }
        if (user && user.accessToken) {
          newState.user = user
          newState.logined = true
        } else {
          newState.logined = false
        }
        this.setState(newState)
      })
  }
  afterLogin(user) {
    console.log(typeof user, user)
    AsyncStorage.setItem("user", JSON.stringify(user))
      .then(() => {
        this.setState({
          user: user,
          logined: true
        })
      })
  }
  componentDidMount() {
    this._asyncLoginStatus()
      //AsyncStorage.removeItem("user")
  }
  render() {
    if (!this.state.logined) {
      return <Login afterLogin={this.afterLogin}/>
    }
    return (
      <TabBarIOS
        tintColor="#ee735c">
        <TabBarItem
          iconName="ios-videocam-outline"/*图标名*/
          selectedIconName="ios-videocam"/*选中后的图标名*/
          selected={this.state.selectedTab === 'list'}/*表示是否被选中*/
          onPress={() => {//选中时触发
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <Navigator
            initialRoute={{
              name:"list",
              component:List
            }}
            configureScene={route=>(Navigator.SceneConfigs.FloatFromRight)}
            renderScene={(route,navigator)=>{
              var Component=route.component
              return <Component {...route.params} navigator={navigator}/>
            }}
          />
        </TabBarItem>
        <TabBarItem
          iconName="ios-recording-outline"
          selectedIconName="ios-recording"
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
            });
          }}>
          <Edit/>
        </TabBarItem>
        <TabBarItem
          iconName="ios-more-outline"
          selectedIconName="ios-more"
          renderAsOriginal
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
            });
          }}>
          <Account user={this.state.user}/>
        </TabBarItem>
      </TabBarIOS>
    )
  }
}

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});

AppRegistry.registerComponent('testApp', () => TestApp);