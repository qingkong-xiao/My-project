const formatEverage = Num =>{
  var arr = [];
  var newNum = Num.toString().substring(0,1)
  for(let i=0;i<5;i++){
    if(i<newNum){
      arr.push(1)
    }else{
      arr.push(0)
    }
  }
  return arr;
}

const http = function(url){
  return new Promise((resolve,reject) =>{
    wx.request({
          url: url,
          method: 'Get',
          header: {
              "Content-Type": "json"
          },
          success: (res) =>{
            resolve(res)
          },
          fail: (err) => {
              console.log('api路径出现问题，及时更新代码')
          }
      })
  })
}

module.exports = {
  formatEverage: formatEverage,
  http:http
}
