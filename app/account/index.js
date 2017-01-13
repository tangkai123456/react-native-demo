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
  AlertIOS,
  Modal,
  TextInput
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-picker'
import request from "../common/request.js"
import config from "../common/config.js"
import sha1 from "sha1"
import {
  Circle
} from "react-native-progress"
import Button from 'react-native-button'

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
      avatarUploading: false,
      modalVisible: false
    }
    this._pickPhoto = this._pickPhoto.bind(this)
    this._upload = this._upload.bind(this)
    this._asyncUser = this._asyncUser.bind(this)
    this._edit = this._edit.bind(this)
    this._closeModal = this._closeModal.bind(this)
    this._changeUserState = this._changeUserState.bind(this)
    this._submit = this._submit.bind(this)
    this._logout = this._logout.bind(this)
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
          } else {
            AlertIOS.alert("信息更新成功")
            this._closeModal()
          }
          this.setState({
            user: user
          })
        }
      })
      .catch((e) => {
        AlertIOS.alert(e.message)
      })
  }

  _edit() {
    this.setState({
      modalVisible: true
    })
  }
  _closeModal() {
    this.setState({
      modalVisible: false
    })
  }
  _changeUserState(name, value) {
    var user = this.state.user
    user[name] = value
    this.setState({
      user: user
    })
  }
  _submit() {
    this._asyncUser()
  }
  _logout() {
    this.props.logout()
  }
  componentDidMount() {

  }
  render() {
    var user = this.state.user
    return (
      <View style={styles.tabContent}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
          <Text style={styles.toolbarExtra} onPress={this._edit}>编辑</Text>
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
        <Button  style={styles.btn} onPress={this._logout}>退出登录</Button>
        <Modal animated={true} visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <Icon 
              name="ios-close-outline"
              style={styles.closeIcon}
              onPress={this._closeModal}
              />
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                placeholder="输入狗狗的昵称"
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                defaultValue={user.nickname}
                onChangeText={(text)=>{
                  this._changeUserState("nickname",text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>品种</Text>
              <TextInput
                placeholder="输入狗狗的品种"
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text)=>{
                  this._changeUserState("breed",text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>年龄</Text>
              <TextInput
                placeholder="输入狗狗的年龄"
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text)=>{
                  this._changeUserState("age",text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>性别</Text>
              <Icon.Button
                onPress={()=>{
                  this._changeUserState("gender","male")
                }}
                style={[styles.gender,user.gender==="male"&&styles.genderChecked]}
                name="ios-paw-outline">男
              </Icon.Button>
              <Icon.Button
                onPress={()=>{
                  this._changeUserState("gender","female")
                }}
                style={[styles.gender,user.gender==="female"&&styles.genderChecked]}
                name="ios-paw">女
              </Icon.Button>
            </View>
            <Button  style={styles.btn} onPress={this._submit}>提交</Button>
          </View>
        </Modal>
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
  },
  toolbarExtra: {
    position: "absolute",
    right: 10,
    top: 26,
    color: "#fff",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 14
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff"
  },
  fieldItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: "#eee",
    borderBottomWidth: 1
  },
  label: {
    color: "#ccc",
    marginRight: 10
  },
  inputField: {
    height: 50,
    flex: 1,
    color: "#666",
    fontSize: 14
  },
  closeIcon: {
    position: "absolute",
    width: 40,
    height: 40,
    fontSize: 32,
    right: 20,
    top: 30,
    color: "#ee735c"
  },
  gender: {
    backgroundColor: "#ccc"
  },
  genderChecked: {
    backgroundColor: "#ee735c"
  },
  btn: {
    margin: 10,
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "#ee735c",
    borderWidth: 1,
    borderRadius: 4,
    color: "#ee735c"
  }
});