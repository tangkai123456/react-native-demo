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
  TouchableOpacity,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class Account extends Component {
  constructor(props) {
    super(props)
    var user = this.props.user || {}
    this.state = {
      user: user
    }
  }
  componentDidMount() {

  }
  render() {
    var user = this.state.user
    return (
      <View style={styles.tabContent}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
        </View>
        {
          user.avatar?
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarTip}>添加狗狗头像</Text>
              <TouchableOpacity style={styles.avatarBox}>
                <Icon
                  name="ios-cloud-upload-outline"
                  style={styles.plusIcon}/>
              </TouchableOpacity>
            </View>
            :
            <View></View>
        }
      </View>
    )
  }
}
var width = Dimensions.get("window").width
var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: "#ee735c"
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  avatarContainer: {
    width: width,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee"
  },
  avatarBox: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  plusIcon: {
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    color: "#999",
    fontSize: 30,
    backgroundColor: "#fff",
    borderRadius: 8
  }
});