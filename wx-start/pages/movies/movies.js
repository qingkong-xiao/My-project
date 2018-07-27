var util = require('../../utils/util.js')
var app = getApp();

Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        showmovies: true,
        showSearch: false,
        searchResult: {}
    },
    onLoad: function() {
        var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
        var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
        var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';

        this.getMoviesData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMoviesData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMoviesData(top250Url, "top250", "豆瓣Top250");
    },

    onMoreTap: function(event) {
        var title = event.currentTarget.dataset.title;
        wx.navigateTo({
            url: './more-movie/more-movie?title=' + title
        })
    },

    onfocus: function(event) {
        this.setData({
            showmovies: false,
            showSearch: true
        })
    },
    onBindConfirm: function(event) {
      var string = event.detail.value;
        var dataURL = app.globalData.doubanBase + '/v2/movie/search?q=' + string;
        this.getMoviesData(dataURL, "searchResult", "")
    },

    onCancelImgTap: function() {
        this.setData({
            showmovies: true,
            showSearch: false,
            searchResult: {}
        })
    },

    onMovieTap:function(event){
      var movieId = event.currentTarget.dataset.movieid;
      wx.navigateTo({
        url:'./movie-detail/movie-detail?id=' + movieId
      })
    },

    getMoviesData: function(url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'Get',
            header: {
                "Content-Type": "json"
            },
            success: function(res) {
                that.processDoubanData(res.data, settedKey, categoryTitle);
            },
            fail: function() {
                console.log('api路径出现问题，及时更新代码')
            }
        })
    },

    processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
        var movies = [];
        for (var index in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[index];
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

        var readyData = {};
        readyData[settedKey] = {
            categoryTitle: categoryTitle,
            movies: movies
        }
        this.setData(readyData)
    }
})