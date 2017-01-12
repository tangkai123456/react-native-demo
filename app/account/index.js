/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React,{Component} from 'react'
import ReactNative,{AppRegistry,StyleSheet,TabBarIOS,Text,View} from 'react-native'

export default class Account extends Component{
  render(){
    return (
        <View style={styles.tabContent}>
          <Text>账户页面</Text>
        </View>
      )
  }
}

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});

