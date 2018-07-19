// pages/movies/movie-detail/movie-detail.js
var app = getApp();
Page({
  data: {
  
  },

  onLoad: function (options) {
    var movieId = options.movieId;
    var dataURL = app.globalData.doubanBase + '/v2/movie/subject' + movieId;
    util.http(dataURL).then((res)=>{
      this.setData(res)
    })
  }
})