//index.js
//获取应用实例

Page({
  gotoPost:function(){
    wx.switchTab({
      url:'../posts/post'
    })
  }
})
