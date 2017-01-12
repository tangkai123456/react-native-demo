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
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import request from '../common/request.js'
import config from '../common/config.js'

export default class Item extends Component {
  constructor(props) {
    super(props)
    this.state = {
      row: props.row,
      up: false
    }
    this._up = this._up.bind(this)
  }

  _up() {
    var up = !this.state.up
    var id = this.state.row._id
    var url = config.api.base + config.api.up
    var body = {
      id: id,
      up: up ? "yes" : "no",
    }
    request.post(url, body)
      .then(data => {
        if (data && data.success) {
          this.setState({
            up: up
          })
        } else {
          AlertIOS.alert("点赞失败")
        }
      })
      .catch(e => {
        AlertIOS.alert(e.message)
      })
  }
  render() {
    var row = this.state.row;
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
          <View style={styles.item}>
            <Text style={styles.title}>{row.title}</Text>
            <Image source={{uri:row.thumb}} style={styles.thumb}>
              <Icon name="ios-play" size={28} style={styles.play}/>
            </Image>
            <View style={styles.itemFooter}>
              <View style={styles.handleBox}>
                <Icon name={this.state.up?"ios-heart":"ios-heart-outline"} size={28} style={[styles.up,this.state.up?null:styles.down]} onPress={this._up}/>
                <Text onPress={this._up}>喜欢</Text>
              </View>
              <View style={styles.handleBox}>
                <Icon name="ios-chatboxes-outline" size={28} style={styles.commentIcon}/>
                <Text>评论</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
    )
  }
}
var width = Dimensions.get("window").width
var styles = StyleSheet.create({
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: "#fff"
  },
  thumb: {
    width: width,
    height: width * .56,
    resizeMode: "cover",
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: "#333"
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eee"
  },
  handleBox: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: width / 2 - 0.5
  },
  play: {
    position: "absolute",
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 23,
    color: "#eb7d66"
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: "#333"
  },
  down: {
    fontSize: 22,
    color: "#333"
  },
  up: {
    fontSize: 22,
    color: "#ed7b66"
  },
  commentIcon: {
    fontSize: 22,
    color: "#333"
  },
});