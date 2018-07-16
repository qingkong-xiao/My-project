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


module.exports = {
  formatEverage: formatEverage
}
