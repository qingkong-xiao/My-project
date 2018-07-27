/*
	* @tableSort构造函数会初始化一个config对象，包含了一个table(DOM)对象，一个表头要点击的单元格对象集合
		   初始化一个cache对象，存放用来更新tr列的新数组
*/

function tableSort(options){
	this.config = {
		tableElem:options.tableElem,
		sortableElem:options.sortableElem
	}
	this.cache = {
		newTrArr : []
	}

	this.init(options)
}

/*
	在构造函数的原型链上添加方法，包括@init初始化方法，@sortMethod排序方法
	@init方法主要是做了以下工作，
		1.给表头每个单元格监听click事件
	  2.判断要排序的表格有没有属性为true的data-sorttable，没有的话，就不执行排序
	  3.click事件调用sortMethod方法
*/
tableSort.prototype = {
	constructor : tableSort,
	init:function(options){
		var self = this,
			_config = self.config,
			_cache = self.cache;
		$(_config.sortableElem).each(function(index,item){
			$(item).unbind('click');
			$(item).bind('click',function(e){
				var tagParent = $(this).closest(_config.tableElem),
					tagAttr = $(this).attr("data-sorttable");//表示排序的类型，比如日期，数字等

				if($(tagParent).attr('data-sorttable') == 'true') {
					self._curStyle($(this));
					var index = $(_config.sortableElem,tagParent).index($(this));
				
					
					self._sortMethod(index,tagAttr,$(this));
				}
			});
		});
	},

	_curStyle:function(item){
		var self = this;
		!$(item).hasClass('st-active') && $(item).addClass("st-active").siblings().removeClass("st-active");
		if($(item).hasClass('data-reverse')) {
			$(item).removeClass('data-reverse');
			$(item).addClass('data-normal');
		}else if($(item).hasClass('data-normal')){
			$(item).removeClass('data-normal');
			$(item).addClass('data-reverse');
		}
	},

	_sortMethod:function(index,tagAttr,tagElem){
		var self = this,
			_config = self.config,
			_cache = self.cache;
		_cache.newTrArr = [];	
		var tBodys = $(_config.tableElem)[0].tBodies[0];
		for(var i=0;i<tBodys.rows.length;i++){
			_cache.newTrArr.push(tBodys.rows[i])
		}
		if (tagAttr==='number') {
			_cache.newTrArr.sort(function(td1,td2){
				if($(tagElem).hasClass('data-reverse')) {
					return td1.cells[index].innerHTML - td2.cells[index].innerHTML;
				}else if($(tagElem).hasClass('data-normal')){
					return td2.cells[index].innerHTML - td1.cells[index].innerHTML
				}
			})
		}
		if (tagAttr==='string') {
			_cache.newTrArr.sort(function(td1,td2){
				var str1 = td1.cells[index].innerHTML,
					str2 = td2.cells[index].innerHTML;

				if($(tagElem).hasClass('data-reverse')) {
					return str1.localeCompare(str2);
				}else if($(tagElem).hasClass('data-normal')){
					return str2.localeCompare(str1);
				}	
			});
		}
		if (tagAttr==='date') {
			_cache.newTrArr.sort(function (td1, td2){
				var str1 = td1.cells[index].innerHTML,
					str2 = td2.cells[index].innerHTML;
				
				if($(tagElem).hasClass('data-reverse')) {
					return Date.parse(str1.replace(/-/g,'/')) - Date.parse(str2.replace(/-/g,'/'));
				}else if($(tagElem).hasClass('data-normal')){
					return Date.parse(str2.replace(/-/g,'/')) - Date.parse(str1.replace(/-/g,'/'));
				}
			});	
		}
		// console.log(_cache.newTrArr)
		for(var j =0; j < _cache.newTrArr.length; j++ ) {
			tBodys.appendChild(_cache.newTrArr[j]);
		}
	}
}

/*
**使用方法：在table元素上添加标识属性data-sorttable="true"，为true则可以使用排序
  在表头th元素上添加标示属性data-sorttable，目前支持number，string，date三种排序
  使用时，实例化构造函数，支持传入一个对象参数，该参数标示表格table元素，和所有的表头的th元素
*/