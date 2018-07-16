// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationTitle:"",
    movies:[],
    requestUrl:"",
    totalCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //首先获取movies页面传过来的点击更多的标题，在onReady中设置为more-movie的标题
    var navigationTitle = options.title;
    this.setData({
      navigationTitle: navigationTitle
    })

    //然后获取对应的数据
    var dataURL = '';
    switch (navigationTitle){
      case '正在热映':
        dataURL = app.globalData.doubanBase + "/v2/movie/in_theaters";
      break;
      case '即将上映':
        dataURL = app.globalData.doubanBase + "/v2/movie/coming_soon";
      break;
      case '豆瓣Top250':
        dataURL = app.globalData.doubanBase + "/v2/movie/top250";
      break;
    }
    this.data.requestUrl = dataURL;
    this.getMoviesData(dataURL)
  },

  onReady: function(){
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle
    })
  },

  //@onReachBottom是用来监听用户上划动作，并触及底部的事件函数
  onReachBottom:function(){
    var dataURL = this.data.requestUrl +'?start=' + this.data.totalCount + '&count=20';
    this.getMoviesData(dataURL)
    wx.showNavigationBarLoading();
  },

  //@onPullDownRefresh用来监听用户下拉刷新事件，和onReachBottom事件一样，都需要在app.json或page.json中设置enablePullDownRefresh为true
  onPullDownRefresh:function(){
    console.log(1111)
  },

  getMoviesData:function(url){
    var that = this;
    wx.request({
      url: url,
      method: 'Get',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data);
      },
      fail: function () {
        console.log('api路径出现问题，及时更新代码')
      }
    })
  },

  processDoubanData:function(movieDouban){
    var movies = [];
    for(let index in movieDouban.subjects){
      var subject = movieDouban.subjects[index];
      //处理电影名称，超过六个字符，超过部分...代替
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...'
      }

      var temp = {
        title: title,
        stars: util.formatEverage(subject.rating.stars),
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    if(this.data.movies.length === 0){
      this.setData({
        movies:movies
      })
    }else{
      this.setData({
        movies: this.data.movies.concat(movies)
      })
      wx.hideNavigationBarLoading()
    }
    
    this.data.totalCount +=20;
  }
})