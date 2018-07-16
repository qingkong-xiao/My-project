var postsData = require('../../data/posts-data.js')

Page({
  data:{

  },
  onLoad:function(){
    this.setData({
      postList: postsData.postList
    })
  },

  onPostTap:function(event){
    var current_ID = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + current_ID
    })
  },

  onbannerTap:function(event){
    var current_ID = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + current_ID
    })
  }
})