function uploadImage(){
	var imageInfo = file.files[0];
	window.URL = window.URL || window.webkitURL;
	if (window.URL) {
		image.src = window.URL.createObjectURL(file.files[0]);
	}
	image.onload = function(){
		 context.drawImage(image,0,0,canvas.width,canvas.height)
		 drawToCanvas();
		  window.URL.revokeObjectURL(this.src);
	}
	
}

function drawToCanvas(){
		mirror.width =image.width;
		mirror.height =image.height;
		magnifier.scaleX = mirror.width / canvas.width;
		magnifier.scaleY = mirror.height / canvas.height;
		mirrorContext.drawImage(image,0,0);
		initializationImg = context.getImageData(0,0,canvas.width,canvas.height);
}
	
function changeBGC(target){
	var el = target.parentNode;
	var childs = el.childNodes;
	for(let i=1;i<childs.length;i+=2){
		childs[i].style.backgroundColor = '#1a1a20';
	}
	target.style.backgroundColor = '#26262A';
}

//以下抠图相关函数
function digOutPic(event){
	/*
		pixelData用来存放图片所有的像素信息。
		pointPixelData函数用来返回画布上某一点的像素信息
		getChromaticAberration函数用来返回两个像素点之间的色差
		coordinateChange函数用来转换坐标，返回一个存放xy值的对象coordinate；
		colorData对象存放点击的坐标的rgba信息
	*/
	//var imageData = imageData;
	var imageData = context.getImageData(0,0,canvas.width,canvas.height);
	var pixelData = imageData.data;
	var coordinate  = coordinateChange(event);
	var colorData = pointPixelData(event,pixelData,coordinate);
	var seed = [];
	for(let i=0;i<canvas.width * canvas.height;i++){
		var point = {R:pixelData[4*i+0],
					 G:pixelData[4*i+1],
					 B:pixelData[4*i+2]};

		var chromaticAberration = getChromaticAberration(colorData,pixelData[4*i+0],pixelData[4*i+1],pixelData[4*i+2]);
		if (chromaticAberration<40) {
			seed.push(i)
		}
	}
	seed.forEach(function(item){
		pixelData[4*item+0] = 255;
		pixelData[4*item+1] = 255;
		pixelData[4*item+2] = 255;
	})
	console.log(seed);
	context.putImageData(imageData,0,0,0,0,canvas.width,canvas.height);
}
function pointPixelData(event,pixelData,coordinate){
	/*
		首先要将鼠标在屏幕上的坐标转化为画布上的坐标
	*/
	var i = coordinate.y * canvas.width + coordinate.x;
	return {
		R:pixelData[4*i+0],
		G:pixelData[4*i+1],
		B:pixelData[4*i+2]
	}
}

function coordinateChange(event){
	/*
		wX，wY是鼠标相对于视窗左上角的坐标
	*/
	var wX = event.clientX;
	var wY = event.clientY;
	var bound = canvas.getBoundingClientRect();
	var x = wX - bound.left;
	var y = wY - bound.top;
	return {x,y}
}

function getChromaticAberration(colorData,a,b,c){
	var r = colorData.R - a;
	var g = colorData.G - b;
	var b = colorData.B - c;
	return Math.sqrt(3*r*r + 4*g*g + 2*b*b)
}

//以下的滤镜相关函数
/*
  BWFilter黑白滤镜
  grayscaleFilter灰度滤镜
  invertFilter反色滤镜
  blurFilter模糊滤镜
  mosaicFilter马赛克滤镜
*/
function BWFilter(pixelData,imageData){
	for(let i=0;i<canvas.width * canvas.height;i++){
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
	context.putImageData(imageData,0,0,0,0,canvas.width,canvas.height);
}

function grayscaleFilter(pixelData,imageData){
	for(let i=0;i<canvas.width * canvas.height;i++){
		let r = pixelData[4*i+0];
		let g = pixelData[4*i+1];
		let b = pixelData[4*i+2];
		let gray = r*0.3 + g*0.59 + b*0.11;

		pixelData[4*i+0] = gray;
		pixelData[4*i+1] = gray;
		pixelData[4*i+2] = gray;
	}
	context.putImageData(imageData,0,0,0,0,canvas.width,canvas.height);
		console.log(111)
}

function invertFilter(pixelData,imageData){
	for(let i=0;i<canvas.width * canvas.height;i++){
		let r = pixelData[4*i+0];
		let g = pixelData[4*i+1];
		let b = pixelData[4*i+2];

		pixelData[4*i+0] = 255 - r;
		pixelData[4*i+1] = 255 - g;
		pixelData[4*i+2] = 255 - b;
	}
	context.putImageData(imageData,0,0,0,0,canvas.width,canvas.height);
}

function blurFilter(pixelData,imageData){
	for(let i=2;i<canvas.height-2;i++)
		for(let j=2;j<canvas.width-2;j++){
			let totalr = 0 , totalg = 0 , totalb = 0 ;
			for(let dx = -2;dx<=2;dx++)
				for(let dy=-2;dy<=2;dy++){
					let x = i + dx;
					let y = j + dy;
					let p = x*canvas.width + y;
					totalr += pixelData[4*p+0];
					totalg += pixelData[4*p+1];
					totalb += pixelData[4*p+2];
				}
			let p = i*canvas.width + j;
			pixelData[4*p+0] = totalr / 23;
			pixelData[4*p+1] = totalg / 23;
			pixelData[4*p+2] = totalb / 23;
		}
		context.putImageData(imageData,0,0,0,0,canvas.width,canvas.height);
}

function mosaicFilter(pixelData,imageData){
	var size = 16;
	var totalNum = size * size;
	for(let i=0;i<canvas.height;i+=size)
		for(let j=0;j<canvas.width;j+=size){
			let totalr = 0 , totalg = 0 , totalb = 0 ;
			for(let dx = 0;dx<size;dx++)
				for(let dy=0;dy<size;dy++){
					let x = i + dx;
					let y = j + dy;
					let p = x*canvas.width + y;
					totalr += pixelData[4*p+0];
					totalg += pixelData[4*p+1];
					totalb += pixelData[4*p+2];
				}
			let p = i*canvas.width + j;
			let resr = totalr / totalNum;
			let resg = totalg / totalNum;
			let resb = totalb / totalNum;
			for(let dx = 0;dx<size;dx++)
				for(let dy=0;dy<size;dy++){
					let x = i + dx;
					let y = j + dy;
					let p = x*canvas.width + y;
					pixelData[4*p+0] = resr;
					pixelData[4*p+1] = resg;
					pixelData[4*p+2] = resb;
				}
			
		}
	context.putImageData(imageData,0,0,0,0,canvas.width,canvas.height);
}

//以下打马赛克功能相关函数
/*
  马赛克功能思路是点击某一个点，读取出这个点周围25个像素点的rgb
  通道的平均值，然后把这25个点的像素rgb分别赋上该得到的平均值
  为一个马赛克块。
  点击一下打上九个马赛克块
*/

function mosaic(event){
	var imageData = context.getImageData(0,0,canvas.width,canvas.height);
	var pixelData = imageData.data;
	var coordinate  = coordinateChange(event);
	var size = 5;
	var totalNum = size * size;
	var x = coordinate.x;
	var y = coordinate.y;
	for(let i=y-size;i<y+7;i+=size)
		for(let j=x-size;j<x+7;j+=size){
			var totalr=0, totalb=0,totalg=0;
			for(let dx = -2;dx<=2;dx++)
				for(let dy = -2;dy<=2;dy++){
					let wx = i+dx;
					let wy = j+dy;
					let p = wx*canvas.width + wy;
					totalr += pixelData[4*p+0];
					totalg += pixelData[4*p+1];
					totalb += pixelData[4*p+2];
				}
				let resr = totalr / totalNum;
				let resg = totalg / totalNum;
				let resb = totalb / totalNum;
				for(let dx = -2;dx<=2;dx++)
					for(let dy = -2;dy<=2;dy++){
						let ax = i + dx;
						let ay = j + dy;
						let p = ax*canvas.width + ay;
						pixelData[4*p+0] = resr;
						pixelData[4*p+1] = resg;
						pixelData[4*p+2] = resb;
					}
		}
		context.putImageData(imageData,0,0,0,0,canvas.width,canvas.height);
	
}

//以下是图片放大器相关函数
/*
	放大器显示的原理是：
	在一块离屏画布中绘制原尺寸的image，
	然后将显示的画布中点击的坐标映射到离屏的画布上，
	根据放大镜的半径来确定离屏画布要截取的区域
	将截取的区域放大放大镜中
*/
function drawCanvasWithMagnifier(coordinate){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.drawImage(image,0,0,canvas.width,canvas.height);
	if( magnifier.ismousedown === true ){
        drawMagnifier( coordinate )
    }
}
function drawMagnifier(point){
	var mr = 70;
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
    context.drawImage( mirror , sx , sy , 2*mr , 2*mr , dx , dy , 2*mr , 2*mr )
    context.restore();
}

//以下是添加水印相关函数
/*
  添加水印与放大镜都是采用离屏的canvas原理。即在隐藏画布中绘制要添加
  的水印，然后在才隐藏画布绘制到显示的画布中。
*/
function addWaterMark(){
	var text = prompt('请输入要打上的水印文字');
    if (initializationImg !== undefined && text !==null) {
    	var imageData = context.getImageData(0,0,canvas.width,canvas.height);
    	context.putImageData(initializationImg,0,0,0,0,canvas.width,canvas.height);
    	watermarkcanvas.width = 200;
		watermarkcanvas.height = 100;
		watermarkContext.font = "bold 50px Arial"
	    watermarkContext.lineWidth = "1"
	    watermarkContext.fillStyle = "rgba( 255 , 255 , 255 , 0.2 )"
	    watermarkContext.textBaseline = "middle";
	    watermarkContext.fillText( text , 20 , 30, 160);
    	context.drawImage(watermarkcanvas,canvas.width - watermarkcanvas.width,canvas.height - watermarkcanvas.height);
    }
}

//以下是图像还原函数
function reduceImage(){
	context.putImageData(initializationImg,0,0,0,0,canvas.width,canvas.height);
}