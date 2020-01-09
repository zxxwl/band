//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    longitude:0,
    latitude:0,
    user:'',
    name:'',
    userList:'',
    hiddenmodalput:true //通过hidden是否掩藏弹出框的属性，来指定那个弹出框
  },
  //下拉选择取件类型
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //点击按钮指定弹出模态框
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  //获取input值
  user:function(e){
      this.setData({
        name:e.detail.value
      })
  },
  //确认按钮
  confirm: function () {
    var that=this;
    this.setData({
      hiddenmodalput: true,
    })
    wx.request({
      url: 'http://localhost:8080/user/userList',
      method:'POST',
      header:{'content-type':'application/x-www-form-urlencoded;charset=utf-8'},
       data:{
          name:this.data.name,
          tel:this.data.tel,
          address:this.data.address,
       },
      success:function(res){
          console.log(res)
            var resData=res.data;
            that.setData({
              userList:resData
            })
      }
    })
  },
  getxs:function(){
    wx.navigateTo({
      url: '../reward/reward',
      // success:function(){
      //   console.log('已经获取悬赏令')
      // },
      // fail:function(res){

      // },
      // complete:function(res){

      // }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that=this;
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        var longitude=res.longitude;
        var latitude=res.latitude;
        that.setData({
          longitude: longitude,
          latitude: latitude,
        })
      },
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      language: "zh_CN",
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.showLoading({
      title: "定位中",
      mask: true
    }),
    wx.getLocation({
      type: 'gcj02',
      altitude: true,//高精度定位
      //定位成功，更新定位结果
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({
          longitude: longitude,
          latitude: latitude,
          speed: speed,
          accuracy: accuracy
        })
      },
      //定位失败回调
      fail: function () {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },
      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
