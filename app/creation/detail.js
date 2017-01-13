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
  ScrollView,
  Image,
  ListView,
  AlertIOS,
  TextInput,
  Modal
} from 'react-native'
import Video from "react-native-video"
import Icon from 'react-native-vector-icons/Ionicons'
import config from '../common/config.js'
import request from '../common/request.js'
import Button from 'react-native-button'

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}

export default class Account extends Component {
  constructor(props) {
      super(props);
      this._pop = this._pop.bind(this)
      this._pause = this._pause.bind(this)
      this._resume = this._resume.bind(this)
      this._fetchData = this._fetchData.bind(this)
      this._hasMore = this._hasMore.bind(this)
      this._fetchMoreData = this._fetchMoreData.bind(this)
      this._renderFooter = this._renderFooter.bind(this)
      this._renderHeader = this._renderHeader.bind(this)
      this._focus = this._focus.bind(this)
      this._setModalVisible = this._setModalVisible.bind(this)
      this._closeModal = this._closeModal.bind(this)
      this._submit = this._submit.bind(this)
      var ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
      this.state = {
        data: props.data,
        rate: 1,
        muted: false,
        resizeMode: "contain",
        repeat: false,
        videoReady: false,
        paused: false,
        dataSource: ds.cloneWithRows([]), //评论数据
        isLoadingTail: false,
        modalVisable: false,
        isSending: false,
        content: ""
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

  _pause() {
    this.setState({
      paused: true
    })
  }

  _resume() {
    this.setState({
      paused: false
    })
  }

  // 获取数据
  _fetchData(page) {
      this.setState({
        isLoadingTail: true
      })
      request.get(config.api.base + config.api.comment, {
          page: page,
          creation: 123,
        })
        .then((data) => {
          if (data.success) {
            //获取数据后，放入缓存中
            var items = cachedResults.items.slice();
            items = items.concat(data.data)
            cachedResults.items = items
            cachedResults.total = data.total
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(items),
              isLoadingTail: false
            })
          }
        })
        .catch((error) => {
          this.setState({
            isLoadingTail: false,
          })
          console.error(error);
        });
    }
    // 判断是否有更多的数据
  _hasMore() {
      return cachedResults.items.length < cachedResults.total
    }
    // 快到底部时获取更多数据
  _fetchMoreData() {
    // isLoadingTail表示正在加载更多数据，此时不能再次加载数据
    if (!this._hasMore() || this.state.isLoadingTail) {
      return
    }
    var page = cachedResults.nextPage
    this._fetchData(page)
  }

  _renderFooter() {
    if (!this._hasMore() && cachedResults.total !== 0) {
      return <View style={styles.loadingMore}><Text style={styles.loadingText}>没有更多了</Text></View>
    }
    if (!this.state.isLoadingTail) {
      return <View></View>
    }
    return <ActivityIndicator style={styles.loadingMore}/>
  }

  _renderHeader() {
    var data = this.state.data
    return <View style={styles.listHeader}>
            <View style={styles.infoBox}>
              <Image style={styles.avatar} source={{uri:data.author.avatar}}/>
              <View style={styles.descBox}>
                <Text style={styles.nickname}>{data.author.nickname}</Text>
                <Text style={styles.title}>{data.title}</Text>
              </View>
            </View>
            <View style={styles.commentBox}>
              <View style={styles.commentBox}>
                <Text>评论一下</Text>
                <TextInput
                  placeholder="这里输入评论内容"
                  style={styles.content}
                  multiline={true}
                  onFocus={this._focus}
                 />
              </View>
            </View>
            <View style={styles.commentArea}>
              <Text style={styles.commentTitle}>精彩评论</Text>
            </View>

          </View>
  }

  _focus() {
    this._setModalVisible(true)
  }

  _closeModal() {
    this._setModalVisible(false)
  }

  _setModalVisible(isVisable) {
    this.setState({
      modalVisable: isVisable
    })
  }

  _submit() {
    if (!this.state.content) {
      return AlertIOS.alert("评论不能为空")
    }
    if (this.state.isSending) {
      return AlertIOS.alert("正在评论中！")
    }
    this.setState({
      isSending: true
    }, () => {
      var body = {
        creation: "123",
        content: this.state.content
      }
      var url = config.api.base + config.api.comment
      request.post(url, body)
        .then((data) => {
          console.log(data)
          if (data && data.success) {
            var items = cachedResults.items;
            items = [{
              content: this.state.content,
              replyBy: {
                nickname: "zhangyu",
                avatar: "http://dummyimage.com/640x640/420460"
              }
            }].concat(items)
            cachedResults.items = items;
            cachedResults.total += 1
            this.setState({
              content: "",
              isSending: false,
              dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
            })
            this._setModalVisible(false)
          }
        })
        .catch((e) => {
          AlertIOS.alert(e.message)
          this.setState({
            isSending: false,
          })
        })
    })
  }

  _renderRow(row) {
    return (
      <View key={row._id} row={row} style={styles.replyBox}>
        <Image style={styles.replyAvatar} source={{uri:row.replyBy.avatar}}/>
          <View style={styles.reply}>
            <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
            <Text style={styles.replyContent}>{row.content}</Text>
          </View>
      </View>
    )
  }

  componentDidMount() {
    this._fetchData()
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
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            onEndReached={this._fetchMoreData}
            onEndReachedThreshold={20}
            renderFooter={this._renderFooter}//listview底部
            renderHeader={this._renderHeader}//listview头部
            style={styles.scrollView}
          />
          <Modal
            animated={"fade"}
            visible={this.state.modalVisable}
          >
            <View style={styles.modalContainer}>
              <Icon onPress={this._closeModal} name="ios-close-outline" style={styles.closeIcon}/>
              <View style={styles.commentBox}>
                <Text>评论一下</Text>
                <TextInput
                  placeholder="这里输入评论内容"
                  style={styles.content}
                  multiline={true}
                  defaultValue={this.state.content}
                  onChangeText={(text)=>{
                    this.setState({content:text})
                  }}
                 />
              </View>
              <Button style={styles.submitBtn} onPress={this._submit}>评论</Button>
            </View>
          </Modal>
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
    height: width * .56,
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: width * .56,
    backgroundColor: "#000"
  },
  pauseBtn: {
    width: width,
    height: 360,
    position: "absolute",
    left: 0,
    top: 0
  },
  resumeIcon: {
    position: "absolute",
    top: 75,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: "center",
    color: "#ed7b66"
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,.1)",
    backgroundColor: "#fff"
  },
  backBox: {
    position: "absolute",
    left: 12,
    top: 32,
    width: 50,
    flexDirection: "row",
    alignItems: "center"
  },
  headerTitle: {
    width: width - 120,
    textAlign: "center"
  },
  backIcon: {
    color: "#999",
    fontSize: 20,
    marginRight: 5,
  },
  backText: {
    color: "#999"
  },
  infoBox: {
    width: width,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },
  descBox: {
    flex: 1
  },
  nickname: {
    fontSize: 18,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: "#666"
  },
  replyBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20,
  },
  replyNickname: {
    color: "#666"
  },
  replyContent: {
    marginTop: 4,
    color: "#666"
  },
  reply: {
    flex: 1
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: "#777",
    textAlign: "center"
  },
  listHeader: {
    marginTop: 10,
    width: width
  },
  commentBox: {
    marginTop: 10,
    padding: 5,
  },
  content: {
    padding: 5,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    fontSize: 14,
    height: 80,
  },
  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: "#fff",
  },
  closeIcon: {
    alignSelf: "center",
    fontSize: 30,
    color: "#ee753c"
  },
  submitBtn: {
    width: width - 20,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ee753c",
    borderRadius: 5,
    color: "#ee753c",
    fontSize: 18,
    marginLeft: 10
  }

});