/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  Component,
  PropTypes
} from 'react'
import ReactNative, {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Video from "react-native-video"
import Icon from 'react-native-vector-icons/Ionicons'

export default class Account extends Component {
  constructor(props) {
    super(props);
    this._pop = this._pop.bind(this)
    this._pause=this._pause.bind(this)
    this._resume=this._resume.bind(this)
    this.state = {
      data: props.data,
      rate: 1,
      muted: false,
      resizeMode: "contain",
      repeat: false,
      videoReady:false,
      paused:false
    }
  }
  // 返回上一页
  _pop() {
    this.props.navigator.pop()
  }

  _onLoadStart() {
    console.log("_onLoadStart")
  }

  _onLoad() {
    console.log("_onLoad")
  }

  _onProgress() {
    console.log("_onProgress")
  }

  _onEnd() {
    console.log("_onEnd")
  }

  _onError() {
    console.log("_onError")
  }

  _pause(){
    this.setState({paused:true})
  }

  _resume(){
    this.setState({paused:false})
  }

  render() {
    var data = this.state.data
    return (
      <View style={styles.tabContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBox} onPress={this._pop}>
            <Icon name="ios-arrow-back" style={styles.backIcon}/>
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>视频详情页</Text>
        </View>
        <View style={styles.videoBox}>
          <Video
            ref="videoPlayer"
            source={{uri:data.video}}
            style={styles.video}
            volume={3}//声音放大倍数
            paused={this.state.paused}
            repeat={this.state.repeat}
            rate={this.state.rate}//播放速度
            muted={this.state.muted}//是否静音
            resizeMode={this.state.resizeMode}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          >
          <ActivityIndicator style={{opacity:0}}/>
          </Video>
          <TouchableOpacity onPress={this._pause} style={styles.pauseBtn}>
            {this.state.paused?<Icon onPress={this._resume} name="ios-play" style={styles.resumeIcon} size={48}/>:<View></View>}
          </TouchableOpacity>
        </View>
        <ScrollView
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={true}//纵向滚动条
          style={styles.scrollView}
        >
        
        </ScrollView>
      </View>
    )
  }
}

Video.propTypes = {
  onVideoLoadStart: PropTypes.func,
  onVideoLoad: PropTypes.func,
  onVideoError: PropTypes.func,
  onVideoProgress: PropTypes.func,
  onVideoSeek: PropTypes.func,
  onVideoEnd: PropTypes.func,
}

var width = Dimensions.get("window").width

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
  videoBox: {
    width: width,
    height: 360,
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: 360,
    backgroundColor: "#000"
  },
  pauseBtn:{
    width:width,
    height:360,
    position:"absolute",
    left:0,
    top:0
  },
  resumeIcon:{
    position:"absolute",
    top:140,
    left:width/2-30,
    width:60,
    height:60,
    paddingTop:8,
    paddingLeft:22,
    backgroundColor:"transparent",
    borderColor:"#fff",
    borderWidth:1,
    borderRadius:30,
    alignSelf:"center",
    color:"#ed7b66"
  },
  header:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    width:width,
    height:64,
    paddingTop:20,
    paddingLeft:10,
    paddingRight:10,
    borderBottomWidth:1,
    borderColor:"rgba(0,0,0,.1)",
    backgroundColor:"#fff"
  },
  backBox:{
    position:"absolute",
    left:12,
    top:32,
    width:50,
    flexDirection:"row",
    alignItems:"center"
  },
  headerTitle:{
    width:width-120,
    textAlign:"center"
  },
  backIcon:{
    color:"#999",
    fontSize:20,
    marginRight:5,
  },
  backText:{
    color:"#999"
  }

});