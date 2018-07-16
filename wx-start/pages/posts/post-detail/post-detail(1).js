var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
  data: {
    isMusicPlaying: false
  },

  onLoad: function (option) {
    //首先获取首页传过来的postID
    var postID = option.id;
    this.setData({
      currentID: postID
    })

    var postList = postsData.postList[postID]
    this.setData({
      postData: postList
    })

    //第二步，获取该文章是否已收藏的缓冲。如果没有改缓存，就设置为未收藏
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postID]
      if (postCollected) {
        this.setData({
          collected: postCollected
        })
      }
    } else {
      var postsCollected = {}
      postsCollected[postID] = false
      wx.setStorageSync('posts_collected', postsCollected)
    }

    //第三步，获取全局的背景音乐播放状态，如果正在播放，就把isMusicPlaying设为true
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postID) {
      this.setData({
        isMusicPlaying: true
      })
    }

    this.setMusicMonitor();
  },

  //点击收藏图片,已收藏变未收藏，反之则倒过来
  onColletionTap: function () {
    this.getPostsCollectedAsy();
  },

  //点击分享按钮
  onShareTap: function (event) {
    wx.showActionSheet({
      itemList: ["分享给微信好友", "分享到朋友圈", "分享到QQ", "分享到微博"],
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: '分享',
          content: '确定' + res.tapIndex + '吗'
        })
      }
    })
  },

  //点击播放音乐按钮图片
  onMusicTap: function () {
    var isMusicPlaying = this.data.isMusicPlaying
    var currentId = this.data.currentID
    app.globalData.g_currentMusicPostId = currentId;
    if (isMusicPlaying) {
      this.setData({
        isMusicPlaying: false
      })
      wx.pauseBackgroundAudio()
      app.globalData.g_isPlayingMusic = this.data.isMusicPlaying
    } else {
      this.setData({
        isMusicPlaying: true
      })
      wx.playBackgroundAudio({
        dataUrl: this.data.postData.music.url
      })
      app.globalData.g_isPlayingMusic = this.data.isMusicPlaying
    }
  },

  getPostsCollectedAsy: function () {
    var postsCollected = wx.getStorageSync('posts_collected')
    var postCollected = postsCollected[this.data.currentID]

    postCollected = !postCollected;
    postsCollected[this.data.currentID] = postCollected;
    this.showToast(postsCollected, postCollected)
  },

  //消息提示框
  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      icon: 'success',
      duration: 1000
    })
  },

  //@setMusicMonitor 用来监听背景音乐的播放、暂停和停止事件
  setMusicMonitor: function () {
    wx.onBackgroundAudioPlay(() => {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentID === this.data.currentID) {
        if (app.globalData.g_currentMusicPostId === this.data.currentID) {
          this.setData({
            isMusicPlaying: true
          })
        }
      }
      app.globalData.g_isPlayingMusic = true

    })
    wx.onBackgroundAudioPause(() => {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentID === this.data.currentID) {
        if (app.globalData.g_currentMusicPostId === this.data.currentID) {
          this.setData({
            isMusicPlaying: false
          })
        }
      }
      app.globalData.g_isPlayingMusic = false
    })
    wx.onBackgroundAudioStop(() => {
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    })
  }
})