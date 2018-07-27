// pages/movies/movie-detail/movie-detail.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    movie: {}
  },

  onLoad: function(options) {
    var movieId = options.id;
    var dataURL = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    util.http(dataURL).then((res) => {
      var movie = {};
      movie = {
        title: res.data.title,
        movieImg: res.data.images ? res.data.images.large : "",
        country: res.data.countries[0],
        year: res.data.year,
        wishCount: res.data.wish_count,
        commentCount: res.data.comments_count,
        originalTitle: res.data.original_title,
        stars: util.formatEverage(res.data.rating.stars),
        score: res.data.rating.average,
        casts: this.formatCasts(res.data.casts),
        castsInfo: this.convertToCastInfos(res.data.casts),
        director: res.data.directors[0],
        generes: res.data.genres.join("/"),
        summary: res.data.summary
      }
      this.setData({
        movie: movie
      })
    })
  },

  formatCasts: function(casts) {
    var string = "";
    for (var index in casts) {
      string = string + casts[index].name + '/'
    }
    return string.substring(0, string.length - 1)
  },

  convertToCastInfos: function(casts) {
    var castsArray = []
    for (var idx in casts) {
      var cast = {
        img: casts[idx].avatars ? casts[idx].avatars.large : "",
        name: casts[idx].name
      }
      castsArray.push(cast);
    }
    return castsArray;
  },

  onReady: function() {
    console.log(this.data.movie)
  }
})