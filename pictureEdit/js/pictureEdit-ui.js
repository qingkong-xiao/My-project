(function(){
	var _pictureEdit = {};
	var _parameter = {
		setMosaicFilterSize:16,
		setWaterMarkFontSize:30,
		setChromaticAberrationDegree:40,
		setMosaicBlockSize:5,
		setMagnifierSize:70

	};
	var magnifier = {
		ismousedown:false
	}
	var image = new Image;
	var type;
	var initializationImg;
	var imageList=[];
	var Index;
	var $wrapper = document.createElement('div');
	$wrapper.className = 'ui-pictureEdit-wrapper';
	$wrapper.innerHTML = '<canvas id="ui-canvas" width="360" height="480"></canvas>'
	+ '<canvas id="ui-canvas-mirror" style="display:none;"></canvas>'
	+ '<ul class="ui-pictureEdit-options">'
		+	'<li>滤镜效果'
				+ '<ul class="ui-pictureEdit-filter">'
					+'<li>黑白滤镜</li>'
					+'<li>灰度滤镜</li>'
					+'<li>反色滤镜</li>'
					+'<li>模糊滤镜</li>'
					+'<li>马赛克滤镜</li>'
				+'</ul>'
			+'</li>'
			+'<li>添加水印</li>'
			+'<li>自动抠图</li>'
			+'<li>图片放大器</li>'
			+'<li>打马赛克</li>'
			+'<li>图像还原</li>'
		+'</ul>'
		+'<div class="ui-pictureEdit-leftBtn iconfont icon-left"></div>'
		+'<div class="ui-pictureEdit-rightBtn iconfont icon-right"></div>';
	
	document.body.appendChild($wrapper);

	//然后要获取容器内的相关节点
	var $el = document.getElementsByClassName('pictureEdit-ui');
	var $canvas = document.getElementById('ui-canvas');
	var context = $canvas.getContext('2d');
	var $mirrorCanvas = document.getElementById('ui-canvas-mirror');
	var mirrorContext = $mirrorCanvas.getContext('2d');
	var $ul = document.getElementsByClassName('ui-pictureEdit-options');

	
	
	
	for(let i=0;i<$el.length;i++){
		$el[i].addEventListener('click',function(event){
			var target = event.target;
			if (target.nodeName.toLowerCase() === 'img') {
				//执行相关函数
				imageList.forEach((item,index) =>{
					if(item.isSameNode(target)){
						Index = index;
					}
				})
				_pictureEdit.showImage(target);
				
			}
		})
	}

	$ul[0].addEventListener('click',function(event){
		event.stopImmediatePropagation();
		var target = event.target;

		if (target.textContent === '黑白滤镜') {
			_pictureEdit.BWFilter();
			type = 1;
		}
		if (target.textContent === '灰度滤镜') {
			_pictureEdit.grayscaleFilter();
			type = 2;
		}
		if (target.textContent === '反色滤镜') {
			_pictureEdit.invertFilter();
			type = 3;
		}
		if (target.textContent === '模糊滤镜') {
			_pictureEdit.blurFilter();
			type = 4;
		}
		if (target.textContent === '马赛克滤镜') {
			_pictureEdit.mosaicFilter();
			type = 5;
		}
		if (target.textContent === '添加水印') {
			_pictureEdit.addWaterMark()
			type = 6;
		}
		if (target.textContent === '自动抠图') {
			type = 7;
		}
		if (target.textContent === '图片放大器') {
			type = 8;
		}
		if (target.textContent === '打马赛克') {
			type = 9;
		}
		if (target.textContent === '图像还原') {
			_pictureEdit.reduceImage();
		}
	})

	$wrapper.addEventListener('click',function(event){
		event.stopImmediatePropagation();
		var target = event.target;
		if (target.classList.contains('ui-pictureEdit-wrapper')) {
			target.style.display = 'none'
		}
		if(target.classList.contains('ui-pictureEdit-leftBtn')){
			Index = Index-1;
			if(Index < 0){
				Index = imageList.length-1;
			}
			_pictureEdit.showImage(imageList[Index]);
		}
		if(target.classList.contains('ui-pictureEdit-rightBtn')){
			Index = Index+1;
			if (Index>imageList.length-1) {
				Index = 0;
			}
			_pictureEdit.showImage(imageList[Index]);
		}
		
	})

	$canvas.addEventListener('click',function(event){
		event.stopImmediatePropagation();
		switch(type){
			case 7:_pictureEdit.digOutPic(event);
			break;
			case 9:_pictureEdit.mosaic(event);
		}
	})

	$canvas.addEventListener('mousedown',function(event){
		if(type === 8){
			magnifier.coordinate  = _pictureEdit.coordinateChange(event);
			magnifier.ismousedown = true;
			_pictureEdit.drawCanvasWithMagnifier(magnifier.coordinate);
		}
	})

	$canvas.addEventListener('mousemove',function(){
		if(type === 8){
			if( magnifier.ismousedown === true ){
				magnifier.coordinate  = _pictureEdit.coordinateChange(event);
        		_pictureEdit.drawCanvasWithMagnifier(magnifier.coordinate )
			}
		}
	})

	$canvas.addEventListener('mouseup',function(){
		if(type === 8){
			magnifier.ismousedown = false;
			_pictureEdit.drawCanvasWithMagnifier(magnifier.coordinate )
		}
	})

	$canvas.addEventListener('mouseover',function(){
		if(type === 8){
			magnifier.ismousedown = false;
			_pictureEdit.drawCanvasWithMagnifier( magnifier.coordinate )
		}
	})

	/*
		绑定在插件内部的方法
		@getAllNodes 获取指定节点下的所有img元素节点
		@showImage 显示插件界面
		@drawToCanvas 将点击的图片绘制到画布上
		@coordinateChange 获取鼠标相对于画布的坐标
		@BWFilter 黑白滤镜函数
		@grayscaleFilter 灰度滤镜函数
		@invertFilter 反色滤镜函数
		@blurFilter 模糊滤镜函数
		@mosaicFilter 马赛克滤镜函数
		@addWaterMark 添加水印函数
		@digOutPic 自动抠图函数
		@getChromaticAberration 自动抠图算法中获取两点间的色差
		@mosaic 打马赛克函数
		@drawCanvasWithMagnifier 图片放大器相关函数
		@drawMagnifier 将放大后的图片绘制到画布上
		@reduceImage 画布还原函数
		@pointPixelData 获取画布上点击的坐标的rgb通道的值
	*/ 
	_pictureEdit.showImage = function(target){
		$wrapper.style.display = 'block';
		_pictureEdit.drawToCanvas(target);
	}

	_pictureEdit.BWFilter = function(){
		if (type === 1) {
			return
		}else{
			context.putImageData(initializationImg,0,0,0,0,$canvas.width,$canvas.height)
			var imageData = context.getImageData(0,0,$canvas.width,$canvas.height);
			var pixelData = imageData.data;
			for(let i=0;i<$canvas.width * $canvas.height;i++){
			let r = pixelData[4*i+0];
			let g = pixelData[4*i+1];
			let b = pixelData[4*i+2];
			let gray = r*0.3 + g*0.59 + b*0.11;	 
			let v;
				if (gray> 255/2) {
					v = 255;
				}else{
					v = 0;
				};
			pixelData[4*i+0] = v;
			pixelData[4*i+1] = v;
			pixelData[4*i+2] = v;
		}
			context.putImageData(imageData,0,0,0,0,$canvas.width,$canvas.height);
		}
		
	}

	_pictureEdit.grayscaleFilter = function(){
		if (type === 2) {
			return
		}else{
			context.putImageData(initializationImg,0,0,0,0,$canvas.width,$canvas.height)
			var imageData = context.getImageData(0,0,$canvas.width,$canvas.height);
			var pixelData = imageData.data;
			for(let i=0;i<$canvas.width * $canvas.height;i++){
				let r = pixelData[4*i+0];
				let g = pixelData[4*i+1];
				let b = pixelData[4*i+2];
				let gray = r*0.3 + g*0.59 + b*0.11;

				pixelData[4*i+0] = gray;
				pixelData[4*i+1] = gray;
				pixelData[4*i+2] = gray;
			}
			context.putImageData(imageData,0,0,0,0,$canvas.width,$canvas.height);
			console.log(111)
		}
	}

	_pictureEdit.invertFilter = function(){
		if (type ===3 ) {
			return
		}else{
			context.putImageData(initializationImg,0,0,0,0,$canvas.width,$canvas.height)
			var imageData = context.getImageData(0,0,$canvas.width,$canvas.height);
			var pixelData = imageData.data;
			for(let i=0;i<$canvas.width * $canvas.height;i++){
				let r = pixelData[4*i+0];
				let g = pixelData[4*i+1];
				let b = pixelData[4*i+2];

				pixelData[4*i+0] = 255 - r;
				pixelData[4*i+1] = 255 - g;
				pixelData[4*i+2] = 255 - b;
			}
			context.putImageData(imageData,0,0,0,0,$canvas.width,$canvas.height);
		}
	}

	_pictureEdit.blurFilter = function(){
		if (type === 4) {
			return
		}else{
			context.putImageData(initializationImg,0,0,0,0,$canvas.width,$canvas.height)
			var imageData = context.getImageData(0,0,$canvas.width,$canvas.height);
			var pixelData = imageData.data;
			for(let i=2;i<$canvas.height-2;i++)
				for(let j=2;j<$canvas.width-2;j++){
					let totalr = 0 , totalg = 0 , totalb = 0 ;
					for(let dx = -2;dx<=2;dx++)
						for(let dy=-2;dy<=2;dy++){
							let x = i + dx;
							let y = j + dy;
							let p = x*$canvas.width + y;
							totalr += pixelData[4*p+0];
							totalg += pixelData[4*p+1];
							totalb += pixelData[4*p+2];
						}
					let p = i*$canvas.width + j;
					pixelData[4*p+0] = totalr / 23;
					pixelData[4*p+1] = totalg / 23;
					pixelData[4*p+2] = totalb / 23;
				}
				context.putImageData(imageData,0,0,0,0,$canvas.width,$canvas.height);
		}
	}

	_pictureEdit.mosaicFilter = function(){
		if (type === 5) {
			return
		}else{
			var size =Math.floor(_parameter.setMosaicFilterSize);
			if (typeof size !== 'number' || size >20 || size<5) {
				size = 16;
			}
			context.putImageData(initializationImg,0,0,0,0,$canvas.width,$canvas.height)
			var imageData = context.getImageData(0,0,$canvas.width,$canvas.height);
			var pixelData = imageData.data;
			
			var totalNum = size * size;
			for(let i=0;i<$canvas.height;i+=size)
				for(let j=0;j<$canvas.width;j+=size){
					let totalr = 0 , totalg = 0 , totalb = 0 ;
					for(let dx = 0;dx<size;dx++)
						for(let dy=0;dy<size;dy++){
							let x = i + dx;
							let y = j + dy;
							let p = x*$canvas.width + y;
							totalr += pixelData[4*p+0];
							totalg += pixelData[4*p+1];
							totalb += pixelData[4*p+2];
						}
					let p = i*$canvas.width + j;
					let resr = totalr / totalNum;
					let resg = totalg / totalNum;
					let resb = totalb / totalNum;
					for(let dx = 0;dx<size;dx++)
						for(let dy=0;dy<size;dy++){
							let x = i + dx;
							let y = j + dy;
							let p = x*$canvas.width + y;
							pixelData[4*p+0] = resr;
							pixelData[4*p+1] = resg;
							pixelData[4*p+2] = resb;
						}
				}
				context.putImageData(imageData,0,0,0,0,$canvas.width,$canvas.height);
			}
	}

	_pictureEdit.addWaterMark = function(){
		var text = prompt('请输入要打上的水印文字');
    	if (text !==null){
    		var size = _parameter.setWaterMarkFontSize;
    		if (typeof size !== 'number' || size>50 ||size<5) {
    			size = 30;
    		}
    		console.log(size)
    		var imageData = context.getImageData(0,0,$canvas.width,$canvas.height);
    		context.putImageData(initializationImg,0,0,0,0,$canvas.width,$canvas.height);
    		var watermarkcanvas = document.createElement('canvas');
    		var watermarkContext = watermarkcanvas.getContext('2d');
    		watermarkcanvas.width = 120;
			watermarkcanvas.height = 60;
			watermarkContext.font = "bold " + size + "px" + " Arial"
		    watermarkContext.lineWidth = "1"
		    watermarkContext.fillStyle = "rgba( 255 , 255 , 255 , 0.2 )"
		    watermarkContext.textBaseline = "middle";
		    watermarkContext.fillText( text , 10 , 20, 100);
	    	context.drawImage(watermarkcanvas,$canvas.width - watermarkcanvas.width,$canvas.height - watermarkcanvas.height);

    	}
	}

	_pictureEdit.digOutPic = function(event){
		 
			var imageData = context.getImageData(0,0,$canvas.width,$canvas.height);
			var pixelData = imageData.data;
			var coordinate  = _pictureEdit.coordinateChange(event);
			var colorData = _pictureEdit.pointPixelData(event,pixelData,coordinate);
			var seed = [];
			var degree = _parameter.setChromaticAberrationDegree;
			typeof degree !=='number' || degree>100 || degree<10 ? degree=40 : degree
			for(let i=0;i<$canvas.width * $canvas.height;i++){
				var point = {R:pixelData[4*i+0],
							 G:pixelData[4*i+1],
							 B:pixelData[4*i+2]};

				var chromaticAberration =_pictureEdit.getChromaticAberration(colorData,pixelData[4*i+0],pixelData[4*i+1],pixelData[4*i+2]);
				if (chromaticAberration<degree) {
					seed.push(i)
				}
			}

			seed.forEach(function(item){
				pixelData[4*item+0] = 255;
				pixelData[4*item+1] = 255;
				pixelData[4*item+2] = 255;
			})
			context.putImageData(imageData,0,0,0,0,$canvas.width,$canvas.height);
		
	}

	_pictureEdit.mosaic = function(event){
		var imageData = context.getImageData(0,0,$canvas.width,$canvas.height);
		var pixelData = imageData.data;
		var coordinate  = _pictureEdit.coordinateChange(event);
		var size = _parameter.setMosaicBlockSize;
		typeof size !=='number' || size>10 || size<=1 ? size=5 : size
		var totalNum = size * size;
		var x = coordinate.x;
		var y = coordinate.y;
		for(let i=y-size;i<y+size+Math.floor(size/2);i+=size)
			for(let j=x-size;j<x+size+Math.floor(size/2);j+=size){
				var totalr=0, totalb=0,totalg=0;
				for(let dx = -Math.floor(size/2);dx<=Math.floor(size/2);dx++)
					for(let dy = -Math.floor(size/2);dy<=Math.floor(size/2);dy++){
						let wx = i+dx;
						let wy = j+dy;
						let p = wx*$canvas.width + wy;
						totalr += pixelData[4*p+0];
						totalg += pixelData[4*p+1];
						totalb += pixelData[4*p+2];
					}
					let resr = totalr / totalNum;
					let resg = totalg / totalNum;
					let resb = totalb / totalNum;
					for(let dx = -Math.floor(size/2);dx<=Math.floor(size/2);dx++)
						for(let dy = -Math.floor(size/2);dy<=Math.floor(size/2);dy++){
							let ax = i + dx;
							let ay = j + dy;
							let p = ax*$canvas.width + ay;
							pixelData[4*p+0] = resr;
							pixelData[4*p+1] = resg;
							pixelData[4*p+2] = resb;
						}
			}
			context.putImageData(imageData,0,0,0,0,$canvas.width,$canvas.height);
	}

	_pictureEdit.drawCanvasWithMagnifier = function(coordinate){
		context.clearRect(0,0,$canvas.width,$canvas.height);
		context.drawImage(image,0,0,$canvas.width,$canvas.height);
		if( magnifier.ismousedown === true ){
	        _pictureEdit.drawMagnifier( coordinate )
	    }
	}

	 _pictureEdit.drawMagnifier = function(point){

	 	var mr = _parameter.setMagnifierSize;
	 	typeof mr !=='number' || mr>150 || mr<10? mr = 70 :mr;
	    var imageLG_cx = point.x * magnifier.scaleX
	    var imageLG_cy = point.y * magnifier.scaleY
	    var sx = imageLG_cx - mr
	    var sy = imageLG_cy - mr

	    var dx = point.x - mr
	    var dy = point.y - mr

	    context.save();
	    context.beginPath();
	    context.arc(point.x,point.y,mr,0,2*Math.PI);
	    context.clip();
	    context.drawImage( $mirrorCanvas , sx , sy , 2*mr , 2*mr , dx , dy , 2*mr , 2*mr )
	    context.restore();
	 }

	_pictureEdit.reduceImage = function(){
		context.putImageData(initializationImg,0,0,0,0,$canvas.width,$canvas.height);
	}


	_pictureEdit.drawToCanvas = function(target){
		image.src = target.getAttribute('src');
		image.onload = function(){
			context.drawImage(image,0,0,$canvas.width,$canvas.height);
			initializationImg = context.getImageData(0,0,$canvas.width,$canvas.height);
			$mirrorCanvas.width =image.width;
			$mirrorCanvas.height =image.height;
			magnifier.scaleX = $mirrorCanvas.width / $canvas.width;
			magnifier.scaleY = $mirrorCanvas.height / $canvas.height;
			mirrorContext.drawImage(image,0,0);
		}
	}

	_pictureEdit.coordinateChange = function(event){
		/*
			wX，wY是鼠标相对于视窗左上角的坐标
		*/
		var wX = event.clientX;
		var wY = event.clientY;
		var bound = $canvas.getBoundingClientRect();
		var x = wX - bound.left;
		var y = wY - Math.floor(bound.top);
		return {x,y}
	}

	_pictureEdit.pointPixelData = function(event,pixelData,coordinate){
		/*
			首先要将鼠标在屏幕上的坐标转化为画布上的坐标
		*/
		var i = coordinate.y * $canvas.width + coordinate.x;
		return {
			R:pixelData[4*i+0],
			G:pixelData[4*i+1],
			B:pixelData[4*i+2]
		}
	}

	_pictureEdit.getChromaticAberration = function(colorData,a,b,c){
		var r = colorData.R - a;
		var g = colorData.G - b;
		var b = colorData.B - c;
		return Math.sqrt(3*r*r + 4*g*g + 2*b*b)
	}

	_pictureEdit.getAllNodes = function($node){
		if ($node.hasChildNodes()) {
			let childNodes = $node.childNodes;
			for(let i = 0;i<childNodes.length;i++){
				_pictureEdit.getAllNodes(childNodes[i])
			}
		}else{
			if ($node.nodeName.toLowerCase() === 'img') {
				imageList.push($node);
			}
		}

	}

	for(let i=0;i<$el.length;i++){
		_pictureEdit.getAllNodes($el[i]);
	}

	window._parameter = _parameter;
})()