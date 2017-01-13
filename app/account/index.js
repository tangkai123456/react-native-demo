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
  Dimensions,
  Image,
  AlertIOS
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-picker'
import request from "../common/request.js"
import config from "../common/config.js"
import sha1 from "sha1"
import {
  Circle
} from "react-native-progress"

var options = {
  title: '选择头像',
  cancelButtonTitle: "取消",
  takePhotoButtonTitle: "拍照",
  chooseFromLibraryButtonTitle: "从相册选择",
  quality: .75,
  allowsEditing: true,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

const CLOUDINARY = {
  'cloud_name': 'dqsiejdyj',
  'api_key': '272974814472779',
  'api_secret': 'UdjRLjfen3S95NF1YRlKycIV_t4',
  base: "http://res.cloudinary.com/dqsiejdyj",
  image: "https://api.cloudinary.com/v1_1/dqsiejdyj/image/upload",
  video: "https://api.cloudinary.com/v1_1/dqsiejdyj/video/upload",
  autio: "https://api.cloudinary.com/v1_1/dqsiejdyj/raw/upload"
}

function avatar(id, type) {
  if (id.indexOf("http") > -1) {
    return id
  }
  if (id.indexOf("data:image") > -1) {
    return id
  }
  return CLOUDINARY.base + "/" + type + "/upload/" + id
}

export default class Account extends Component {
  constructor(props) {
    super(props)
    var user = this.props.user || {}
    this.state = {
      user: user,
      avatarProgress: 0,
      avatarUploading: false
    }
    this._pickPhoto = this._pickPhoto.bind(this)
    this._upload = this._upload.bind(this)
    this._asyncUser = this._asyncUser.bind(this)
  }

  _pickPhoto() {
    ImagePicker.showImagePicker(options, (res) => {
      //如果点了取消，就不上传
      if (res.didCancel) {
        return
      }
      this.setState({
        avatarUploading: true
      })
      var avartarData = "data:image/jpeg;base64," + res.data
      var user = this.state.user
      user.avatar = avartarData
      this.setState({
        user: user
      })
      var timestamp = Date.now()
      var tags = "app,avatar"
      var folder = "avatar"
      var signatureURL = config.api.base + config.api.signature
      var accessToken = this.state.user.accessToken
      request.post(signatureURL, {
          accessToken: accessToken,
          timestamp: timestamp,
          type: "avatar"
        })
        .then((data) => {
          if (data && data.success) {
            var signature = `folder=${folder}&tags=${tags}&timestamp=${timestamp}${CLOUDINARY.api_secret}`
            signature = sha1(signature)
            var body = new FormData()
            body.append("folder", folder)
            body.append("signature", signature)
            body.append("tags", tags)
            body.append("api_key", CLOUDINARY.api_key)
            body.append("resource_type", "image")
            body.append("file", avartarData)
            body.append("timestamp", timestamp)
            this._upload(body)
          }
        })
        .catch((e) => {
          AlertIOS.alert(e.message)
        })
    })
  }
  _upload(body) {

    var xhr = new XMLHttpRequest()
    var url = CLOUDINARY.image
    xhr.open("post", url)
    xhr.onload = () => {
        if (xhr.status !== 200) {
          AlertIOS.alert(xhr.responseText)
          return
        }
        if (!xhr.responseText) {
          AlertIOS.alert("请求失败")
          return
        }
        var res
        try {
          res = JSON.parse(xhr.responseText)
        } catch (e) {
          AlertIOS.alert(e.message)
        }
        if (res && res.public_id) {
          var user = this.state.user
          user.avatar = res.public_id
          this.setState({
            ...user,
            avatarUploading: false,
            avatarProgress: 0
          })
          this._asyncUser(true)
        }
      }
      // 进度条
    if (xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          var per = Number((e.loaded / e.total).toFixed(2))
          this.setState({
            avatarProgress: per
          })
        }
      }
    }
    xhr.send(body)
  }
  _asyncUser(isAvatar) {
    var url = config.api.base + config.api.update
    var user = this.state.user
    request.post(url, user)
      .then((data) => {
        if (data && data.success) {
          var user = data.data
          if (isAvatar) {
            AlertIOS.alert("图片更新成功")
          }
          this.setState({
            user: user
          })
        }
      })
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
            <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto}>
              <Image source={{uri:avatar(user.avatar,"image")}} style={styles.avatarContainer}>
                <View style={styles.avatarBox}>
                {this.state.avatarUploading?
                  <Circle
                    showsText={true}
                    size={75}
                    color="#ee735c"
                    progress={this.state.avatarProgress}
                  />
                  :
                  <View>
                    <Image
                     source={{uri:avatar(user.avatar,"image")}}
                     style={styles.avatar}/>
                    <Text style={styles.avatarTip}>戳这里换头像</Text>
                  </View>
                }
                  
                </View>
              </Image>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto}>
              <Text style={styles.avatarTip}>添加狗狗头像</Text>
              <View style={styles.avatarBox}>
              {this.state.avatarUploading?
                <Circle
                  showsText={true}
                  size={75}
                  color="#ee735c"
                  progress={this.state.avatarProgress}
                />
                :
                <Icon
                  name="ios-cloud-upload-outline"
                  style={styles.plusIcon}/>
              }
              </View>
            </TouchableOpacity>
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
    backgroundColor: "#666"
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
  },
  avatarTip: {
    color: "#fff",
    backgroundColor: "transparent",
    fontSize: 14
  },
  avatar: {
    marginBottom: 15,
    width: width * .2,
    height: width * .2,
    borderRadius: width * .1,
    borderWidth: 1,
    borderColor: "#999",
    resizeMode: "cover"
  }
});