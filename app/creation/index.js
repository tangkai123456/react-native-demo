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
  RefreshControl
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import request from '../common/request.js'
import config from '../common/config.js'
import Item from './items.js'
import Detail from './detail.js'

var width = Dimensions.get("window").width
  //缓存数据
var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}

export default class List extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoadingTail: false,
      isRefreshing: false
    }
    this._fetchMoreData = this._fetchMoreData.bind(this)
    this._renderFooter = this._renderFooter.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this._loadPage = this._loadPage.bind(this)
    this._renderRow = this._renderRow.bind(this)
  }
  _renderRow(row) {
      return (
        <Item key={row._id} row={row} onSelect={()=>{this._loadPage(row)}}/>
      )
    }
    // 获取数据
  _fetchData(page) {
      if (page !== 0) {
        this.setState({
          isLoadingTail: true
        })
      } else {
        this.setState({
          isRefreshing: true
        })
      }
      request.get(config.api.base + config.api.creations, {
          page: page
        })
        .then((data) => {
          if (data.success) {
            //获取数据后，放入缓存中
            var items = cachedResults.items.slice();
            if (page !== 0) {
              items = items.concat(data.data)
            } else {
              items = data.data.concat(items)
            }
            cachedResults.items = items
            cachedResults.total = data.total
            if (page !== 0) {
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items),
                isLoadingTail: false
              })
            } else {
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items),
                isRefreshing: false
              })
            }
          }
        })
        .catch((error) => {
          this.setState({
            isLoadingTail: false,
            isRefreshing: false
          })
          console.error(error);
        });
    }
    // 判断是否有更多的数据
  _hasMore() {
      return cachedResults.items.length !== cachedResults.total
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

  _onRefresh() {
    if (!this.state.isRefreshing && this._hasMore()) {
      this._fetchData(0)
    }
  }

  _loadPage(data) {
    this.props.navigator.push({
      name: "detail",
      component: Detail,
      params: {
        data: data
      }
    })
  }

  componentDidMount() {
    this._fetchData();
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>列表页面</Text>
          </View>
          <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          renderFooter={this._renderFooter}
          refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor="#f06"
            title="拼命加载中"
            progressBackgroundColor="#ffff00"
            />
          }
          />
        </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5fcff"
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: "#ee735c"
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: "#777",
    textAlign: "center"
  }
});