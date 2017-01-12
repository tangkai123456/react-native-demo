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
  Navigator
} from 'react-native'
import Icon, {
  TabBarItem
} from 'react-native-vector-icons/Ionicons'

import List from './app/creation/index.js'
import Edit from './app/edit/index.js'
import Login from './app/account/login.js'



class TestApp extends Component {
  constructor(props) {
    super(props);
    // 进入页面默认首页
    this.state = {
      selectedTab: "list"
    }
  }
  render() {
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
          <Login/>
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