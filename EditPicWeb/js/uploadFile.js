ul[0].onclick = function(event){
	
	//判断图片是否已经绘制到画布中，如果还没有，则alert

	//点击ul的不同list实现不同功能
	var target = event.target;
	changeBGC(target);
	if (target.textContent === "上传图片") {
		file.click();
	}
	if (initializationImg === undefined) {
		if (target.textContent !== "上传图片") {
			alert("请先选择一张图片")
		}
		return
	}
	if (target.textContent === "添加水印") {
		type = 2;
		addWaterMark();
	}
	if (target.textContent === "自动抠图") {
		type = 3;
	}
	if (target.textContent === "图片放大器") {
		type = 4;
	}
	if (target.textContent === "马赛克") {
		type = 5;
	}
	if (target.textContent === "滤镜效果") {
		type = 6;
		ul2[0].style.display = 'block';

	}
	if (target.textContent === "图像还原") {
		type = 7;
		reduceImage();
	}
	if (target.textContent !== "滤镜效果") {
		ul2[0].style.display = 'none';
	}
}

file.onchange = function(){
	uploadImage();
}
canvas.onclick = function(event){
	switch(type){
		case 3:digOutPic(event);
		break;
		case 5:mosaic(event);
		break;
	}
}
canvas.addEventListener('mousedown',function(event){
	if (type === 4) {
		magnifier.coordinate  = coordinateChange(event);
		magnifier.ismousedown = true;
		drawCanvasWithMagnifier(magnifier.coordinate);
	}
})
canvas.addEventListener('mousemove',function(event){
	if (type === 4) {
		if( magnifier.ismousedown === true ){
        	magnifier.coordinate  = coordinateChange(event);
        	drawCanvasWithMagnifier(magnifier.coordinate )
    	}
	}
	
})
canvas.addEventListener('mouseup',function(event){
	if (type === 4) {
		magnifier.ismousedown = false;
		drawCanvasWithMagnifier(magnifier.coordinate )
	}
	
})
canvas.addEventListener('mouseout',function(event){
	if (type === 4) {
		magnifier.ismousedown = false;
		drawCanvasWithMagnifier( magnifier.coordinate )
	}
	
})

ul2[0].onclick = function(event){
	context.putImageData(initializationImg,0,0,0,0,canvas.width,canvas.height);
	var imageData = context.getImageData(0,0,canvas.width,canvas.height);
	var pixelData = imageData.data;
	var target = event.target;
	if (target.textContent === "黑白滤镜") {
		BWFilter(pixelData,imageData)
	}
	if (target.textContent === "灰度滤镜") {
		grayscaleFilter(pixelData,imageData);
	}
	if (target.textContent === "反色滤镜") {
		invertFilter(pixelData,imageData);
	}
	if (target.textContent === "模糊滤镜") {
		blurFilter(pixelData,imageData);
	}
	if (target.textContent === "马赛克滤镜") {
		mosaicFilter(pixelData,imageData);
	}

	
}